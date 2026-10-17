"""Regenerate saved ISO 15919 text after editing the annotation call.

In a temporary Python virtual environment, install aksharamukha==2.3.
Run `make build`, then `python _scripts/generate_annotation_iso.py`, then
`make build` again to include the refreshed JSON. This is an authoring tool;
Aksharamukha is not needed by Jekyll or visitors' browsers.
"""
import json
from html.parser import HTMLParser
from pathlib import Path

from aksharamukha import transliterate

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = {
    "mr": "Devanagari", "hi": "Devanagari", "sa": "Devanagari",
    "kok": "Devanagari", "ne": "Devanagari", "bn": "Bengali",
    "te": "Telugu", "ta": "Tamil", "kn": "Kannada", "ml": "Malayalam",
    "gu": "Gujarati", "or": "Oriya", "as": "Assamese", "pa": "Gurmukhi",
}


class Sections(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.language = None
        self.texts = {}

    def handle_starttag(self, tag, attrs):
        if tag == "section":
            language = dict(attrs).get("lang")
            self.language = language if language in SCRIPTS else None
            if self.language:
                self.texts[self.language] = {}

    def handle_endtag(self, tag):
        if tag == "section":
            self.language = None

    def handle_data(self, text):
        text = text.strip()
        if self.language and text:
            self.texts[self.language][text] = transliterate.process(
                SCRIPTS[self.language], "ISO", text, nativize=False
            )


if __name__ == "__main__":
    parser = Sections()
    parser.feed((ROOT / "_site/annotation/index.html").read_text())
    if not parser.texts:
        raise SystemExit("No annotation sections found; run make build first.")
    output = ROOT / "assets/json/annotation-iso.json"
    output.write_text(json.dumps(parser.texts, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(parser.texts)} languages to {output}")
