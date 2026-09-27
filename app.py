"""
Flask 3.0 port of the original PHP site (index.php, gallery/*.php, play/*.php).

Ported 1:1 in behavior and URL scheme (query-string routing on `/`, the same
`/play/chart/` path) so every existing hardcoded link in doc/*.html keeps
working unchanged. The legacy .php files this replaces have been removed;
everything else (lib/, res/, doc/*.html content fragments, gallery/*/ demo
pages, play/**/*.css|js|json) is untouched and served as static files.

This app is no longer what's deployed (web/ - a static Vue3 SPA - is), and
is now only useful for local play/chart development (play/chart hasn't been
converted yet). play/ui has been fully replaced by web/ and its routes
removed accordingly.

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


def read_text(path, default=None):
    full = os.path.join(BASE_DIR, path)
    if not os.path.exists(full):
        if default is not None:
            return default
        raise FileNotFoundError(full)
    with open(full, encoding="utf-8") as f:
        return f.read()


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


# --------------------------------------------------------------------------
# Play: shared menu loading (was play/header.php + play/menu.php)
# --------------------------------------------------------------------------

def load_menu(menu_json_path, page_code):
    """Loads menu.json and resolves the active item for `page_code`, mirroring
    play/header.php's per-group `list` filtering and play/menu.php's
    common-style-first group ordering + active-item resolution.

    The original's group sort comparator (`return $a->title > $b->title`)
    returns only a boolean, which is a known PHP usort footgun (no signal for
    "a < b") - not reproduced here, this just sorts by title correctly."""
    raw = read_json(menu_json_path)
    group = raw["group"]
    flat_list = raw["list"]

    for g in group:
        g["list"] = [item for item in flat_list if item.get("type") == g["type"]]

    data = flat_list[0] if flat_list else None
    data_index = 0

    common_style = group.pop(0) if group else None
    group.sort(key=lambda g: g["title"])
    if common_style is not None:
        group.insert(0, common_style)

    for g in group:
        visible = [item for item in g["list"] if not item.get("hide", False)]
        g["list"] = visible
        for j, item in enumerate(visible):
            item["active"] = item.get("code") == page_code
            if item["active"]:
                data = item
                data_index = j

    return group, data, data_index


# --------------------------------------------------------------------------
# Play: Chart (was play/chart/index.php, metadata.php)
# --------------------------------------------------------------------------
#
# export.php's force-download behavior is no longer reimplemented here -
# play/chart/chart.js's exportTextFile() now POSTs straight to jui-app-server
# (https://feisty-rigging-490112-v2.appspot.com/export), the same
# standalone Flask service that already serves this repo's menu.json/
# facebookgroup data copies, instead of a locally duplicated route.

CHART_DIR = "play/chart"


@app.route("/play/chart/")
def play_chart_index():
    page_code = request.args.get("p")
    group, data, data_index = load_menu(f"{CHART_DIR}/menu.json", page_code)
    csv = data.get("csv", True) if data else True
    code_content = read_text(f"{CHART_DIR}/json/{data['code']}.js", default="") if data else ""

    return render_template(
        "play/chart/index.html",
        group=group, data=data, data_index=data_index, csv=csv, code_content=code_content,
    )


# play/ui (was play/ui/index.php, metadata.php, loader.php) has been fully
# replaced by web/ (the Vue3 SPA's PlayUi.vue + src/demos/ui/*.vue) - routes
# removed along with the templates/html/json they rendered. play/ui/menu.json
# is still served as a static asset (web/'s PlayUiMenu.vue reads it directly).


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
