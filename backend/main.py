from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Types.types import ToolOutput, ToolRequest
from good_grants import Application, fetch_applications, fetch_applications_season, fetch_forms, get_application
from model import Worker
import os
from enum import Enum


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


class RequestData(BaseModel):
    criteria: List[Criterion]
    styleAndTone: str
    furtherHints: str
    toolSettings: ToolSettings


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

# # Serve static files from Vite build
# app.mount("/assets", StaticFiles(directory="frontend_build/assets"), name="assets")


# @app.get("/{full_path:path}")
# async def serve_spa(full_path: str):
#     # Always serve index.html for any non-API route
#     return FileResponse("frontend_build/index.html")


@app.get("/api/dummy")
async def hello() -> ToolOutput:
    return dummy_output


@app.get("/api/get_ideas")
async def get_ideas() -> list:
    return fetch_applications_season()


@app.get("/api/get_idea")
async def get_idea(slug: str):
    return dummy_input


@app.post("/api/request")
async def new_request(request: RequestData) -> ToolOutput:

    return dummy_output


dummy_output: ToolOutput = {
    "assessment": {
        "Scalability": {
            "rating": 4,
            "arguments": [
                {
                    "text": "The project targets public secondary schools in Benin with potential for regional replication in Côte d'Ivoire, Senegal, and Togo, indicating a clear vision for scale.",
                    "evidence": [2, 8]
                },
                {
                    "text": "The use of a comprehensive and adaptive evaluation framework, along with digital elements such as a cross-analysis platform, supports future scalability.",
                    "evidence": [11, 18]
                },
                {
                    "text": "Scalability may be constrained by the need for significant involvement from ministries and extensive teacher training across multiple countries.",
                    "evidence": [9, 12, 28]
                }
            ]
        },
        "Feasibility": {
            "rating": 3,
            "arguments": [
                {
                    "text": "Collaboration with the Ministry of Education and reputable partners such as SDC and Plan International Benin enhances feasibility.",
                    "evidence": [9, 20]
                },
                {
                    "text": "The project outlines concrete steps, including teacher training and monitoring and evaluation, showing practical planning.",
                    "evidence": [12, 19]
                },
                {
                    "text": "There is limited detail on the resources required for technical infrastructure, teacher training scale, and ongoing maintenance, which may hinder practical implementation.",
                    "evidence": []
                }
            ]
        },
        "Partnership Engagement": {
            "rating": 5,
            "arguments": [
                {
                    "text": "Key external and internal partners are clearly identified, including governmental, international, and civil society organizations.",
                    "evidence": [9, 20, 21, 31]
                },
                {
                    "text": "The involvement of the Ministry of Education as a political partner demonstrates strong stakeholder engagement at the policy level.",
                    "evidence": [9]
                }
            ]
        },
        "Value Proposition": {
            "rating": 4,
            "arguments": [
                {
                    "text": "The project addresses a well-articulated problem of poor quality and fragmented secondary education by proposing an integrated and systemic solution.",
                    "evidence": [5, 6, 33]
                },
                {
                    "text": "It provides a multi-faceted approach that includes evaluation, motivation, teacher training, and competition, aiming for holistic improvement.",
                    "evidence": [11, 12, 16, 37]
                },
                {
                    "text": "The proposal could further clarify how its outcomes will be sustained and differentiated from previous attempts beyond initial implementation.",
                    "evidence": []
                }
            ]
        },
        "Team": {
            "rating": 3,
            "arguments": [
                {
                    "text": "The team composition includes experts such as pedagogues, statisticians, and data scientists, which is well-aligned to the technical and educational needs.",
                    "evidence": [11]
                },
                {
                    "text": "There is little detail provided on the team's previous experience, track record, or specific leadership structure, which weakens confidence in execution.",
                    "evidence": []
                }
            ]
        },
        "Innovativeness": {
            "rating": 4,
            "arguments": [
                {
                    "text": "The project introduces student participation in evaluation data entry, a cross-analysis platform, and competition-based motivation, which are novel in this context.",
                    "evidence": [14, 16, 18]
                },
                {
                    "text": "Combining evaluation reform with motivational programming and digital tools indicates a creative and current approach to education sector challenges.",
                    "evidence": [11, 15, 18]
                },
                {
                    "text": "Some elements, such as teacher training and continuous assessment, are standard interventions, slightly limiting the degree of innovation.",
                    "evidence": [12, 35]
                }
            ]
        }
    },
    "idea_fields": [
        {"field_name": "slug", "segments": ["EvKeoexp"], "first_index": 0},
        {"field_name": "title", "segments": [
            "Enhancing Secondary Education through Improved Evaluation and Motivation"], "first_index": 1},
        {"field_name": "Country *", "segments": ["BJ"], "first_index": 2},
        {
            "field_name": "Problem *",
            "segments": [
                "Secondary education is a crucial stage in a student's academic journey.",
                "The quality of education received at this level plays a significant role in shaping their future.",
                "However, in Benin and many developing countries, secondary education is often of poor quality, resulting in low student achievement levels.",
                "This project aims to improve the quality of public secondary education by introducing a comprehensive evaluation system and fostering a culture of motivation among students."
            ],
            "first_index": 3
        },
        {
            "field_name": "Idea in short *",
            "segments": [
                "A comprehensive evaluation framework in public secondary school to foster student engagement, motivation, and improved academic performance."
            ],
            "first_index": 7
        },
        {"field_name": "Other countries", "segments": [
            "['Côte dIvoire', 'Senegal', 'Togo']"], "first_index": 8},
        {
            "field_name": "Idea description *",
            "segments": [
                "The project will be implemented in collaboration with the Ministry of Education as the political partner.",
                "The following steps will be taken to achieve the project's objectives:",
                "1.\tDevelop an evaluation framework: A team of experts, including pedagogues, statisticians, and data scientists, will develop a comprehensive and adaptive evaluation framework that includes continuous assessment, periodic tests, and student feedback mechanisms.",
                "2.\tTeacher training: A training program will be developed and delivered to teachers by the project team.",
                "This will include training on administering tests, grading, and providing feedback to students.",
                "3.\tStudent involvement: Students will be involved in the evaluation process by typing the scores in the database.",
                "Recognition programs, extracurricular activities, and mentoring programs will incentivize students to participate in academic and non-academic activities.",
                "4.\tCompetitions: To transform evaluation into a competition within students and schools, the project will introduce competitions where students from different schools can compete against each other.",
                "5.\tExam paper correction: the project will finance the correction process.",
                "6.\tCross-analysis platform: A platform will be set up to allow cross-analysis between schools' participation in the program",
                "7.\tMonitoring and evaluation: The project team, including  will monitor the project's progress and evaluate its effectiveness using data-driven insights."
            ],
            "first_index": 9
        },
        {
            "field_name": "External partners *",
            "segments": [
                "Swiss Agency for Development and Cooperation (SDC)",
                "Plan International Benin"
            ],
            "first_index": 20
        },
        {
            "field_name": "Internal partners *",
            "segments": [
                "GIZ - Promoting education for life and work EDUVIDA"
            ],
            "first_index": 21
        },
        {
            "field_name": "Expertise and motivation *",
            "segments": [
                "We are driven by a commitment to transform public secondary school poor education resources, inadequate teacher training and ineffective evaluation system into opportunities.",
                "Supporting our project will empower GIZ to create lasting impact on the educational landscape in Benin, where parents often invest an imprtant portion of their revenue in their children's education.",
                "The technical cooperation will yield long-term benefits, transforming lives and communities through education, and ensuring that every dollar generates significant value and meaningful change."
            ],
            "first_index": 22
        },
        {
            "field_name": "Target Group and their needs *",
            "segments": [
                "Our solution mainly targets include:",
                "* **public secondary school student** who often face educational challenges due to the poor quality of available rsources and infrastructure, are in crucial need of a system that not only evaluates their academic progress but also motivates them to excel.",
                "The proposal aims to address these needs by implementing a comprehensive evaliation system that includes continuous assessments, periodic tests, and feedback mechanisms.",
                "* **public secondary school teachers** who play a pivotal role in this process, require training and resources to effectively administer this sytem and foster a culture of motivation among students.",
                "* **Policy Makers and Government Officials*",
                "*: Responsible for creating and enforcing policies in the education sector",
                "*  **Civil Society Organizations and NGOs**: Engaged in activities related to promote student excellency and performance",
                "By involving students directly in the evaluation process, recognizing their achievements, and introducing competitive elements, the project seeks to increase- student engagement and self-esteem, and academic performance as well as to improve teaching quality through regular feedback and to create an environment that encourags both students and teachers to strive for excellence, ultimately leading to better educational outcomes."
            ],
            "first_index": 25
        },
        {
            "field_name": "Benefit over existing solutions *",
            "segments": [
                "Existing efforts are often fragmented a and lack the necessary support and integration into the education system, resulting in minimal impact on student engagement, motivation, and overall academic performance.",
                "This project main objectives are:",
                "1.\tTo develop a comprehensive evaluation system for public secondary schools that includes continuous assessment, periodic tests, and student feedback.",
                "2.\tTo provide training and resources to teachers to enable them to implement the evaluation system effectively.",
                "3.\tTo create a culture of motivation among students through various initiatives such as recognition programs, extracurricular activities, and mentoring.",
                "4.\tTo improve the overall academic performance of public secondary schools by increasing student engagement and participation.",
                "5.\tTo transform evaluation into a competition within students and schools.",
                "6.\tTo finance exam paper correction and ensure that it is done promptly and accurately."
            ],
            "first_index": 33
        }
    ]
}


