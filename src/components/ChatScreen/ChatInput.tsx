import React from "react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "../ui/prompt-input";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  disabled,
}) => {
  const handleSend = () => {
    if (!disabled && input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="w-full ">
      <PromptInput
        value={input}
        onValueChange={setInput}
        onSubmit={handleSend}
        disabled={disabled}
        className="w-full"
      >
        <PromptInputTextarea
          placeholder="Type your message..."
          className="text-white placeholder:text-gray-400"
        />
        <PromptInputActions>
          <PromptInputAction tooltip="Send message">
            <button
              className={`p-2 rounded-full ml-auto flex items-center justify-center transition-all duration-200
                ${
                  disabled || !input.trim()
                    ? "bg-zinc-900 text-gray-500 cursor-not-allowed"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                }
              `}
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              aria-label="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"></path>
              </svg>
            </button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
};

export default ChatInput;
