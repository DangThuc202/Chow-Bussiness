import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TooltipComponent from "../Common/Tooltip/Tooltip";
import BtnRight from "./Btn-Right";
import BtnLeft from "./Btn-Left";

const AIContent = () => {
  const { t } = useTranslation();
  const [selectedComponent, setSelectedComponent] =
    useState<React.ReactNode>(null);

  const TooltipItems = [
    {
      btn: t("train.my.social.media.agent"),
      title: t("AI.generate"),
      content: t("AI.generate.content"),
      css: "border-2 px-4 py-2 ai-content-green font-bold rounded-md xl:text-xl text-xs xl:none flex justify-start gap-2",
      open: <BtnLeft />,
    },
    {
      btn: t("let.chow.generate.automatically"),
      title: t("AI.generate.automatically"),
      content: t("AI.generate.automatically.content"),
      css: "border-2 px-4 py-2 ai-content-orange font-bold rounded-md xl:text-xl text-xs xl:none flex justify-start gap-2",
      open: <BtnRight />,
    },
  ];

  return (
    <>
      {!selectedComponent ? (
        <div className="flex flex-col gap-2 h-[90vh] justify-center items-center text-center">
          <h1 className="font-bold xl:text-xl text-xs">
            {t("how.do.you.want.AI.to.create.your.content?")}
          </h1>
          <div className="xl:flex grid gap-4">
            {TooltipItems.map((item, index) => (
              <button
                key={index}
                className={item.css}
                onClick={() => setSelectedComponent(item.open)}>
                <TooltipComponent title={item.title} content={item.content} />
                <span className="w-full text-center">{item.btn}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="">{selectedComponent}</div>
      )}
    </>
  );
};

export default AIContent;
