from fastapi import APIRouter, HTTPException
from app.redis_client import redis_client
from app.database import tasks_collection
import json
from bson import ObjectId

router = APIRouter()


@router.post("/tasks")
def create_task(task: dict):

    result = tasks_collection.insert_one(task)

    task["_id"] = str(result.inserted_id)

    redis_client.delete("tasks")

    return {"message": "Task created", "task": task}


@router.get("/tasks")
def get_tasks():

    cached_tasks = redis_client.get("tasks")

    if cached_tasks:
        return {"tasks": json.loads(cached_tasks)}

    tasks = list(tasks_collection.find())

    for task in tasks:
        task["_id"] = str(task["_id"])

    redis_client.set("tasks", json.dumps(tasks))

    return {"tasks": tasks}




@router.get("/tasks/{task_id}")
def get_task(task_id: str):

    task = tasks_collection.find_one({"_id": ObjectId(task_id)})

    if task:
        task["_id"] = str(task["_id"])
        return task

    raise HTTPException(status_code=404, detail="Task not found")




@router.put("/tasks/{task_id}")
def update_task(task_id: str, updated_task: dict):

    try:
        obj_id = ObjectId(task_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

    result = tasks_collection.update_one(
        {"_id": obj_id},
        {"$set": updated_task}
    )

    if result.matched_count == 1:
        redis_client.delete("tasks")
        return {"message": "Task updated"}

    raise HTTPException(status_code=404, detail="Task not found")  


@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):

    try:
        obj_id = ObjectId(task_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

    result = tasks_collection.delete_one({"_id": obj_id})

    if result.deleted_count == 1:
        redis_client.delete("tasks")
        return {"message": "Task deleted"}

    raise HTTPException(status_code=404, detail="Task not found")

