import os
from langchain_openai import ChatOpenAI
from pydantic import SecretStr, create_model
from langchain_core.output_parsers import PydanticOutputParser
from Segmentation.handler import segment_and_format
from Segmentation.segment_with_sentences import segment_texts_sentences
from Types.types import AssessmentType, Evaluation, ToolRequest, SegmentIdeaField, ToolOutput

OPEN_AI_KEY = SecretStr(os.getenv("OPEN_AI_API") or "")

if not OPEN_AI_KEY:
    raise ValueError("OpenAI key not defined.")


class Worker:
    model = ChatOpenAI(name="gpt-3.5-turbo",
                       temperature=0.7, api_key=OPEN_AI_KEY)

    def __init__(self, request: ToolRequest) -> None:
        print(request)
        self.__parser = None
        self.__criteria = request.criteria
        self.__idea = {key: str(val) for key, val in request.idea.items()}
        self.__prompt = PROMPT

    def __invoke_prompt(self, **inputs) -> str:
        return self.__prompt.format(**inputs)

    def __invoke_model(self, prompt: str) -> str:
        result = self.model.invoke(prompt)
        return str(result.content)

    def __preprocess(self):
        idea_text, segments_per_field = segment_and_format(
            self.__idea, segmentation_function=segment_texts_sentences)
        print(f"{idea_text=}\n{segments_per_field=}")
        idea_fields: list[SegmentIdeaField] = []
        current_index = 0
        for field, segments in segments_per_field.items():
            current_index += len(segments)
            idea_fields.append({
                "field_name": field,
                "first_index": current_index,
                "segments": segments
            })
        return {"idea_text": idea_text, "criteria": self.__criteria, }, idea_fields

    def generate_assessment(self) -> ToolOutput:
        inputs, idea_fields = self.__preprocess()
        prompt = self.__invoke_prompt(**inputs)
        model_result = self.__invoke_model(prompt)
        model_result_parsed: AssessmentType = self.output_parser.parse(
            model_result)
        return {
            "assessment": model_result_parsed,
            "idea_fields": idea_fields
        }

    @property
    def output_parser(self):
        if self.__parser:
            return self.__parser

        if not self.__criteria:
            raise ValueError("No criteria defined.")

        _criteria = {criterion: (
            Evaluation, ...) for criterion in self.__criteria}
        Response = create_model("Response", **_criteria)  # type: ignore
        self.__parser = PydanticOutputParser(pydantic_object=Response)
        return self.__parser


PROMPT = """
You are an expert advisor for Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ), evaluating project proposals.
The proposal will be shown in segments. Each segment contains one sentence and has segment marker in front e.g.: <<2>>This is the second sentence.

Your task is to critically assess the proposal based on the clear criteria listed below.
For each criterion, give a rating from 1 (poor) to 5 (excellent).
Write positive and negative arguments (as bullet points) in accordance with that rating.

Each argument must be one to two sentences long, clearly stated, and substantiated by specific segments (cited by numbers).
Only list segment numbers that offer clear and relevant evidence for your argument.
You may omit stating evidence if your argument does not require specific proof.
You may cite sequential segments if needed for better understanding. But always list them separately for example [1,2,3], and not [1-3]!

Your output must follow the schema below. Be precise, critical, and avoid guessing or hallucinating.

[SCHEMA]

```json
{{
    "<CRITERION>": {{
        "rating": 1 | 2 | 3 | 4 | 5, // INTEGER; 1 (poor) to 5 (excellent)
        "assessment": {{ 
            "argument": string // positive or negative assessment argument as short key point;  
            "evidence": int[] // list the segment numbers here for segments that support your argument
        }}[] // list multiple arguments;
    }},
    ...
}}
```

[CRITERIA]
{criteria}

[IDEA]
{idea_text}
"""
