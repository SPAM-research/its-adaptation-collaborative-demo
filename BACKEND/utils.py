from fastapi import WebSocket
import redis
import os

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

def get_redis():
    redis_host: str = os.getenv("REDIS_HOST", "localhost")
    return redis.Redis(
        host=redis_host, port=6379, charset="utf-8", decode_responses=True
    )

def find_problem_by_id(problem_id: int):
    """ Emulate SQL connection to retrieve problem info (`statement`, `id`, etc.) """
    return {"id": problem_id, "text": "We have two containers with 396 kg and 117 kg of potatoes, respectively. For sale, they must be packaged in bags containing 9 kg each. How many bags will be needed?"}
