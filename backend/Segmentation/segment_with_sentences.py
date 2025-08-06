from spacy.language import Language
from spacy.lang.en import English
from spacy.tokens import Doc
import re

nlp = English()


BOUNDS = [
    "\n", "\r"
]


@Language.component("set_custom_boundaries")
def set_custom_boundaries(doc: Doc):
    for token in doc[:-1]:
        if any(s in token.text_with_ws for s in BOUNDS):
            doc[token.i + 1].is_sent_start = True
        if token.is_sent_start or token.i == 0:
            i = 0
            while is_pattern(r"^[^a-zA-Z]+$", doc[token.i+i].text) and token.i+i+1 < len(doc):
                doc[token.i+i+1].is_sent_start = False
                i += 1
    return doc


nlp.add_pipe('sentencizer')
nlp.add_pipe("set_custom_boundaries")


def segment_texts_sentences(idea_input: dict[str, str], min_length=25, **kwargs) -> dict[str, list[str]]:
    segments = {}
    for field, text in idea_input.items():
        text = str(text)
        text_segments = []
        doc = nlp(text)
        text_segments = [sent.text_with_ws for sent in doc.sents]
        segments[field] = text_segments
    return segments


def is_pattern(pattern, string):
    return bool(re.match(pattern, string))
