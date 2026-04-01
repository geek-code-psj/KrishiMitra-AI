"""
KrishiMitra AI - Cache Service
Redis cache wrapper
"""

import json
from typing import Optional, Any

import redis.asyncio as redis

from app.core.config import settings


class RedisCache:
    """Redis cache wrapper for async operations."""

    def __init__(self):
        self._redis: Optional[redis.Redis] = None

    async def connect(self):
        """Connect to Redis — gracefully degrades if unavailable."""
        if not settings.REDIS_URL:
            return
        try:
            self._redis = await redis.from_url(
                str(settings.REDIS_URL),
                encoding="utf-8",
                decode_responses=True,
            )
            await self._redis.ping()
        except Exception:
            import structlog
            structlog.get_logger().warning(
                "Redis unavailable — running without cache. "
                "Start Redis or set REDIS_URL=none to suppress."
            )
            self._redis = None

    async def disconnect(self):
        """Disconnect from Redis."""
        if self._redis:
            await self._redis.close()

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if not self._redis:
            return None
        value = await self._redis.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None

    async def set(
        self,
        key: str,
        value: Any,
        expire: int = 3600,
    ) -> None:
        """Set value in cache."""
        if not self._redis:
            return
        serialized = json.dumps(value) if not isinstance(value, (str, bytes)) else value
        await self._redis.setex(key, expire, serialized)

    async def delete(self, key: str) -> None:
        """Delete key from cache."""
        if not self._redis:
            return
        await self._redis.delete(key)

    async def exists(self, key: str) -> bool:
        """Check if key exists."""
        if not self._redis:
            return False
        return await self._redis.exists(key) > 0
