import img from "@/assets/AIContent/loadingGenerate.gif";
import React from "react";
import { useTranslation } from "react-i18next";

const LoadingPageAIGenerate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center">
      {/* Overlay làm tối nền và ngăn bấm ra ngoài */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 h-full w-full bg-white rounded-md flex flex-col justify-center items-center">
        <img
          src={img}
          alt="loadingResult"
          loading="lazy"
          className="h-[100px] w-auto"
        />
        <div className="flex gap-2">
          <span className="text-3xl">🚀</span>
          <div className="text-center bg-gradient-to-r from-[#03695E] via-[#3AA6CA] to-[#77279A] inline-block text-transparent bg-clip-text text-3xl font-bold animate-hueRotate">
            {t("your.social.media.post")}
          </div>
          <span className="text-3xl">🚀</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPageAIGenerate;
