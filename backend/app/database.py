import os
from dotenv import load_dotenv
from pymongo import MongoClient
import redis

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
REDIS_URL = os.getenv("REDIS_URL")

if not MONGO_URL:
    raise ValueError("MONGO_URL is not set in .env")

if not DATABASE_NAME:
    raise ValueError("DATABASE_NAME is not set in .env")

if not REDIS_URL:
    raise ValueError("REDIS_URL is not set in .env")

mongo_client = MongoClient(MONGO_URL)
db = mongo_client[DATABASE_NAME]

redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)