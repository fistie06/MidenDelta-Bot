# Local preview with correct JavaScript MIME types.
# Windows' registry often maps .js/.mjs to text/plain, which makes browsers block the site's ES modules
# (black page, no header, no animations). This forces the right types.
# Usage: py serve.py   (Windows)  |  python3 serve.py  (macOS/Linux)  ->  http://localhost:5176
import functools, http.server, os

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
                      ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml"}

site = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site")
print("MidenDelta preview: http://localhost:5176  (Ctrl+C to stop)")
http.server.ThreadingHTTPServer(("", 5176), functools.partial(Handler, directory=site)).serve_forever()
