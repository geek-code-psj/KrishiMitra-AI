# KrishiMitra AI - Production Dockerfile
# Multi-stage build for optimized image size

# =============================================================================
# Stage 1: Base Python image
# =============================================================================
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libsndfile1 \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# Stage 2: Builder (install dependencies)
# =============================================================================
FROM base as builder

WORKDIR /build

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# =============================================================================
# Stage 3: ML Model Downloader
# =============================================================================
FROM base as model-downloader

WORKDIR /models

# Download pre-trained models
COPY backend/scripts/download_models.py ./
ARG AIKOSH_API_KEY
ENV AIKOSH_API_KEY=${AIKOSH_API_KEY}

# Cache models in separate layer
RUN python download_models.py --cache-dir /models/cache || echo "Model download skipped"

# =============================================================================
# Stage 4: Production Runtime
# =============================================================================
FROM base as production

WORKDIR /app

# Create non-root user for security
RUN useradd -m -u 1000 krishimitra && \
    mkdir -p /app/data /app/logs /app/models && \
    chown -R krishimitra:krishimitra /app

# Copy Python dependencies from builder
COPY --from=builder /root/.local /home/krishimitra/.local
ENV PATH=/home/krishimitra/.local/bin:$PATH

# Copy models (optional - can also mount volume)
COPY --from=model-downloader --chown=krishimitra:krishimitra /models/cache /app/models

# Copy application code
COPY --chown=krishimitra:krishimitra backend/app ./app
COPY --chown=krishimitra:krishimitra backend/scripts ./scripts

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Switch to non-root user
USER krishimitra

# Expose port
EXPOSE 8000

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
