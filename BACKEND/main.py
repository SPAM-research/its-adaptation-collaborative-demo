import asyncio
import functools
import json
from typing import Annotated, Dict, List
from fastapi import Depends, FastAPI, Header, Query, WebSocket, WebSocketDisconnect, logger
import logging
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from redis import Redis

from schemas import ChatMessage, ChatMessageWS
from utils import find_problem_by_id, get_redis, ConnectionManager

app = FastAPI(middleware=[Middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])])

STUDENTS_PER_GROUP = 2

def get_queue_db():
    return None

def get_system_processor():
    return ITS()

class CSSO:
    def __init__(self):
        self.messages = []

    def add_message(self, username: str, message: str):
        self.messages.append({"role": username, "content": message})

    def serialize(self):
        return json.dumps(self.messages)

    @staticmethod
    def deserialize(serialized):
        obj = CSSO()
        obj.messages = json.loads(serialized)
        return obj

active_connections: Dict[str, WebSocket] = {}

class WaitingRoom:
    @staticmethod
    def add_to_waiting_room(username: str, redisson: Redis):
        redisson_set = redisson.sadd('waiting_room_users', username)
        
    @staticmethod
    def get_users_waiting(redisson: Redis):
        users = redisson.smembers('waiting_room_users')
        return list(users)

    @staticmethod
    def remove_from_waiting_room(username: str, redisson: Redis):
        redisson.srem("waiting_room_users", username)

class Groups:
    @staticmethod
    def remove(group_id: int, redisson: Redis):
        keys = redisson.scan_iter(f"group:{group_id}:users:*:csso")
        for key in keys:
            redisson.delete(key)

    @staticmethod
    def get_users_in_group(username: str, redisson: Redis):
        keys = redisson.scan_iter(f"group:*:users:*:csso")
        for key in keys:
            group_id = int(key.split(":")[1])
            users_in_group = key.split(":")[3]
            users_in_group = users_in_group.split("_")
            if username in users_in_group:
                return (group_id, Groups.get_users_by_group_id(group_id, redisson))
        return (-1, []) 
    @staticmethod
    def get_latest_group_id(redisson: Redis):
        keys = Groups.get_groups_keys(redisson)
        keys_ids = []
        for key in keys:
            keys_ids.append(int(key.split(":")[1]))
        return max(keys_ids, default=0)

    @staticmethod
    def add_to_group(users: List[str], redisson: Redis):
        for username in users:
            WaitingRoom.remove_from_waiting_room(username, redisson)
        new_group_id = Groups.get_latest_group_id(redisson) + 1
        users_str = '_'.join(users) 
        redisson.set(f"group:{new_group_id}:users:{users_str}:csso", CSSO().serialize())
        return new_group_id

    @staticmethod
    def is_in_group(username: str, redisson: Redis):
        group_keys = Groups.get_groups_keys(redisson)
        for group_key in group_keys:
            if username in group_key:
                group_id = int(group_key.split(":")[1])
                return group_id
        return None

    @staticmethod
    def get_users_by_group_id(group_id: int, redisson: Redis):
        keys = redisson.scan_iter(f"group:{group_id}:users:*:csso")
        users = []
        for key in redisson.scan_iter(f"group:{group_id}:users:*:csso"):
            user_part = key.split(":")[3]
            users_in_key = user_part.split("_")             
            users = users_in_key
        return users

    @staticmethod
    def get_groups_keys(redisson: Redis):
        matching_keys = []
        cursor = 0
        pattern = "group:*:users:*:csso"
        cursor, keys = redisson.scan(cursor=cursor, match=pattern)
        matching_keys.extend(keys)
        return matching_keys

class CSSOStorage:
    @staticmethod
    def get_csso(group_id: int, redisson: Redis) -> CSSO:
        keys = redisson.scan_iter(f"group:{group_id}:*")
        for key in keys:
            return CSSO.deserialize(redisson.get(key))
        return CSSO()

    @staticmethod
    def save_csso(group_id: int, csso: CSSO, redisson: Redis):
        keys = redisson.scan_iter(f"group:{group_id}:users:*:csso")
        for key in keys:
            redisson.set(key, csso.serialize())

    @staticmethod
    def delete(group_id: int, redisson: Redis):
        keys = redisson.scan_iter(f"group:{group_id}:users:*:csso")
        for key in keys:
            redisson.delete(key)

