## Base Image
FROM python:3.10-slim

## Update work dir
WORKDIR /app

## Install packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

## Copy over files
COPY . .

CMD ["fastapi","run","main.py","--port","8000"]