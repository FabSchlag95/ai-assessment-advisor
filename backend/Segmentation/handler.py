
from typing import Callable, Tuple


def format_segmentation(segments_per_field: dict[str, list[str]], segment_prefix: str = "<segment {index}>\n", segment_postfix: str = "\n") -> dict[str, str]:
    """
    @params: 
        segments_per_field: dict[list[str]] = dict of fields with segments 
        segment_prefix: str = the prefix before each segment; must contain {index}
        segment_postfix: str = the postfix after each segment;
        field_title_prefix: str = the prefix for the field title e.g. # or ##
        field_postfix: str = after each field
    """
    segmented_texts_per_field = {}
    index = 0
    for field, segments in segments_per_field.items():
        formatted_segments = []
        for segment in segments:
            text = f"{segment_prefix.format(index=index)}{segment}{segment_postfix}"
            formatted_segments.append(text)
            index += 1
        segmented_texts_per_field[field] = ''.join(formatted_segments)
    return segmented_texts_per_field


def segment_and_format(texts_per_field: dict[str, str], segmentation_function: Callable[[dict[str, str]], dict[str, list[str]]], segment_prefix: str = "<segment {index}>\n", segment_postfix: str = "\n", field_title_prefix: str = "##", field_postfix: str = "\n\n", **segmentation_props) -> tuple[str, dict[str, list[str]]]:
    """
    @params: 
        texts_per_field: dict[str] = dict of input texts
        segmentation_function:Callable = the function that creates a dict of fields with segments from a dict of field with texts
        segment_prefix: str = the prefix before each segment; must contain {index}
        segment_postfix: str = the postfix after each segment;
        field_title_prefix: str = the prefix for the field title e.g. # or ##
        field_postfix: str = after each field
        **segmentation_props = max_length, min_length, etc.
    """
    formatted_idea = ""
    segments_per_field = segmentation_function(
        texts_per_field, **segmentation_props)
    texts_per_field = format_segmentation(
        segments_per_field, segment_prefix, segment_postfix)
    for field, text in texts_per_field.items():
        formatted_idea += f"{field_title_prefix}{field}\n{text}{field_postfix}"

    return formatted_idea, segments_per_field
