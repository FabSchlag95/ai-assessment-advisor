from fastapi import applications
import requests
import os
from dotenv import load_dotenv
import json
load_dotenv()

GG_API_KEY = os.environ.get("GOODGRANTS_API_KEY")
GG_BASE_URL = os.environ.get("GOODGRANTS_BASE_URL")
GG_HEADERS = {
    'x-api-key': GG_API_KEY,
    'Accept': 'application/vnd.Creative Force.v2.3+json',
}


class Application:
    def __init__(self, data):
        self.data = data
        self.slug = data["slug"]
        self.title = data["title"]
        self._scoring = {}

    def __str__(self):
        return json.dumps(self.data, indent=2)

    @property
    def fields(self):
        return {field["label"]["en_GB"]: field["value"] for field in self.data["application_fields"]}

    # @property
    # def output(self):
    #     outputs = [
    #         {
    #             criterion["name"]["en_GB"]: {
    #                 "value": criterion["value"],
    #                 "max_score": criterion["max_score"],
    #                 "comments": [c for comment in criterion["comments"] if (c := comment.get("comment"))]
    #             } for criterion in idea["rating"]["scores"]["criteria"]
    #         } for idea in self.ideas if idea
    #     ]
    #     return outputs

    # @property
    # def input(self):
    #     exclude = ["Image *",
    #                "Elevator Pitch Video *", "Pitch Deck *"]
    #     return [
    #         {
    #             "title": idea["title"],
    #             "slug": idea["slug"],
    #             **{k: v for k, v in idea["fields"].items() if not k in exclude}
    #         } for idea in self.ideas if idea
    #     ]

    # def to_dict(self):
    #     return list(zip(self.input, self.output))


def recursively_fetch_pages(response):
    if (next_page_url := response.get("next_page_url")):
        new_response = requests.get(next_page_url, headers=GG_HEADERS).json()
        new_response["data"].extend(response["data"])
        return recursively_fetch_pages(new_response)
    else:
        return response


def fetch_forms(season="all"):
    try:
        response = requests.get(
            f"{GG_BASE_URL}/form", params={"season": season}, headers=GG_HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None


def fetch_applications(
    title=None, category=None, chapter=None, status=None,
    payment_status=None, price=None, review_status=None, moderation=None,
    grant_status=None, season=None, form=None, tag=None, deleted=None,
    applicant=None, per_page=None, page=None, order=None, dir=None,
    archived=None, updated_at=None
):
    params = {
        "title": title,
        "category": category,
        "chapter": chapter,
        "status": status,
        "payment_status": payment_status,
        "price": price,
        "review_status": review_status,
        "moderation": moderation,
        "grant_status": grant_status,
        "season": season,
        "form": form,
        "tag": tag,
        "deleted": deleted,
        "applicant": applicant,
        "per_page": per_page,
        "page": page,
        "order": order,
        "dir": dir,
        "archived": archived,
        "updated_at": updated_at,
    }

    params = {k: v for k, v in params.items() if v is not None}

    try:
        response = requests.get(
            f"{GG_BASE_URL}/application", params=params, headers=GG_HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None


def fetch_applications_season(season="all"):
    form_data = fetch_forms(season=season)
    forms = (form_data or {}).get("data", [])

    applications = []

    if forms:
        for form in forms:
            applications_ = (fetch_applications(
                form=form["slug"]) or {}).get("data", [])
            print(applications_)
            applications.extend(applications_
                                or [])
    return applications


def fetch_score_sets(
):

    params = {
        "per_page": 100,
        "page": 1
    }

    response = requests.get(f"{GG_BASE_URL}/score-set",
                            headers=GG_HEADERS, params=params)

    if response.status_code == 200:
        data = response.json()["data"]

        keys = [
            "slug",
            "form",
            "mode",
            "name",
        ]

        def transform(k, v): return v["en_GB"] if k == "name" else v

        print(f"count: {len(data)}")
        return [{k: transform(k, v) for k, v in d.items() if k in keys} for d in data]
    else:
        raise Exception(
            f"Failed to fetch leaderboard: {response.status_code} - {response.text}")


def fetch_leaderboard(
    score_set,
    application=None,
    category=None,
    chapter=None,
    tag=None,
    archived=None,  # "only", "all", "none"
    per_page=100,
    page=1,
    order=None,     # e.g., "category", "chapter", "division", etc.
    dir=None        # "asc" or "desc"
):

    params = {
        "score_set": score_set,
        "application": application,
        "category": category,
        "chapter": chapter,
        "tag": tag,
        "archived": archived,
        "per_page": per_page,
        "page": page,
        "order": order,
        "dir": dir
    }

    # Remove keys with None values
    params = {k: v for k, v in params.items() if v is not None}

    response = requests.get(f"{GG_BASE_URL}/leaderboard",
                            headers=GG_HEADERS, params=params)

    if response.status_code == 200:
        return recursively_fetch_pages(response.json())
    else:
        raise Exception(
            f"Failed to fetch leaderboard: {response.status_code} - {response.text}")


def get_application(slug):
    try:
        response = requests.get(
            f"{GG_BASE_URL}/application/{slug}", headers=GG_HEADERS)
        response.raise_for_status()
        return Application(response.json())
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None


def get_assignments(
    page=1,
    per_page=100,
    status=None,         # 'none', 'in_progress', 'complete', 'abstained'
    score_set=None,
    panel=None,
    tag=None,
    season=None,
    method=None,         # 'automatic', 'manual', 'random', 'stray'
    reviewer=None,
    state=None,          # 'undecided', 'approved', 'rejected'
    chapter=None,
    category=None
):

    params = {
        "page": page,
        "per_page": per_page,
        "status": status,
        "score_set": score_set,
        "panel": panel,
        "tag": tag,
        "season": season,
        "method": method,
        "reviewer": reviewer,
        "state": state,
        "chapter": chapter,
        "category": category
    }

    # Remove None values
    params = {k: v for k, v in params.items() if v is not None}

    response = requests.get(f"{GG_BASE_URL}/assignment",
                            headers=GG_HEADERS, params=params)
    if response.status_code == 200:
        response = recursively_fetch_pages(response.json())
        return response
    else:
        raise Exception(
            f"API call failed: {response.status_code} - {response.text}")
