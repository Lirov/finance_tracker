# 1. Base image
FROM python:3.12-slim

# 2. Workdir
WORKDIR /app

# 3. Install system deps (psycopg2 needs them)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy app code
COPY app ./app

# 6. Expose port
EXPOSE 8080

# 7. Start FastAPI with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
