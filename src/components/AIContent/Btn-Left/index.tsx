import { useState } from "react";
import ChatBox from "./components/ChatBox";
import Generate from "./components/Generate";

const Index = () => {
  const [step, setStep] = useState(1); // Quản lý bước hiện tại
  const [charCount, setCharCount] = useState(0); // Quản lý số ký tự nhập vào
  const [chatData, setChatData] = useState<{
    formatted: string;
    raw: string[];
  } | null>(null);
  const handleNext = () => {
    setStep(2); // Chuyển sang bước tiếp theo
  };

  const handleCharCountChange = (count: number) => {
    setCharCount(count); // Cập nhật số ký tự khi ChatBox thay đổi
  };

  return (
    <div className="container">
      {/* Render ChatBox nếu đang ở bước 1, render Generate nếu đang ở bước 2 */}
      {step === 1 ? (
        <ChatBox
          onFinish={(data) => setChatData(data)}
          onNext={handleNext}
          onCharCountChange={handleCharCountChange}
        />
      ) : (
        <Generate charCount={charCount} chatData={chatData} />
      )}
    </div>
  );
};

export default Index;
