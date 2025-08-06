# syntax=docker/dockerfile:1.6
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies first (better layer caching)
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source (but not .env thanks to .dockerignore)
COPY . .

EXPOSE 8000

# If a runtime secret is provided at /run/secrets/app_env, export vars before start
CMD ["/bin/sh", "-c", "if [ -f /run/secrets/app_env ]; then export $(grep -v '^#' /run/secrets/app_env | xargs); fi; exec uvicorn main:app --host 0.0.0.0 --port 8000"]

