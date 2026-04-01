"""
KrishiMitra AI - Voice AI Endpoints
Speech-to-text, text-to-speech, and voice query processing
"""

import io
import time
from typing import Optional

from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from fastapi.responses import StreamingResponse
import structlog

from app.services.voice.voice_processor import VoiceProcessor
from app.services.voice.language_detector import LanguageDetector
from app.services.voice.intent_classifier import IntentClassifier
from app.core.config import settings
from app.schemas.voice import VoiceQueryRequest, VoiceQueryResponse, SupportedLanguagesResponse

logger = structlog.get_logger()
router = APIRouter()


@router.post("/transcribe", response_model=dict)
async def transcribe_audio(
    audio: UploadFile = File(..., description="Audio file (wav/mp3/ogg)"),
    language: Optional[str] = Form(None, description="Language code (auto-detect if not provided)"),
) -> dict:
    """
    Convert speech to text using AI4Bharat/Sarvam models.

    - **audio**: Audio file to transcribe
    - **language**: Optional language hint (hi, bn, te, etc.)

    Returns transcribed text with confidence scores.
    """
    start_time = time.time()

    # Validate file type
    if audio.content_type not in ["audio/wav", "audio/mpeg", "audio/ogg", "audio/webm"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {audio.content_type}"
        )

    # Read audio bytes
    audio_bytes = await audio.read()
    if len(audio_bytes) > settings.VOICE_MAX_DURATION * 16000 * 2:  # 16kHz stereo
        raise HTTPException(
            status_code=413,
            detail=f"Audio too long. Max duration: {settings.VOICE_MAX_DURATION}s"
        )

    try:
        processor = VoiceProcessor()
        result = await processor.transcribe(
            audio_bytes=audio_bytes,
            language=language or settings.DEFAULT_LANGUAGE
        )

        processing_time = time.time() - start_time

        logger.info(
            "Transcription completed",
            language=result.get("language"),
            confidence=result.get("confidence"),
            duration_ms=round(processing_time * 1000, 2)
        )

        return {
            "text": result["text"],
            "language": result["language"],
            "confidence": result["confidence"],
            "processing_time_ms": round(processing_time * 1000, 2)
        }

    except Exception as e:
        logger.error("Transcription failed", error=str(e))
        raise HTTPException(status_code=500, detail="Transcription service error")


@router.post("/synthesize")
async def synthesize_speech(
    text: str = Form(..., description="Text to synthesize"),
    language: str = Form(..., description="Target language code"),
    voice: Optional[str] = Form("default", description="Voice style"),
    speed: Optional[float] = Form(1.0, description="Speech speed multiplier"),
):
    """
    Convert text to speech using AI4Bharat TTS models.

    - **text**: Text to synthesize (max 500 chars)
    - **language**: Target language (hi, bn, te, etc.)
    - **voice**: Voice style (default, male, female)
    - **speed**: Speech speed (0.5 to 2.0)

    Returns audio file (audio/wav).
    """
    if len(text) > 500:
        raise HTTPException(status_code=400, detail="Text too long (max 500 chars)")

    if language not in settings.SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language. Supported: {settings.SUPPORTED_LANGUAGES}"
        )

    try:
        processor = VoiceProcessor()
        audio_bytes = await processor.synthesize(
            text=text,
            language=language,
            voice=voice,
            speed=speed
        )

        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/wav",
            headers={"X-Synthesized-Language": language}
        )

    except Exception as e:
        logger.error("Synthesis failed", error=str(e))
        raise HTTPException(status_code=500, detail="TTS service error")


