import { useState } from "react";
import type { Message } from "../types";

export function useConversation(initialMessages: Message[] = []) {
  const [conversationData, setConversationData] =
    useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageIds, setTypingMessageIds] = useState<Set<string>>(
    new Set()
  );
  const [completedMessageIds, setCompletedMessageIds] = useState<Set<string>>(
    new Set()
  );

  // Add message, send message, etc. can be implemented here

  return {
    conversationData,
    setConversationData,
    input,
    setInput,
    isTyping,
    setIsTyping,
    typingMessageIds,
    setTypingMessageIds,
    completedMessageIds,
    setCompletedMessageIds,
  };
}
