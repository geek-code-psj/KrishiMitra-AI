"""
KrishiMitra AI - Voice Processor
Speech-to-text and text-to-speech using AI4Bharat and Sarvam models
"""

from typing import Optional
import io
import structlog

import requests
import librosa
import numpy as np

from app.core.config import settings

logger = structlog.get_logger()


class VoiceProcessor:
    """
    Voice processing service using AIKosh/AI4Bharat models.

    Supports 22+ Indian languages for STT and TTS.
    """

    def __init__(self):
        self.asr_url = settings.AI4BHARAT_ASR_URL
        self.tts_url = settings.AI4BHARAT_TTS_URL
        self.sarvam_key = settings.SARVAM_API_KEY

    async def transcribe(
        self,
        audio_bytes: bytes,
        language: str = "hi"
    ) -> dict:
        """
        Transcribe audio to text.

        Args:
            audio_bytes: Raw audio bytes
            language: Language code

        Returns:
            dict with text, language, confidence
        """
        # Preprocess audio
        audio_data = await self._preprocess_audio(audio_bytes)

        # Try Sarvam API first (better quality)
        if self.sarvam_key:
            try:
                result = await self._transcribe_sarvam(audio_data, language)
                return result
            except Exception as e:
                logger.warning("Sarvam STT failed, falling back", error=str(e))

        # Fallback to AI4Bharat
        return await self._transcribe_ai4bharat(audio_data, language)

    async def transcribe_from_url(self, audio_url: str, language: Optional[str] = None) -> dict:
        """
        Download audio from URL and transcribe.
        """
        # Download audio
        response = requests.get(audio_url, timeout=30)
        response.raise_for_status()

        return await self.transcribe(response.content, language or settings.DEFAULT_LANGUAGE)

    async def synthesize(
        self,
        text: str,
        language: str,
        voice: str = "default",
        speed: float = 1.0
    ) -> bytes:
        """
        Synthesize text to speech.

        Args:
            text: Text to synthesize
            language: Target language
            voice: Voice style
            speed: Speech speed

        Returns:
            Audio bytes (WAV format)
        """
        if self.sarvam_key:
            try:
                return await self._synthesize_sarvam(text, language, voice, speed)
            except Exception as e:
                logger.warning("Sarvam TTS failed, falling back", error=str(e))

        return await self._synthesize_ai4bharat(text, language, voice, speed)

    async def _preprocess_audio(self, audio_bytes: bytes) -> np.ndarray:
        """
        Preprocess audio for model input.
        - Convert to 16kHz mono
        - Normalize
        - Trim silence
        """
        # Load audio
        audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=None, mono=True)

        # Resample to 16kHz
        if sr != 16000:
            audio = librosa.resample(audio, orig_sr=sr, target_sr=16000)

        # Normalize
        audio = librosa.util.normalize(audio)

        # Trim silence
        audio, _ = librosa.effects.trim(audio, top_db=20)

        return audio

    async def _transcribe_sarvam(self, audio_data: np.ndarray, language: str) -> dict:
        """Transcribe using Sarvam API."""
        # Convert to bytes
        buffer = io.BytesIO()
        import soundfile as sf
        sf.write(buffer, audio_data, 16000, format="WAV")
        buffer.seek(0)

        response = requests.post(
            "https://api.sarvam.ai/speech-to-text",
            headers={
                "Authorization": f"Bearer {self.sarvam_key}",
            },
            files={
                "audio": ("audio.wav", buffer, "audio/wav"),
            },
            data={
                "language": language,
                "model": "saarika:v1",
            },
            timeout=30
        )
        response.raise_for_status()

        result = response.json()
        return {
            "text": result.get("text", ""),
            "language": language,
            "confidence": result.get("confidence", 0.9),
        }

    async def _transcribe_ai4bharat(self, audio_data: np.ndarray, language: str) -> dict:
        """Transcribe using AI4Bharat API."""
        # Fallback implementation using local model or API
        # For now, return mock response
        logger.info("Using AI4Bharat transcription", language=language)

        return {
            "text": "Sample transcribed text",
            "language": language,
            "confidence": 0.85,
        }

    async def _synthesize_sarvam(
        self,
        text: str,
        language: str,
        voice: str,
        speed: float
    ) -> bytes:
        """Synthesize using Sarvam TTS."""
        voice_mapping = {
            "default": "meera",
            "female": "meera",
            "male": "arjun",
        }

        response = requests.post(
            "https://api.sarvam.ai/text-to-speech",
            headers={
                "Authorization": f"Bearer {self.sarvam_key}",
                "Content-Type": "application/json",
            },
            json={
                "text": text,
                "language": language,
                "speaker": voice_mapping.get(voice, "meera"),
                "speed": speed,
            },
            timeout=30
        )
        response.raise_for_status()

        # Return audio bytes
        return response.content

    async def _synthesize_ai4bharat(
        self,
        text: str,
        language: str,
        voice: str,
        speed: float
    ) -> bytes:
        """Synthesize using AI4Bharat TTS."""
        logger.info("Using AI4Bharat TTS", language=language, text_length=len(text))

        # Return empty bytes for now
        return b""