@router.post("/query", response_model=VoiceQueryResponse)
async def process_voice_query(
    request: VoiceQueryRequest,
) -> VoiceQueryResponse:
    """
    Process a complete voice query end-to-end.

    This endpoint handles:
    1. Speech-to-text transcription
    2. Language detection
    3. Intent classification
    4. Entity extraction
    5. Response generation
    6. Text-to-speech synthesis (if requested)

    **Request Body:**
    - **audio_url**: URL to audio file or base64 encoded audio
    - **language_hint**: Optional language hint
    - **farmer_id**: Farmer identifier for context
    - **location**: Optional location for geo-context
    - **return_audio**: Whether to return synthesized response audio

    **Response:**
    Full query processing result with transcribed text, detected intent,
    extracted entities, generated response, and optional audio URL.
    """
    start_time = time.time()

    try:
        # Initialize services
        voice_processor = VoiceProcessor()
        lang_detector = LanguageDetector()
        intent_classifier = IntentClassifier()

        # Step 1: Transcribe audio
        transcription = await voice_processor.transcribe_from_url(
            request.audio_url,
            language=request.language_hint
        )

        transcribed_text = transcription["text"]
        detected_language = transcription.get("language", request.language_hint or "hi")

        # Step 2: Detect language if not provided
        if not detected_language:
            lang_result = await lang_detector.detect(transcribed_text)
            detected_language = lang_result["language"]

        # Step 3: Classify intent
        intent_result = await intent_classifier.classify(
            text=transcribed_text,
            language=detected_language
        )

        # Step 4: Generate response based on intent
        response_data = await generate_intent_response(
            intent=intent_result["intent"],
            entities=intent_result["entities"],
            text=transcribed_text,
            language=detected_language,
            farmer_id=request.farmer_id,
            location=request.location
        )

        # Step 5: Synthesize response audio if requested
        audio_url = None
        if request.return_audio:
            audio_bytes = await voice_processor.synthesize(
                text=response_data["response_text"],
                language=detected_language
            )
            # In production, upload to storage and return URL
            audio_url = f"temp://response_{request.farmer_id}_{int(time.time())}.wav"

        processing_time = time.time() - start_time

        logger.info(
            "Voice query processed",
            intent=intent_result["intent"],
            language=detected_language,
            duration_ms=round(processing_time * 1000, 2)
        )

        return VoiceQueryResponse(
            success=True,
            transcribed_text=transcribed_text,
            detected_language=detected_language,
            confidence=transcription.get("confidence", 0.9),
            intent=intent_result["intent"],
            entities=intent_result["entities"],
            response_text=response_data["response_text"],
            response_audio_url=audio_url,
            actions=response_data.get("actions", []),
            processing_time_ms=round(processing_time * 1000, 2)
        )

    except Exception as e:
        logger.error("Voice query processing failed", error=str(e))
        return VoiceQueryResponse(
            success=False,
            transcribed_text="",
            detected_language="",
            confidence=0.0,
            intent="error",
            entities=[],
            response_text="Sorry, I couldn't process your query. Please try again.",
            processing_time_ms=0
        )


@router.get("/languages", response_model=SupportedLanguagesResponse)
async def get_supported_languages() -> SupportedLanguagesResponse:
    """
    Get list of supported languages for voice processing.

    Returns available languages with codes, names, and quality scores.
    """
    languages = [
        {"code": "hi", "name": "Hindi", "quality_score": 0.95, "tts_available": True},
        {"code": "bn", "name": "Bengali", "quality_score": 0.93, "tts_available": True},
        {"code": "te", "name": "Telugu", "quality_score": 0.92, "tts_available": True},
        {"code": "ta", "name": "Tamil", "quality_score": 0.91, "tts_available": True},
        {"code": "mr", "name": "Marathi", "quality_score": 0.90, "tts_available": True},
        {"code": "gu", "name": "Gujarati", "quality_score": 0.89, "tts_available": True},
        {"code": "kn", "name": "Kannada", "quality_score": 0.88, "tts_available": True},
        {"code": "ml", "name": "Malayalam", "quality_score": 0.87, "tts_available": True},
        {"code": "pa", "name": "Punjabi", "quality_score": 0.86, "tts_available": True},
        {"code": "ur", "name": "Urdu", "quality_score": 0.85, "tts_available": True},
        {"code": "or", "name": "Odia", "quality_score": 0.84, "tts_available": True},
        {"code": "as", "name": "Assamese", "quality_score": 0.83, "tts_available": True},
        {"code": "en", "name": "English", "quality_score": 0.95, "tts_available": True},
    ]

    return SupportedLanguagesResponse(languages=languages)


async def generate_intent_response(
    intent: str,
    entities: list,
    text: str,
    language: str,
    farmer_id: str,
    location: Optional[dict] = None
) -> dict:
    """
    Generate appropriate response based on classified intent.
    """
    from app.services.advisory.knowledge_base import KnowledgeBase

    kb = KnowledgeBase()

    # Map intents to response generators
    intent_handlers = {
        "irrigation_advice": kb.get_irrigation_advice,
        "crop_recommendation": kb.get_crop_recommendation,
        "pest_disease": kb.get_pest_disease_info,
        "market_price": kb.get_market_price_info,
        "weather": kb.get_weather_info,
        "fertilizer": kb.get_fertilizer_advice,
        "general_info": kb.get_general_info,
    }

    handler = intent_handlers.get(intent, kb.get_general_info)

    response = await handler(
        entities=entities,
        language=language,
        farmer_id=farmer_id,
        location=location
    )

    return response
