FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .

# For local development with Docker, we optimize dependencies to avoid huge PyTorch downloads if not needed.
# Since this uses an external Ollama, we can keep the requirements as is.
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run the application
# We use uvicorn for single-proc or gunicorn with uvicorn workers for production
CMD ["gunicorn", "app.main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
