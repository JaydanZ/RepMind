FROM python:3.10-slim

WORKDIR /app

# Install packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

CMD ["fastapi","run","main.py","--port","8000"]