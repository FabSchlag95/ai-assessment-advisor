from typing import List, TypedDict
from pydantic import BaseModel
from enum import Enum


class Argument(BaseModel):
    text: str
    evidence: list[int]


class Evaluation(BaseModel):
    rating: int
    arguments: list[Argument]


argument = TypedDict(
    "argument", {"text": str, "evidence": list[int]})

AssessmentType = dict[str, TypedDict(
    "Evaluation", {"rating": int, "arguments": list[argument]})]


class Segment(TypedDict):
    text: str
    idx: int


SegmentIdeaField = TypedDict("SegmentIdeaField", {
    "field_name": str,
    "segments": list[Segment],
})

ToolOutput = TypedDict("ToolOutput", {
    "assessment": AssessmentType,
    "idea_fields": list[SegmentIdeaField]
})


class ModelEnum(str, Enum):
    gpt_3_5_turbo = "gpt-3.5-turbo"
    gpt_4_1 = "gpt-4.1"


class Criterion(BaseModel):
    name: str
    hint: str
    scale: str


class ToolSettings(BaseModel):
    cot: bool
    criticalness: int
    model: ModelEnum

class FormValues(BaseModel):
    criteria: List[Criterion]
    styleAndTone: str
    furtherHints: str
    toolSettings: ToolSettings

class RequestData(BaseModel):
    formValues: FormValues
    ideaData:dict
