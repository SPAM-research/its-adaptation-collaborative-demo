from pydantic import BaseModel
from typing import List, Literal, Union


class ChatMessage(BaseModel):
    username: str
    content: str


class ChatMessageWS(BaseModel):
    message: ChatMessage
    done: bool