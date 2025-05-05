import { SendOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/vi";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

interface ChatBoxProps {
  onGenerateContent: (content: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onGenerateContent }) => {
  const { t } = useTranslation();
  moment.locale("vi");

  const suggestions = [
    {
      title1: "Create Facebook Post",
      title2: "For product launch",
      content: "Create a Facebook post about our new product launch",
    },
    {
      title1: "Instagram Content",
      title2: "With Trending Hashtag",
      content: "Generate an Instagram post with trending hashtags",
    },
    {
      title1: "Marketing Strategy",
      title2: "For upcoming quarter",
      content: "Help me create a marketing strategy for Q2",
    },
    {
      title1: "Seasonal promotion",
      title2: "Limited time offer",
      content: "Create content for our seasonal promotion",
    },
  ];

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    handleSend(text);
  };

  const handleSend = (textToSend?: string) => {
    const currentMessage = (textToSend || inputValue).trim();
    if (!currentMessage) return;

    const timestamp = Date.now();
    const userMessage: Message = {
      sender: "user",
      text: currentMessage,
      timestamp,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsAiTyping(true);

    const aiResponseText =
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, assumenda. Quod expedita eaque impedit qui maiores sint dolorem quae? Animi quis mollitia officia aperiam praesentium. Impedit sunt vero sapiente doloribus";
    const aiTimestamp = Date.now();
    const aiMessage: Message = {
      sender: "ai",
      text: aiResponseText,
      timestamp: aiTimestamp,
    };

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsAiTyping(false);
      timeoutId.current = null;
      onGenerateContent(aiResponseText);
    }, 1000);

    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const formatTime = (timestamp: number) => {
    return moment(timestamp).format("HH:mm:ss");
  };

  return (
    <div className="w-full h-full flex flex-col justify-between px-3">
      <div className="flex-grow overflow-y-auto py-4 pr-2">
        {messages.length === 0 ? (
          <div className="w-full flex justify-center h-full items-center">
            <div className="flex flex-col gap-5 max-w-[500px]">
              <div className="text-center xl:text-2xl text-sm font-bold text-gray-500">
                {t("welcome.to.chow.AI.canvas")}
              </div>
              <div className="text-center text-gray-500">{t("start.a...")}</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.content)}
                    className="py-2 border border-gray-200 rounded text-sm hover">
                    <div className=" font-semibold text-gray-500">
                      {suggestion.title1}
                    </div>
                    <div className="text-xs text-gray-400">
                      {suggestion.title2}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 mt-4"
                  }`}>
                  {msg.text.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                  <div
                    className={`text-xs mt-3 ${
                      msg.sender === "user"
                        ? "text-end text-white"
                        : "text-start text-gray-500"
                    }`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800">
                  <div className="flex space-x-1 items-center h-5">
                    <span
                      className="animate-bounce w-2 h-2 bg-gray-500 rounded-full"
                      style={{ animationDelay: "0ms" }}></span>
                    <span
                      className="animate-bounce w-2 h-2 bg-gray-500 rounded-full"
                      style={{ animationDelay: "100ms" }}></span>
                    <span
                      className="animate-bounce w-2 h-2 bg-gray-500 rounded-full"
                      style={{ animationDelay: "200ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div>
        <Divider />
        <div className="flex items-center">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t("enter.message")}
            onKeyDown={handleKeyDown}
            autoSize={{ minRows: 2 }}
            className="mr-2"
          />
          <button
            className="ml-2 text-white bg-black hover px-5 py-3.5 rounded "
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            style={{ opacity: !inputValue.trim() ? 0.5 : 1 }}>
            <SendOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
