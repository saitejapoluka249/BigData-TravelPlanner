import redis
import json
from app.core.config import settings
from fastapi.encoders import jsonable_encoder  

redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_cache(key: str):
    """Fetches data from Redis and converts it back to Python dict/list."""
    try:
        data = redis_client.get(key)
        if data:
            print(f"⚡ CACHE HIT for key: {key}")
            return json.loads(data)
    except Exception as e:
        print(f"⚠️ Redis GET Error: {e}")
    
    print(f"🐢 CACHE MISS for key: {key}")
    return None

def set_cache(key: str, data: any, expire_seconds: int = 1800):
    """Saves data to Redis with a 30-minute expiration by default."""
    try:
        json_compatible_data = jsonable_encoder(data)
        
        redis_client.setex(key, expire_seconds, json.dumps(json_compatible_data))
    except Exception as e:
        print(f"⚠️ Redis SET Error: {e}")