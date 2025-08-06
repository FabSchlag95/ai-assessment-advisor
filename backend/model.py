import os
from unittest import result
from dotenv import load_dotenv
from langchain_core.messages import BaseMessage, SystemMessage
from langchain_core.messages.human import HumanMessage
from langchain_openai import ChatOpenAI
from pydantic import SecretStr, create_model
from langchain_core.output_parsers import PydanticOutputParser
from utils.logging import setup_logger
from segmentation.handler import segment_and_format
from segmentation.segment_with_sentences import segment_texts_sentences
from PydanticModels import AssessmentType, Evaluation, RequestData, SegmentIdeaField
from jinja2 import Environment, FileSystemLoader

load_dotenv()

# Read and sanitize OpenAI API key from environment (handle CRLF/quotes/Bearer)
_raw_key = (os.getenv("OPENAI_API_KEY") or "")
_raw_key = _raw_key.replace("\r", "").replace("\n", "").strip()
if _raw_key.startswith('"') and _raw_key.endswith('"'):
    _raw_key = _raw_key[1:-1]
if _raw_key.startswith("'") and _raw_key.endswith("'"):
    _raw_key = _raw_key[1:-1]
if _raw_key.lower().startswith("bearer "):
    _raw_key = _raw_key[7:]
_raw_key = _raw_key.strip()

OPEN_AI_KEY = SecretStr(_raw_key)
if not _raw_key:
    raise ValueError("OpenAI key not defined.")

env = Environment(loader=FileSystemLoader("."))
system_prompt = env.get_template("prompts/system.j2")
human_prompt = env.get_template("prompts/human.j2")
logger = setup_logger()

class Model:
    def __init__(self, request: RequestData) -> None:
        self.__parser = None
        self.__model = ChatOpenAI(
            model=request.formValues.toolSettings.model,
            temperature=0.5,
            api_key=OPEN_AI_KEY,
        )
        self.__criteria = request.formValues.criteria
        self.__system_prompt = system_prompt.render(request.formValues.model_dump())

    def __create_messages(self, **inputs) -> list[BaseMessage]:
        return [SystemMessage(content=self.__system_prompt), HumanMessage(content=human_prompt.render({**inputs}))]

    def __invoke_model(self, prompt: list[BaseMessage]) -> str:
        result = self.__model.invoke(prompt)
        return str(result.content)

    def __preprocess(self, idea: dict[str, str | list]):
        idea_text, segments_per_field = segment_and_format(
            idea, segmentation_function=segment_texts_sentences)
        idea_fields: list[SegmentIdeaField] = []
        current_index = 0
        for field, segments in segments_per_field.items():
            idea_fields.append({
                "field_name": field,
                "segments": [{"text": seg, "idx": i+current_index} for i, seg in enumerate(segments)]
            })
            current_index += len(segments)
        return {"idea_text": idea_text, "criteria": self.__criteria, }, idea_fields

    def generate_assessment(self, idea: dict[str, str | list]):
        inputs, idea_fields = self.__preprocess(idea)
        prompt = self.__create_messages(**inputs)

        logger.info(prompt)

        model_result = self.__invoke_model(prompt)
        
        logger.info(model_result)

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

        _criteria = {criterion.name: (
            Evaluation, ...) for criterion in self.__criteria}
        Response = create_model("Response", **_criteria)  # type: ignore
        self.__parser = PydanticOutputParser(pydantic_object=Response)
        return self.__parser
