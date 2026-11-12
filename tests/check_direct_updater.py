"""Check packages with the unmodified validator from nukeador/deckyup.

The pinned upstream source is downloaded to a temporary directory for testing;
it is never bundled with Crosshair. Requires Python 3.12 and network access.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import importlib
import json
from pathlib import Path, PurePosixPath
import re
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request


UPDATER_COMMIT = "5856b8177c254cb7625f978d3214ba186ba88e7b"
UPDATER_SOURCE = "https://github.com/nukeador/deckyup/tree/" + UPDATER_COMMIT


def fetch(url):
    request = urllib.request.Request(url, headers={
        "User-Agent": "Decky-Direct-Updater/0.1",
        "Accept": "application/vnd.github+json" if "api.github.com/" in url else "*/*",
    })
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                content = response.read(8 * 1024 * 1024 + 1)
            if len(content) > 8 * 1024 * 1024:
                raise ValueError("Upstream metadata exceeds size limit")
            return content
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
            time.sleep(1)


def load_validator(directory):
    tree = json.loads(fetch(
        "https://api.github.com/repos/nukeador/deckyup/git/trees/"
        + UPDATER_COMMIT + "?recursive=1"
    ))
    if tree.get("truncated") or tree["sha"] != UPDATER_COMMIT:
        raise ValueError("Cannot verify pinned Direct Updater source")
    modules = [item["path"] for item in tree["tree"]
               if item["path"].startswith("direct_updater/") and item["path"].endswith(".py")]

    def download(module):
        relative = PurePosixPath(module)
        if relative.is_absolute() or ".." in relative.parts:
            raise ValueError("Invalid upstream module path")
        source = fetch("https://raw.githubusercontent.com/nukeador/deckyup/"
                       + UPDATER_COMMIT + "/" + module)
        path = directory.joinpath(*relative.parts)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(source)

    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(download, modules))
    sys.path.insert(0, str(directory))
    return (
        importlib.import_module("direct_updater.package_validation"),
        importlib.import_module("direct_updater.github_releases"),
        importlib.import_module("direct_updater.github_web"),
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", nargs="?", type=Path)
    parser.add_argument("--repo", help="Public owner/repository to download and validate")
    parser.add_argument("--version", help="Release version, for example 1.8.2")
    args = parser.parse_args()
    if bool(args.archive) == bool(args.repo):
        parser.error("Choose either a local archive or --repo")
    if args.repo and not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", args.repo):
        parser.error("Invalid owner/repository")
    if args.repo and not args.version:
        parser.error("--repo requires --version")
    version = args.version or json.loads(Path("package.json").read_text(encoding="utf-8"))["version"]
    plugin = {"id": "Crosshair", "name": "Crosshair", "package_name": "crosshair", "version": "0.0.0"}
    print("Direct Updater validator: " + UPDATER_SOURCE, flush=True)
    with tempfile.TemporaryDirectory(prefix="crosshair-updater-check-") as temporary:
        workspace = Path(temporary)
        validation, releases, web = load_validator(workspace / "source")
        if args.archive:
            result = validation.validate_package(
                args.archive.resolve(), "Crosshair", version,
                expected_root="Crosshair", expected_package_name="crosshair",
            )
            print("Local ZIP accepted: " + result["version"], flush=True)
            return

        tag = "v" + version
        release = json.loads(fetch("https://api.github.com/repos/" + args.repo
                                   + "/releases/tags/" + urllib.parse.quote(tag, safe="")))
        choices, ambiguous = releases.compatible_releases(plugin, [release])
        if ambiguous or len(choices) != 1:
            raise ValueError("Direct Updater could not select exactly one compatible release ZIP")
        asset = choices[0][2]
        page = web.AssetPage(args.repo, tag)
        page.feed(fetch("https://github.com/" + args.repo + "/releases/expanded_assets/"
                        + urllib.parse.quote(tag, safe="")).decode("utf-8"))
        candidates = [item for item in page.assets if item["name"] == asset["name"]]
        if not page.has_list or len(candidates) != 1:
            raise ValueError("Direct Updater could not identify the ZIP on GitHub's asset page")
        web_asset = candidates[0]
        if not asset.get("digest") or asset["digest"] != web_asset.get("digest"):
            raise ValueError("GitHub API and asset page SHA-256 values differ")
        for source, metadata in (("GitHub API", asset), ("GitHub asset page", web_asset)):
            staged = validation.stage_download(
                metadata, args.repo, "Crosshair", version, workspace / "staged",
                expected_root="Crosshair", expected_package_name="crosshair",
            )
            if "sha256:" + staged["hash"] != asset["digest"]:
                raise ValueError("Staged ZIP SHA-256 differs from GitHub")
            print(source + ": compatible ZIP and SHA-256 accepted (" + staged["hash"] + ")", flush=True)


if __name__ == "__main__":
    main()