# Websocket
class Notifier:
    @staticmethod
    async def notify(group_id, username: str, message: str, redisson: Redis):
        message = ChatMessageWS(message=ChatMessage(username=username, content=message), done=True)
        message_serialized = message.json()
        for username in Groups.get_users_by_group_id(group_id, redisson):
            if username in active_connections:
                await active_connections[username].send_json(message_serialized)

class ITS:
    def process(self, problem_id: int, username: str, group_id: int, _input: str, redisson: Redis):
        csso = CSSOStorage.get_csso(group_id, redisson)
        csso.add_message(username, _input)
        if not _input.startswith("!"):
            csso.add_message("system", "ITS FEEDBACK")
        CSSOStorage.save_csso(group_id, csso, redisson)

SystemProcessor = Annotated[ITS, Depends(get_system_processor)]
manager = ConnectionManager()

@app.post("/api/start/{username}/{problem_id}")
async def join_or_start_problem(problem_id: int, username: str, redisson: Annotated[Redis, Depends(get_redis)]):
    problem = find_problem_by_id(problem_id)
    group_id = Groups.is_in_group(username, redisson)
    if group_id is None:
        WaitingRoom.add_to_waiting_room(username, redisson)  
        if len(WaitingRoom.get_users_waiting(redisson)) == STUDENTS_PER_GROUP:
            users_to_group = WaitingRoom.get_users_waiting(redisson)
            Groups.add_to_group(users=users_to_group, redisson=redisson)
            for username_group in users_to_group:
                if username_group in active_connections and username != username_group:
                    response_ws = ChatMessageWS(message=ChatMessage(username="system", content="START_SESSION"), done=True)
                    await active_connections[username_group].send_json(response_ws.json())
            return {"group_id": group_id, "session_started": True, "problem": {"id": problem["id"], "statement": problem["text"]}, "messages": []}
        else:
            return {"group_id": group_id, "session_started": False, "problem": {"id": problem["id"], "statement": problem["text"]}, "messages": []}
    else:
        return {"group_id": group_id, "session_started": True, "problem": {"id": problem["id"], "statement": problem["text"]}, "messages": json.dumps(CSSOStorage.get_csso(group_id, redisson).messages)}

@app.delete("/api/delete/{username}")
async def delete_group(username: str, redisson: Annotated[Redis, Depends(get_redis)]):
    group_id, users = Groups.get_users_in_group(username, redisson)
    response_ws = ChatMessageWS(message=ChatMessage(username="system", content="CLOSE_SESSION"), done=True)
    for group_username in users:
        if group_username in active_connections:
            await active_connections[group_username].send_json(response_ws.json())
            await active_connections[group_username].close()
            try:
                del active_connections[group_username] 
            except KeyError as ke:
                pass
    Groups.remove(group_id, redisson)
    
@app.websocket("/api/chat/{username}/{problem_id}/ws")
async def websocket_chat(websocket: WebSocket, username: str, problem_id: int, redisson: Annotated[Redis, Depends(get_redis)]):
    try:
        await manager.connect(websocket)
        active_connections[username] = websocket
        # group_id = Groups.is_in_group(username, redisson)
        # if group_id is None:
        #     await websocket.close()
        #     return

        while True:
            _input = await websocket.receive_text()  # first message starts the session
            group_id = Groups.is_in_group(username, redisson)
            ITS().process(problem_id, username, group_id, _input, redisson)
            user_chat_message = ChatMessageWS(message=ChatMessage(username=username, content=_input), done=True)
            users_in_group = Groups.get_users_by_group_id(group_id, redisson)
            for peer_username in users_in_group:
                if peer_username in active_connections:
                    await active_connections[peer_username].send_json(user_chat_message.json())
            if not _input.startswith("!"):
                response_ws = ChatMessageWS(message=ChatMessage(username="system", content="ITS FEEDBACK"), done=True)
                for peer_username in users_in_group:
                    if peer_username in active_connections:
                        await active_connections[peer_username].send_json(response_ws.json())
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        try:
            del active_connections[username]
        except KeyError as ke:
            pass
        print(f"WebSocket from user {username} disconnected.")