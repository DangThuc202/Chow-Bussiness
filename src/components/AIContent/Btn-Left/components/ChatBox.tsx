import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AIContentHeader from "../../components/AIContentHeader";
import { conversationVI, conversationEN } from "@/data/AI-data";
import { ArrowRightOutlined, SendOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const ChatBox = ({
  onNext,
  onCharCountChange,
  onFinish,
}: {
  onNext: () => void;
  onCharCountChange: (count: number) => void;
  onFinish: (data: { formatted: string; raw: string[] }) => void;
}) => {
  const { t, i18n } = useTranslation();
  const conversation = i18n.language === "vi" ? conversationVI : conversationEN;

  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<
    {
      sender: "bot" | "user";
      text: string;
    }[]
  >([{ sender: "bot", text: conversation[0].question }]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customAnswer, setCustomAnswer] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    onCharCountChange(userAnswers.join("").length);
  }, [messages]);

  const handleOptionClick = (option: string) => {
    if (option === "others" || option === "Khác" || option === "Other") {
      setIsOtherSelected((prev) => !prev);
      return;
    }

    const nextStep = currentStep + 1;
    const newMessages = [
      ...messages,
      { sender: "user" as "bot" | "user", text: option },
    ];
    setUserAnswers([...userAnswers, option]);

    if (nextStep < conversation.length) {
      newMessages.push({
        sender: "bot",
        text: conversation[nextStep].question,
      });
    }

    setMessages(newMessages);
    setCurrentStep(nextStep);
    setIsOtherSelected(false);
  };

  const handleSendCustomAnswer = () => {
    if (customAnswer.trim()) {
      handleOptionClick(customAnswer.trim());
      setCustomAnswer("");
      setIsOtherSelected(false);
    }
  };

  const handleFinish = () => {
    const formatted = conversation.map((step, index) => ({
      question: `Q: ${step.question}`,
      answer: `A: ${userAnswers[index] || ""}`,
    }));

    const formattedText = formatted
      .map((item) => `${item.question}\n${item.answer}`)
      .join("\n\n");

    onFinish({
      formatted: formattedText,
      raw: userAnswers,
    });

    onNext();
  };

  return (
    <div>
      <div className="sticky -top-2 z-10 bg-white pb-2">
        <AIContentHeader setBack={() => {}} />
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{
              width: `${(userAnswers.length / conversation.length) * 100}%`,
            }}></div>
        </div>
      </div>

      <div className="mx-auto flex flex-col gap-4 mb-4 px-4 pt-2">
        <div className="flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              }`}>
              <div
                className={`px-4 py-2 rounded-xl max-w-xs ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-black xl:text-base text-xs"
                    : "bg-blue-300 text-black xl:text-base text-xs"
                }`}>
                {t(msg.text)}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {currentStep < conversation.length ? (
          <>
            <div className="flex gap-3 flex-wrap justify-end mt-2">
              {conversation[currentStep].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover hover:bg-blue-100 transition xl:text-base text-xs">
                  {t(option)}
                </button>
              ))}
            </div>

            {isOtherSelected && (
              <motion.div
                initial={{ width: 0, opacity: 0.5 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="border rounded-md px-4 py-2 w-full"
                />
                <button
                  onClick={handleSendCustomAnswer}
                  className="bg-black text-white px-4 py-2 rounded-md hover transition">
                  <SendOutlined />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <button
            onClick={handleFinish}
            className="bg-green-600 text-white hover py-2 px-5 rounded-lg self-end hover:bg-green-700 transition xl:text-base text-xs xl:mt-4">
            Next <ArrowRightOutlined />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
