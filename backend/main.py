from typing import Any
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PydanticModels import RequestData
from good_grants import fetch_applications_season
from model import Model


app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assessment_cache: dict[str, Any] = {}


@app.get("/api/get_ideas")
async def get_ideas() -> list:
    return fetch_applications_season()


@app.post("/api/generate_assessment")
async def post_request(request: RequestData) -> dict:
    if (request_key := request.model_dump_json()) in assessment_cache:
        return {"response": assessment_cache[request_key]}
    idea = request.ideaData
    m = Model(request)
    assessment = m.generate_assessment(idea)
    assessment_cache[request_key] = assessment
    return {"response": assessment}

###############################################################################
