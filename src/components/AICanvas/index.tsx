import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Tabs, TabsProps } from "antd";
import {
  CloseOutlined,
  MenuUnfoldOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import ChowAICanvas from "./components/ChowAICanvas";
import GeneratedPost from "./components/GeneratedPost";
import { useMutation } from "@tanstack/react-query";
import { generateBlogPost, saveBlog } from "@/services/BE-Service";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import Cookies from "universal-cookie";
import { GenerateBlogPayload, SaveBlog } from "@/types/Blog";
import toast from "react-hot-toast";

const cookies = new Cookies();
interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

const AICanvas = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const [userPrompt, setUserPrompt] = useState<string>("");
  const [blogCount, setBlogCount] = useState<number>(0);
  const [rssFeeds, setRssFeeds] = useState<string[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState(""); // Khởi tạo với mảng rỗng
  const [currentAiMessage, setCurrentAiMessage] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // < 640px là mobile (Tailwind 'sm')
    };
    handleResize(); // Init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const hasSentUserPrompt = useRef(false);

  const BaseKnowledgeBase =
    "We develop innovative solutions that combine creativity, technology, and functionality. Our mission is to provide products that inspire, enhance, and simplify everyday experiences. With a focus on user-centric design, we craft software that not only meets your needs but also anticipates the future of your business. Whether you're looking to optimize processes or create new opportunities, we’re here to help you thrive in the digital age";
  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    handleSend(text);
  };

  const handleSend = (customInput?: string) => {
    const currentMessage = (customInput ?? inputValue).trim();
    if (!currentMessage) return;

    const timestamp = Date.now();
    const userMessage: Message = {
      sender: "user",
      text: currentMessage,
      timestamp,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsAiTyping(true);

    // const messageToSend = `${userPrompt}\nNumber of blogs to generate: ${blogCount}`;
    const payload: GenerateBlogPayload = {
      user_prompt: currentMessage,
      rss_feeds: rssFeeds,
      knowledge_base: knowledgeBase || BaseKnowledgeBase,
      blog_count: blogCount || 1,
      items_per_feed: 1,
      word_count: 700,
      loop_until_word_count: true,
    };

    console.log(knowledgeBase);

    if (token) {
      generateBlogMutate.mutate({ data: payload, token });
    } else {
      console.error("Không tìm thấy token");
    }

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

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setCollapsed(mobile); // nếu là mobile thì collapsed = true, còn desktop thì false
    };
    checkMobile(); // check ngay lần đầu
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Tự động gửi userPrompt nếu có và chưa gửi
  useEffect(() => {
    if (
      userPrompt &&
      blogCount !== undefined &&
      blogCount !== null &&
      !hasSentUserPrompt.current
    ) {
      const messageToSend = `${userPrompt}\nNumber of blogs to generate: ${blogCount}`;
      handleSend(messageToSend);
      hasSentUserPrompt.current = true;
    }
  }, [userPrompt, blogCount]);

  const formatTime = (timestamp: number) => {
    return moment(timestamp).format("HH:mm:ss");
  };

  const token = cookies.get("user_token");

  const generateBlogMutate = useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: GenerateBlogPayload;
      token: string;
    }) => generateBlogPost(data, token),

    onSuccess: (data) => {
      if (!Array.isArray(data.blog_posts)) {
        setIsAiTyping(false);
        return;
      }

      const currentMsg = data.blog_posts.join("\n");

      setCurrentAiMessage(currentMsg);

      setMessages((prev) => [
        ...prev.filter((m) => m.sender === "user"),
        {
          sender: "ai",
          text: currentMsg,
          timestamp: Date.now(),
        },
      ]);
      setIsAiTyping(false);
    },

    onError: () => {
      setIsAiTyping(false);
    },
  });

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Chow AI Canvas",
      children: (
        <ChowAICanvas
          rss={rssFeeds}
          knowledgeBase={knowledgeBase}
          onChangeRss={setRssFeeds}
          onChangeKnowledgeBase={(contents: string) =>
            setKnowledgeBase(contents)
          }
        />
      ),
    },
    {
      key: "2",
      label: t("generated.posts"),
      children: <GeneratedPost generatedContent={null} onConfirm={() => {}} />,
    },
  ];

  const saveMutate = useMutation({
    mutationFn: ({ data, token }: { data: SaveBlog; token: string }) =>
      saveBlog(data, token),

    onSuccess: () => {
      toast.success(t("save.successfully"));
    },
    onError: (e) => {
      console.log(e);

      toast.error(t("save.failed"));
    },
  });

  const handleSaveBlog = ({ data, token }: { data: any; token: string }) => {
    saveMutate.mutate({ data, token });
  };

  const containerWidthClass = collapsed ? "w-[4%]" : "xl:w-[30%] w-[80%]";

  return (
    <div className="flex pt-2 gap-[2%] w-full justify-between">
      <div className="w-full h-[85vh]">
        <div className="w-full h-full flex flex-col justify-between xl:px-3 px-0">
          <div className="flex-grow overflow-y-auto py-4 xl:pr-2 pr-0">
            {messages.length === 0 ? (
              <div className="w-full flex justify-center h-full items-center">
                <div className="flex flex-col gap-5 max-w-[500px]">
                  <div className="text-center xl:text-2xl text-sm font-bold text-gray-500">
                    {t("welcome.to.chow.AI.canvas")}
                  </div>
                  <div className="text-center text-gray-500 xl:text-base text-xs  ">
                    {t("start.a...")}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleSuggestionClick(suggestion.content)
                        }
                        className="py-2 border border-gray-200 rounded xl:text-sm text-[10px] hover ">
                        <div className=" font-semibold text-gray-500">
                          {suggestion.title1}
                        </div>
                        <div className="xl:text-xs text-[8px] text-gray-400">
                          {suggestion.title2}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="w-full flex justify-center h-full items-center">
                    {/* Đoạn mã khi không có tin nhắn */}
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
                              ? "bg-blue-500 text-white xl:text-base text-xs"
                              : "bg-gray-200 text-gray-800 mt-4 xl:text-base text-xs"
                          }`}>
                          {msg.text.split("\n").map((line, i) => (
                            <div key={i}>
                              <span className="block">{line}</span>
                            </div>
                          ))}
                          <div className="mt-3 flex justify-between">
                            <div
                              className={`text-xs ${
                                msg.sender === "user"
                                  ? "text-end text-white"
                                  : "text-start text-gray-500"
                              }`}>
                              {formatTime(msg.timestamp)}
                            </div>
                            {msg.sender === "ai" && (
                              <Button
                                variant="solid"
                                onClick={() =>
                                  handleSaveBlog({
                                    data: [
                                      {
                                        title: "abc",
                                        content: msg.text,
                                      },
                                    ],
                                    token, // Token được lấy từ đâu đó trong phạm vi của bạn
                                  })
                                }
                                color="cyan">
                                {t("save")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800">
                      <div className="flex space-x-1 items-center h-5">
                        <span
                          className="animate-bounce xl:w-2 xl:h-2 w-1 h-1 bg-gray-500 rounded-full"
                          style={{ animationDelay: "0ms" }}></span>
                        <span
                          className="animate-bounce xl:w-2 xl:h-2 w-1 h-1 bg-gray-500 rounded-full"
                          style={{ animationDelay: "100ms" }}></span>
                        <span
                          className="animate-bounce xl:w-2 xl:h-2 w-1 h-1 bg-gray-500 rounded-full"
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
                className="mr-2 xl:text-base text-xs"
              />
              <button
                className="ml-2 text-white bg-black hover xl:px-5 py-3.5 px-5 rounded "
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                style={{ opacity: !inputValue.trim() ? 0.5 : 1 }}>
                <SendOutlined className="size-3 xl:size-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`xl:relative xl:top-0 xl:right-0 fixed right-3 top-3 transition-all duration-300 ${containerWidthClass}`}>
        {collapsed && (
          <button
            className="absolute top-2 right-2 z-10 bg-white shadow-md rounded-full p-2 text-xs hover"
            onClick={() => setCollapsed(false)}>
            <MenuUnfoldOutlined />
          </button>
        )}

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              key="tabs-panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative border border-gray-300 px-2 rounded-2xl bg-white overflow-hidden xl:h-full h-[96vh] ">
              <button
                className="absolute top-2 left-2 z-10 bg-white shadow-md rounded-full p-2 text-xs hover"
                onClick={() => setCollapsed(true)}>
                <CloseOutlined />
              </button>
              <Tabs
                items={items}
                size="small"
                className="tab-style"
                style={{ marginTop: "40px" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AICanvas;
