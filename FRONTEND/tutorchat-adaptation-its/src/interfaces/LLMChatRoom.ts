interface ProblemRoomSchema {
  id: number;
  statement: string;
}

export interface ChatMessageWS {
  message: ChatMessage;
  done: boolean;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface LLMChatRoom {
  problem: ProblemRoomSchema;
  messages: Array<ChatMessage>;
}