dummy_input = {
    "slug": "jmbxXoVa",
    "title": "Kanna Herb",
    "Country *": "ET",
    "Problem *": "As more consumers are becoming health-conscious, seeking fresh and organic herbs globally, the demand for high-quality herb farming is increasing. Even though the sector is very attractive, the sector is dominated by private investors from harvesting herbs, to processing and exporting, due to this many traditional herb small holder farmers are not able to benefit as they are not provided with a convenient method for production of herbs and access for selling their product.\r\nKanna Herb in collaboration with different entities contribute to alleviating problems faced by farmers:\r\n1.\t**Seed Quality**: Limited availability of improved seeds affecting yields and resilience.\r\n2.\t**Technology Adoption**: limited access to irrigation systems hinders productivity improvement.\r\n3.\t**Technical Knowledge**: limited access to extension services, training, and information on modern farming practices and sustainable agriculture.\r\nKanna Herb in collaboration with different entities works towards alleviating the below mentioned problems of the potential buyers:\r\n1.\t**Quality and Consistency**: ensuring the efficacy, safety, and marketability of the herb products. \r\n2.\t**Supply Chain Reliability**: timely delivery of herbs, meet quantity and quality requirements.\r\n3.\t**Product Differentiation**: on the based of quality, and sustainability practices.\r\n4.\t**Sustainable Sourcing**: by considering environmental and social responsibility.",
    "Idea in short *": "Kanna Herb process and supply organic herbs to local and global market by engaging traditional farmers to create modern sustainable agriculture practice.",
    "Other countries": [
        "Kenya",
        "South Sudan",
        "Sudan"
    ],
    "Idea description *": "Kanna Herb is dedicated to sourcing, packaging, and distributing high-quality herbal products in an ethical, organic, and Earth-friendly manner to local and global market by working with a traditional farmer in modernizing the agricultural system by resonating it’s moto **“Small Plots, Big Flavors: Harvesting Nature's Finest Herbs”**. \r\nOur product offerings will include variety of commonly used herbs such as basil, dill, cilantro, chives, thyme, marjoram, oregano, parsley, mint, sage, tarragon, lemon verbena, catnlp, rosemary, and marjoram.  \r\n\r\nAccording to European Union’s publication: _Ethiopia is an ideal place for the production and export of flowers, vegetables, fruits, and herbs. Ethiopia has more than 122 billion cubic meters of ground and surface water. There are millions of hectares of fertile land. The country has a trainable and disciplined working force, diverse Agro-ecological zones, and supportive investment policy frameworks. Ethiopia also has affordable electricity rates. _ \r\n \r\nFurthermore, Kanna Herb will strive towards bringing a difference in: \r\n-\tSetting up sustainable and environmentally friendly agricultural system.\r\n-\tFocusing agricultural investment on the small holders.\r\n-\tDirectly involving the women and youth in Agro-processing. \r\n-\tProducing the product using locally available natural fertilizer(compost)\r\n-\tInvolving the farmers in development, implementation, advocacy and monitoring etc.",
    "External partners *": "Private Sectors \r\n-\tShipping Companies, courier service providers, banks \r\nPublic sectors that have a stack within the Herb Agro-Processing includes: \r\n-\tMinistry of Agriculture \r\n-\tMinistry Of Trade and Regional Integration \r\n-\tFood and Beverage Industry Research and Development Center \r\n-\tEthiopian Agricultural Businesses Corporation \r\n-\tIndustrial Parks Development Corporation\r\n-\tEthiopian Ministry of Industry",
    "Internal partners *": "-\tClimate Change Cluster \r\n     - GIZ-CLM\r\n-\tGreen Innovation Centers – GIZ- GIC \r\n-\tForests for Future\r\n-\tSustainability in Agri. Supply Chains\r\n-\tSupporting Sustainable Agricultural Productivity",
    "Expertise and motivation *": "Kanna Herb is driven by a blinding passion and desire to make a difference in the organic herb Agro-processing. Our motivation delight in knowing that we could make a difference in the life’s of small hold traditional frames by generate income to improve their livelihoods, we would be able to contribute to the fight against poverty and other ills. \r\n\r\n**Ararsa Kebede** (Rural Development Adviser): BSC in Natural Resource Management, MSC in Environmental Study:- specialization in Sustainable natural Resource Management, 14 years’ experience in soil & water conservation, Climate Sensitive Innovation for Land Management, Agro-forestry practices, Step Slop Agricultural Landscape Management, Development and Food Security, Environmental Social management Framework \r\n**Abayneh Tilahun** (Procurement & Contract Specialist): BA Degree in Procurement and Supply Chain management, more than 14 years' experience in Marketing Strategy, Supply Chain Management, \r\n**Bezaye Berhanu** (Procurement and Contract Specialist): BA Degree in Procurement & Supply Chain management, 10 years’ experience in Supply Chain Management, Agro-processing Logistics,  \r\n**Sintayehu Mengistie** (Economic cooperation& private sector development Advisor) MA in business administration 24 of experience in capacity building of private sector, economic advisory, business & project management.\r\n**Ephrem Abera** (Finance Specialist): Bachelor’s degree in accounting, hands of experience in Financing, auditing, & financial reporting.",
    "Target Group and their needs *": "The target groups for Kanna Herb and their needs are addressed below:\r\n\r\n1. Farmers: by emphasizing sustainability long-term viability of Agro-processing sectors would enable protect resources for future generations by works closely with local traditional small holder farmers that operates on small plots of land.  \r\n   + Needs: improved seeds, fertilizer, pesticide, and guidance by professionals.\r\n2. Government bodies like Ministry of Agriculture and Ministry of Industry: have a role in promoting sustainable agricultural practices, environmental conservation.\r\n   +\tNeeds: attract investments, stimulate economic activity, job creation. \r\n3. Development Organization and NGO’s: play a vital role in supporting the Agro-processing industry in developing regions. \r\n    + Needs: facilitate workshops to farmers and Agro-processors on best practices, technology adoption, field demonstrations to enhance skills and knowledge. \r\n4. Local Market: As Ethiopia is serving as the headquarters of major international organizations, due to its it has a great potential from Health-conscious consumers prioritizing fresh, organic herbs in their daily diet, restaurants, and hotels. \r\n   + Needs: diversified high quality herbs in a timely manner\r\n5. Pharmaceutical Industries, wholesalers in Ethiopia and Globally: are target groups when it comes to herbs plant-derived products. \r\n   + Needs: reliable supplier for high-quality herbs fulfilling regulatory requirement, diverse herb products; benefit from economies of scale,",
    "Benefit over existing solutions *": "In Ethiopia more than 67% of the population dependent on subsistence and rain-fed farming. Lack of awareness about herb farming and Agro-processing has significantly hinder the development of the potential benefits from the sector. Traditional farmers do not realize the potential of herbs as high-value crops and miss out a great opportunity. \r\n\r\nKanna Herb will strive in raising awareness about herb Agro-processing in unlocking the sector's potential by providing range of fresh organic herb products to the local market and export to the global market by working closely with local traditional farmers and other stack holders to create sustainable agriculture practices.   \r\n\r\nGovernments benefit immensely from the development of the herb Agro-processing through significant socio-economic growth, job creation, rural development, improved food security, foreign exchange, and country’s position in international trade.\r\n\r\nSmall-scale farmers can benefit from farming of herb’s fast maturity in smallholding by generating income and contribute to the overall development of their communities, on average herb will require 20- 90 days till they reach maturity.\r\n\r\nS NO. \tHerb Name \t        Maturity period \r\n1.\t\t      Coriander \t           40-45 days \r\n2.\t\t      Basil \t                    65 to 70 days \r\n3.\t\t      Dill \t                        40 to 50 days\r\n4.\t\t      Cilantro\t               30 days\t\t      \r\n7.\t\t      Parsley\t                 90 - 100 days\r\n8.\t\t      Mint \t                    100-120 days"
}
