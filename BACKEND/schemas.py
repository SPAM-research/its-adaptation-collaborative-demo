from pydantic import BaseModel
from typing import List, Literal, Union


class ChatMessage(BaseModel):
    # TODO: change to role user on front to distinguish between messages and use the system role to indicate the first command
    username: str
    content: str


class ChatMessageWS(BaseModel):
    # TODO: change to role user on front to distinguish between messages and use the system role to indicate the first command
    message: ChatMessage
    done: bool