"""
KrishiMitra AI - Voice Schemas
Pydantic models for voice API endpoints
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class VoiceQueryRequest(BaseModel):
    """Request model for voice query processing."""

    audio_url: str = Field(
        ...,
        description="URL to audio file or base64 encoded audio data",
        examples=["https://storage.example.com/audio/query.wav"]
    )
    language_hint: Optional[str] = Field(
        None,
        description="Optional language code hint (hi, bn, te, etc.)",
        examples=["hi"]
    )
    farmer_id: str = Field(
        ...,
        description="Unique farmer identifier",
        examples=["farmer_12345"]
    )
    location: Optional[Dict[str, float]] = Field(
        None,
        description="Farmer's location (lat, lng)",
        examples=[{"lat": 28.6139, "lng": 77.2090}]
    )
    return_audio: bool = Field(
        True,
        description="Whether to return synthesized response audio"
    )


class VoiceQueryResponse(BaseModel):
    """Response model for voice query processing."""

    success: bool = Field(..., description="Whether processing succeeded")
    transcribed_text: str = Field(..., description="Transcribed text from audio")
    detected_language: str = Field(..., description="Detected language code")
    confidence: float = Field(
        ...,
        description="Transcription confidence (0-1)",
        ge=0,
        le=1
    )
    intent: str = Field(..., description="Classified intent")
    entities: List[Dict[str, Any]] = Field(
        default=[],
        description="Extracted entities from query"
    )
    response_text: str = Field(..., description="Generated response text")
    response_audio_url: Optional[str] = Field(
        None,
        description="URL to synthesized response audio"
    )
    actions: List[Dict[str, Any]] = Field(
        default=[],
        description="Suggested actions based on intent"
    )
    processing_time_ms: int = Field(
        ...,
        description="Total processing time in milliseconds"
    )


class LanguageInfo(BaseModel):
    """Information about a supported language."""

    code: str = Field(..., description="ISO language code")
    name: str = Field(..., description="Language name")
    quality_score: float = Field(
        ...,
        description="ASR quality score (0-1)",
        ge=0,
        le=1
    )
    tts_available: bool = Field(..., description="Whether TTS is available")


class SupportedLanguagesResponse(BaseModel):
    """Response for supported languages endpoint."""

    languages: List[LanguageInfo] = Field(
        ...,
        description="List of supported languages"
    )


class TranscriptionResult(BaseModel):
    """Result of speech-to-text transcription."""

    text: str = Field(..., description="Transcribed text")
    language: str = Field(..., description="Detected language")
    confidence: float = Field(..., description="Confidence score")
    segments: Optional[List[Dict[str, Any]]] = Field(
        None,
        description="Timed segments with word-level timestamps"
    )
    duration_ms: int = Field(..., description="Audio duration in milliseconds")


class SynthesisRequest(BaseModel):
    """Request for text-to-speech synthesis."""

    text: str = Field(
        ...,
        max_length=500,
        description="Text to synthesize"
    )
    language: str = Field(..., description="Target language code")
    voice: str = Field(default="default", description="Voice style")
    speed: float = Field(
        default=1.0,
        ge=0.5,
        le=2.0,
        description="Speech speed multiplier"
    )
