"""
KrishiMitra AI - Main Application
FastAPI backend for comprehensive farmer decision support system
"""

import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import structlog

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import configure_logging
from app.services.cache import RedisCache
from app.db.session import engine, init_db

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    configure_logging()
    logger.info("KrishiMitra AI starting up", version="1.0.0")

    # Initialize database
    await init_db()

    # Initialize Redis cache
    app.state.cache = RedisCache()
    await app.state.cache.connect()

    logger.info("All services initialized successfully")

    yield

    # Shutdown
    logger.info("KrishiMitra AI shutting down")
    await app.state.cache.disconnect()


# Create FastAPI application
app = FastAPI(
    title="KrishiMitra AI API",
    description="Comprehensive AI-powered Farmer Decision Support System",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time header and logging."""
    start_time = time.time()
    request_id = request.headers.get("X-Request-ID", "unknown")

    # Add request context
    structlog.contextvars.clear_contextvars()
    structlog.contextvars.bind_contextvars(
        request_id=request_id,
        farmer_id=request.headers.get("X-Farmer-ID", "anonymous"),
        path=request.url.path,
        method=request.method,
    )

    try:
        response = await call_next(request)
        process_time = time.time() - start_time

        response.headers["X-Process-Time"] = str(process_time)
        response.headers["X-Request-ID"] = request_id

        logger.info(
            "Request completed",
            status_code=response.status_code,
            duration_ms=round(process_time * 1000, 2),
        )

        return response

    except Exception as e:
        logger.error("Request failed", error=str(e), exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )


# Include API routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "services": {
            "api": "up",
            "database": "up",
            "cache": "up",
        },
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "KrishiMitra AI",
        "version": "1.0.0",
        "description": "AI-Powered Farmer Decision Support System",
        "docs": "/api/v1/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
