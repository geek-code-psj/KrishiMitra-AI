"""
KrishiMitra AI - API Router
Aggregates all v1 API endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    voice,
    irrigation,
    predictions,
    geospatial,
    climate,
    farmers,
    auth,
    sync,
    prices,
    credit,
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(farmers.router, prefix="/farmers", tags=["Farmers"])
api_router.include_router(voice.router, prefix="/voice", tags=["Voice AI"])
api_router.include_router(irrigation.router, prefix="/irrigation", tags=["Irrigation"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["Predictions"])
api_router.include_router(prices.router, prefix="/prices", tags=["Prices"])
api_router.include_router(credit.router, prefix="/credit", tags=["Credit"])
api_router.include_router(geospatial.router, prefix="/geospatial", tags=["Geospatial"])
api_router.include_router(climate.router, prefix="/climate", tags=["Climate"])
api_router.include_router(sync.router, prefix="/sync", tags=["Offline Sync"])


@api_router.get("/docs", include_in_schema=False)
async def docs_redirect():
    """Redirect to documentation."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/docs")
