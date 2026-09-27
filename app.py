"""
Flask 3.0 port of the original PHP site (index.php, gallery/*.php, play/*.php).

Ported 1:1 in behavior and URL scheme (query-string routing on `/`) so every
existing hardcoded link in doc/*.html keeps working unchanged. The legacy
.php files this replaces have been removed; everything else (lib/, res/,
doc/*.html content fragments, gallery/*/ demo pages, play/*/menu.json,
play/chart/resource/) is untouched and served as static files.

This app is no longer what's deployed (web/ - a static Vue3 SPA - is). Both
play/ui and play/chart have been fully replaced by web/ (PlayUi.vue +
src/demos/ui/*.vue, and PlayChart.vue + src/demos/chart/*.vue respectively)
and their routes removed accordingly - play/*/menu.json is still served as a
static asset (web/'s PlayUiMenu.vue and PlayChart.vue read it directly).

Content fragments under doc/ contain no PHP logic (confirmed while porting -
they're plain HTML), so they're reused verbatim via Jinja `{% include %}`
instead of being rewritten.
"""

import json
import os

from flask import Flask, abort, request, send_from_directory, session
from flask import render_template as _render_template
from jinja2 import ChoiceLoader, FileSystemLoader

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# `static_folder="."` would serve the whole project root, including app.py,
# docker-compose.yml, requirements.txt, templates/ (leaking unrendered Jinja
# source) and .git/ - disable Flask's automatic static route entirely
# (static_folder=None) and serve only the original site's own asset tree via
# an explicit allowlist below (serve_asset).
app = Flask(__name__, static_folder=None, template_folder="templates")
app.secret_key = os.environ.get("SECRET_KEY", "dev-only-change-me")

# Templates live in templates/ (new, Flask-only files) but also need to
# `{% include %}` the original doc/*.html fragments straight from the repo
# root - search both.
app.jinja_loader = ChoiceLoader([
    FileSystemLoader(os.path.join(BASE_DIR, "templates")),
    FileSystemLoader(BASE_DIR),
])

# Only these top-level entries from the original site are real, public
# assets (css/js/img libs, docs fragments, gallery demos, play assets) - the
# denylist approach (serve everything except known-sensitive files) is too
# easy to get wrong as the repo grows, so this is an explicit allowlist
# instead.
ALLOWED_ASSET_DIRS = {"lib", "res", "doc", "gallery", "play"}
ALLOWED_ASSET_FILES = {"sitemap.xml", "BingSiteAuth.xml", "google8e753b5dd9357d31.html"}


@app.route("/<path:filename>")
def serve_asset(filename):
    top = filename.split("/", 1)[0]
    if filename not in ALLOWED_ASSET_FILES and top not in ALLOWED_ASSET_DIRS:
        abort(404)
    return send_from_directory(BASE_DIR, filename)


def render_template(name, **context):
    return _render_template(name, **context)


def read_json(path):
    with open(os.path.join(BASE_DIR, path), encoding="utf-8") as f:
        return json.load(f)


def starts_with(haystack, needle):
    return bool(haystack) and haystack.startswith(needle)


# --------------------------------------------------------------------------
# Main site (was index.php)
# --------------------------------------------------------------------------

@app.route("/")
def index():
    lang_param = request.args.get("lang")
    if lang_param in ("ko", "en"):
        session["lang"] = lang_param
    lang = session.setdefault("lang", "en")

    page = request.args.get("p")
    ctx = {"page": page, "lang": lang}

    if starts_with(page, "gallery."):
        gallery_id = page[len("gallery."):]
        pkg_path = f"gallery/{gallery_id}/package.json"
        if not os.path.exists(os.path.join(BASE_DIR, pkg_path)):
            abort(404)
        ctx["gallery_id"] = gallery_id
        ctx["gallery_json"] = read_json(pkg_path)
        ctx["gallery_has_thumbnail"] = os.path.exists(
            os.path.join(BASE_DIR, f"gallery/{gallery_id}/thumbnail.png")
        )
    elif page == "gallery":
        ctx["gallery_list"] = build_gallery_list()

    return render_template("index.html", **ctx)


def build_gallery_list():
    """Port of gallery/list.php's directoryList(): one entry per gallery/<name>/
    directory that has a package.json. The original's sort (dirs containing
    their own subdirectories first, then alphabetical) simplifies to plain
    alphabetical here since every gallery/* project happens to contain
    subdirectories of its own (checked directly against this repo's content),
    making that primary sort key a no-op tie in practice."""
    items = []
    gallery_root = os.path.join(BASE_DIR, "gallery")
    for name in os.listdir(gallery_root):
        full = os.path.join(gallery_root, name)
        if not os.path.isdir(full):
            continue
        pkg_path = os.path.join(full, "package.json")
        if not os.path.exists(pkg_path):
            continue
        with open(pkg_path, encoding="utf-8") as f:
            info = json.load(f)
        items.append({
            "name": name,
            "info": info,
            "has_thumbnail": os.path.exists(os.path.join(full, "thumbnail.png")),
        })
    items.sort(key=lambda x: x["name"])
    return items


# play/ui (was play/ui/index.php, metadata.php, loader.php) and play/chart
# (was play/chart/index.php, metadata.php, export.php) have both been fully
# replaced by web/ (PlayUi.vue + src/demos/ui/*.vue, and PlayChart.vue +
# src/demos/chart/*.vue) - routes removed along with the templates/html/json
# they rendered. play/*/menu.json is still served as a static asset (web/'s
# usePlayUiMenu.ts and usePlayChartMenu.ts read it directly).


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
