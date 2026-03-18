from pymongo import MongoClient

MONGO_URL = "mongodb://mongo:27017"

client = MongoClient(MONGO_URL)

db = client["task_database"]

tasks_collection = db["tasks"]