import json
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from app.database import db, redis_client

router = APIRouter()

tasks_collection = db["tasks"]


def serialize_task(task):
    return {
        "_id": str(task["_id"]),
        "title": task.get("title", ""),
        "description": task.get("description", ""),
        "status": task.get("status", "pending")
    }


@router.post("/tasks")
def create_task(task: dict):
    if "title" not in task or "description" not in task:
        raise HTTPException(status_code=400, detail="Title and description are required")

    task.setdefault("status", "pending")

    result = tasks_collection.insert_one(task)

    redis_client.delete("tasks")

    return {
        "message": "Task created successfully",
        "task_id": str(result.inserted_id)
    }


@router.get("/tasks")
def get_tasks():
    cached_tasks = redis_client.get("tasks")

    if cached_tasks:
        return {"tasks": json.loads(cached_tasks)}

    tasks = list(tasks_collection.find())
    serialized_tasks = [serialize_task(task) for task in tasks]

    redis_client.set("tasks", json.dumps(serialized_tasks), ex=60)

    return {"tasks": serialized_tasks}


@router.get("/tasks/{task_id}")
def get_task(task_id: str):
    try:
        obj_id = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID")

    task = tasks_collection.find_one({"_id": obj_id})

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return serialize_task(task)


@router.put("/tasks/{task_id}")
def update_task(task_id: str, updated_task: dict):
    try:
        obj_id = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID")

    result = tasks_collection.update_one(
        {"_id": obj_id},
        {"$set": updated_task}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    redis_client.delete("tasks")

    return {"message": "Task updated successfully"}


@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    try:
        obj_id = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID")

    result = tasks_collection.delete_one({"_id": obj_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    redis_client.delete("tasks")

    return {"message": "Task deleted successfully"}