from typing import TypedDict

from pydantic import BaseModel


class ToolRequest(BaseModel):
    criteria: list[str]
    idea: dict[str, str | list[str]]


class Assessment(BaseModel):
    argument: str
    evidence: list[int]


class Evaluation(BaseModel):
    rating: int
    assessment: list[Assessment]


argument = TypedDict(
    "argument", {"text": str, "evidence": list[int]})

AssessmentType = dict[str, TypedDict(
    "Evaluation", {"rating": int, "arguments": list[argument]})]

SegmentIdeaField = TypedDict("SegmentIdeaField", {
    "field_name": str,
    "segments": list[str],
    "first_index": int,
})

ToolOutput = TypedDict("ToolOutput", {
    "assessment": AssessmentType,
    "idea_fields": list[SegmentIdeaField]
})
