"""
KrishiMitra AI - SQLAlchemy ORM Models
Matches the schema defined in ARCHITECTURE.md exactly.
Uses SQLite-compatible types for local/edge dev.
"""

import uuid
from datetime import datetime, date
from typing import Optional

from sqlalchemy import (
    String, Float, Integer, Boolean, Text, Date, DateTime,
    ForeignKey, JSON, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class Farmer(Base):
    """Farmer profile table."""
    __tablename__ = "farmers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    phone: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    district_code: Mapped[str] = mapped_column(String(10))
    preferred_language: Mapped[str] = mapped_column(String(5), default="hi")
    farm_size_acres: Mapped[Optional[float]] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    last_active: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    farms: Mapped[list["Farm"]] = relationship("Farm", back_populates="farmer")
    voice_queries: Mapped[list["VoiceQuery"]] = relationship("VoiceQuery", back_populates="farmer")


class Farm(Base):
    """Individual farm plot."""
    __tablename__ = "farms"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    farmer_id: Mapped[str] = mapped_column(ForeignKey("farmers.id"), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(100))
    # Stored as lat/lng floats (PostGIS GEOGRAPHY when using PostgreSQL)
    location_lat: Mapped[Optional[float]] = mapped_column(Float)
    location_lng: Mapped[Optional[float]] = mapped_column(Float)
    soil_type: Mapped[Optional[str]] = mapped_column(String(50))
    total_area: Mapped[Optional[float]] = mapped_column(Float)
    water_source: Mapped[Optional[str]] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    farmer: Mapped[Farmer] = relationship("Farmer", back_populates="farms")
    crop_seasons: Mapped[list["CropSeason"]] = relationship("CropSeason", back_populates="farm")
    irrigation_events: Mapped[list["IrrigationEvent"]] = relationship("IrrigationEvent", back_populates="farm")


class CropSeason(Base):
    """Active crop season on a farm."""
    __tablename__ = "crop_seasons"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    farm_id: Mapped[str] = mapped_column(ForeignKey("farms.id"), nullable=False)
    crop_name: Mapped[str] = mapped_column(String(50), nullable=False)
    variety: Mapped[Optional[str]] = mapped_column(String(50))
    planting_date: Mapped[Optional[date]] = mapped_column(Date)
    expected_harvest: Mapped[Optional[date]] = mapped_column(Date)
    area_cultivated: Mapped[Optional[float]] = mapped_column(Float)
    stage: Mapped[str] = mapped_column(
        String(20), default="germination"
    )  # germination, vegetative, flowering, harvesting
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    farm: Mapped[Farm] = relationship("Farm", back_populates="crop_seasons")


class IrrigationEvent(Base):
    """Scheduled and completed irrigation events."""
    __tablename__ = "irrigation_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    farm_id: Mapped[str] = mapped_column(ForeignKey("farms.id"), nullable=False)
    scheduled_date: Mapped[Optional[date]] = mapped_column(Date)
    actual_date: Mapped[Optional[date]] = mapped_column(Date)
    recommended_duration: Mapped[Optional[int]] = mapped_column(Integer)  # minutes
    actual_duration: Mapped[Optional[int]] = mapped_column(Integer)
    soil_moisture_before: Mapped[Optional[float]] = mapped_column(Float)
    weather_conditions: Mapped[Optional[dict]] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    farm: Mapped[Farm] = relationship("Farm", back_populates="irrigation_events")


class VoiceQuery(Base):
    """Farmer voice query log — for KCC-style advisory learning."""
    __tablename__ = "voice_queries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    farmer_id: Mapped[str] = mapped_column(ForeignKey("farmers.id"), nullable=False)
    audio_url: Mapped[Optional[str]] = mapped_column(Text)
    transcribed_text: Mapped[Optional[str]] = mapped_column(Text)
    detected_language: Mapped[Optional[str]] = mapped_column(String(5))
    intent: Mapped[Optional[str]] = mapped_column(String(50))
    entities: Mapped[Optional[dict]] = mapped_column(JSON)
    response_text: Mapped[Optional[str]] = mapped_column(Text)
    response_audio_url: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    processing_time_ms: Mapped[Optional[int]] = mapped_column(Integer)

    farmer: Mapped[Farmer] = relationship("Farmer", back_populates="voice_queries")


class PricePrediction(Base):
    """Stored commodity price predictions from AIKosh Agmarknet data."""
    __tablename__ = "price_predictions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    commodity: Mapped[str] = mapped_column(String(50), nullable=False)
    market_mandi: Mapped[str] = mapped_column(String(100), nullable=False)
    district_code: Mapped[Optional[str]] = mapped_column(String(10))
    predicted_date: Mapped[date] = mapped_column(Date, nullable=False)
    predicted_price: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_lower: Mapped[Optional[float]] = mapped_column(Float)
    confidence_upper: Mapped[Optional[float]] = mapped_column(Float)
    model_version: Mapped[Optional[str]] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
