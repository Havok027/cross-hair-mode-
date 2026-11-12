"""Static regression checks for the documented evdev button table."""
import ast
import pathlib
import unittest

SOURCE = pathlib.Path(__file__).resolve().parents[1].joinpath("main.py").read_text(encoding="utf-8")
TREE = ast.parse(SOURCE)

def assignment(name):
    for node in TREE.body:
        if isinstance(node, ast.Assign) and any(
            isinstance(target, ast.Name) and target.id == name for target in node.targets
        ):
            return ast.literal_eval(node.value)
    raise AssertionError(f"{name} not found")

class FaceButtonMappingTests(unittest.TestCase):
    def test_face_buttons_map_to_steam_abxy(self):
        mapping = assignment("EVDEV_TO_STEAM")
        self.assertEqual(mapping[0x130], (0,))  # BTN_SOUTH -> A
        self.assertEqual(mapping[0x131], (1,))  # BTN_EAST -> B
        self.assertEqual(mapping[0x134], (2,))  # BTN_WEST -> X
        self.assertEqual(mapping[0x133], (3,))  # BTN_NORTH -> Y

    def test_select_and_triggers_remain_supported(self):
        mapping = assignment("EVDEV_TO_STEAM")
        triggers = assignment("EVDEV_TRIGGERS")
        self.assertIn(35, mapping[0x13A])  # View/Select
        self.assertEqual(triggers[0x05], 29)  # RT

if __name__ == "__main__":
    unittest.main()
