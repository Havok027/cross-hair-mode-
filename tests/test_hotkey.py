"""Input regressions runnable without Decky or controller hardware."""
import asyncio
import importlib.util
import logging
import os
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import patch

if sys.platform == "win32":
    sys.modules.setdefault("fcntl", types.SimpleNamespace(ioctl=None))
sys.modules.setdefault("decky", types.SimpleNamespace(
    DECKY_PLUGIN_SETTINGS_DIR=tempfile.gettempdir(), logger=logging.getLogger("test")))
spec = importlib.util.spec_from_file_location("crosshair", Path(__file__).resolve().parents[1] / "main.py")
plugin = importlib.util.module_from_spec(spec)
spec.loader.exec_module(plugin)


def event(code, value):
    return plugin._EVENT.pack(0, 0, plugin.EV_KEY, code, value)


class InputTests(unittest.TestCase):
    def monitor(self, buttons, hold=0, kind="evdev"):
        fired = []
        monitor = plugin.HotkeyMonitor(logging.getLogger("test"), lambda: fired.append(True), lambda _: None)
        monitor.configure(buttons, hold, True)
        device = {"fd": -1, "kind": kind, "path": "fake", "held": frozenset(), "xinput": True,
                  "provides": plugin.SUPPORTED_BUTTONS}
        monitor.devices["fake"] = device
        return monitor, device, fired

    def test_select_with_each_face_button_in_one_read(self):
        for code, steam_id in ((0x130, 0), (0x131, 1), (0x134, 2), (0x133, 3)):
            with self.subTest(button=steam_id):
                monitor, device, fired = self.monitor([35, steam_id])
                data = event(0x13A, 1) + event(code, 1) + event(code, 0) + event(0x13A, 0)
                with patch.object(os, "read", side_effect=[data, BlockingIOError()]):
                    monitor._read(device)
                self.assertEqual(len(fired), 1)
                self.assertEqual(device["held"], frozenset())
                self.assertIn(steam_id, monitor.last_seen)

    def test_quick_hid_reports_are_not_collapsed(self):
        monitor, device, fired = self.monitor([0, 2], kind="hid")
        def report(mask):
            return bytes([0x01, 0, 0x09, 0, 0, 0, 0, 0]) + mask.to_bytes(8, "little")
        with patch.object(os, "read", side_effect=[report(0xC0), report(0), BlockingIOError()]):
            monitor._read(device)
        self.assertEqual(len(fired), 1)
        self.assertFalse(device["held"])

    def test_hold_duration_and_rearm(self):
        monitor, device, fired = self.monitor([35, 2], hold=200)
        device["held"] = frozenset([35, 2])
        monitor._tick(10)
        monitor._tick(10.1)
        self.assertFalse(fired)
        monitor._tick(10.21)
        monitor._tick(10.5)
        self.assertEqual(len(fired), 1)
        device["held"] = frozenset()
        monitor._tick(11)
        device["held"] = frozenset([35, 2])
        monitor._tick(12)
        monitor._tick(12.21)
        self.assertEqual(len(fired), 2)

    def test_select_rt_still_works(self):
        monitor, device, fired = self.monitor([35, 29])
        axis = lambda value: plugin._EVENT.pack(0, 0, plugin.EV_ABS, 0x05, value)
        data = event(0x13A, 1) + axis(255) + axis(0) + event(0x13A, 0)
        with patch.object(os, "read", side_effect=[data, BlockingIOError()]):
            monitor._read(device)
        self.assertEqual(len(fired), 1)

    def test_ui_and_backend_are_deduplicated(self):
        instance = plugin.Plugin()
        instance.settings["hotkey"] = plugin.sanitize_hotkey({"v": 2, "enabled": True, "buttons": [2, 35]})
        with patch.object(instance, "save_settings"), patch.object(instance, "apply"), patch.object(instance, "state", return_value={}):
            asyncio.run(instance.hotkey_toggle("ui"))
            asyncio.run(instance.hotkey_toggle("backend"))
        self.assertTrue(instance.settings["enabled"])

    def test_language_persists_and_stays_out_of_profiles(self):
        with tempfile.TemporaryDirectory() as directory:
            instance = plugin.Plugin()
            instance.settings_path = str(Path(directory) / "settings.json")
            with patch.object(instance, "apply"):
                for language in ("en", "es", "pt"):
                    state = asyncio.run(instance.update_settings({"language": language}))
                    self.assertEqual(state["settings"]["language"], language)
                    restored = plugin.Plugin()
                    restored.settings_path = instance.settings_path
                    restored.load_settings()
                    self.assertEqual(restored.settings["language"], language)
            self.assertEqual(instance.sanitize({"language": "invalid"})["language"], "pt")
            profile = plugin.sanitize_profile({"language": "es"}, "Example")
            self.assertNotIn("language", profile)

    def test_rename_profile_changes_only_the_name(self):
        with tempfile.TemporaryDirectory() as directory:
            instance = plugin.Plugin()
            instance.settings_path = str(Path(directory) / "settings.json")
            asyncio.run(instance.save_profile("10", "Game"))
            before = dict(instance.settings["profiles"]["10"])
            state = asyncio.run(instance.rename_profile("10", "  My   profile  "))
            self.assertEqual([(p["appid"], p["name"]) for p in state["profiles"]], [("10", "My profile")])
            self.assertEqual(set(state["profiles"][0]), {"appid", "name", "enabled", "model", "color", "size", "nudge_x", "nudge_y"})
            after = instance.settings["profiles"]["10"]
            self.assertEqual({k: v for k, v in after.items() if k != "name"}, {k: v for k, v in before.items() if k != "name"})
            asyncio.run(instance.rename_profile("10", "   "))
            asyncio.run(instance.rename_profile("99", "Unknown"))
            self.assertEqual(list(instance.settings["profiles"]), ["10"])
            self.assertEqual(instance.settings["profiles"]["10"]["name"], "My profile")
            restored = plugin.Plugin()
            restored.settings_path = instance.settings_path
            restored.load_settings()
            self.assertEqual(restored.settings["profiles"]["10"]["name"], "My profile")


if __name__ == "__main__":
    unittest.main()
