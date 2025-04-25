import Header from "@/components/Common/Header/Header";
import { SyncOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AIContentHeaderProps {
  setBack: (value: boolean) => void;
}

const AIContentHeader = ({ setBack }: AIContentHeaderProps) => {
  const { t } = useTranslation();

  const RightContent = () => {
    const { t } = useTranslation();

    return (
      <>
        <div className="primary2 font-medium flex xl:gap-2 gap-[2px] hover:cursor-pointer hover:underline group">
          <span>
            <SyncOutlined className="transition-transform duration-300 group-hover:rotate-180" />
          </span>
          <div onClick={() => setBack(true)}>
            {t("change.AI.content.generation")}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Header left={t("create.a.marketing.plan")} right={<RightContent />} />
    </>
  );
};

export default AIContentHeader;
