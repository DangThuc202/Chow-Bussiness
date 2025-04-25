import React, { useState, useEffect } from "react";
import { Modal, Button, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { contentMapVI, contentMapEN } from "@/data/data-modal";
import type { StepData, SchedulePostViewData } from "@/types/modal";
import { FileTextOutlined, RobotOutlined } from "@ant-design/icons";
import Left from "./components/Schedule/Left";
import Right from "./components/Schedule/Right";

type ModalType = "postSchedule" | "schedule" | "setting";

interface LearnHowModalProps {
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  done: () => void;
  type: ModalType;
}

const LearnHowModal: React.FC<LearnHowModalProps> = ({
  open,
  onClose,
  onNext,
  done,
  type,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState<
    number | null
  >(null);
  const [tabKey, setTabKey] = useState("0"); // string vì Antd Tabs dùng string
  const { t, i18n } = useTranslation();

  const contentMap = i18n.language === "vi" ? contentMapVI : contentMapEN;

  const scheduleData = [
    {
      icon: <RobotOutlined />,
      title: "schedule.AI.generated.post",
      content: "schedule.AI.generated.post.content",
      component: <Left />,
    },
    {
      icon: <FileTextOutlined />,
      title: "create.and.schedule.a.new.post",
      content: "create.and.schedule.a.new.post.content",
      component: <Right />,
    },
  ];

  useEffect(() => {
    if (!open) {
      setStepIndex(0);
      setTabKey("0");
    }
  }, [open]);

  if (type === "postSchedule") {
    const postScheduleTabs = contentMap.postSchedule as SchedulePostViewData[];
    const currentTabData = postScheduleTabs[parseInt(tabKey)];

    const currentStep = currentTabData?.content[stepIndex];
    const totalSteps = currentTabData?.content.length || 0;

    return (
      <Modal
        open={open}
        onCancel={onClose}
        width={"90%"}
        centered
        footer={
          <>
            {stepIndex > 0 && (
              <Button onClick={() => setStepIndex((prev) => prev - 1)}>
                {t("previous")}
              </Button>
            )}
            {stepIndex < totalSteps - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  setStepIndex((prev) => prev + 1);
                  onNext();
                }}>
                {t("next")}
              </Button>
            )}
            {stepIndex === totalSteps - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  done();
                  onClose();
                }}>
                {t("done")}
              </Button>
            )}
          </>
        }>
        <Tabs
          activeKey={tabKey}
          onChange={(key) => {
            setTabKey(key);
            setStepIndex(0);
          }}
          items={postScheduleTabs.map((tab, index) => ({
            label: (
              <div className="xl:text-lg text-[10px] font-semibold">
                {t(tab.tab)}
              </div>
            ),
            key: String(index),
            children: (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px]">
                <div className="primary xl:text-2xl text-md text-start">
                  {t(currentStep?.title)}
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <div className="xl:text-md text-xs text-center">
                    {t(currentStep?.text)}
                  </div>
                  <img
                    src={currentStep?.image}
                    className="xl:size-[70%] size-[100%]"
                  />
                </div>
              </div>
            ),
          }))}
        />
      </Modal>
    );
  }

  if (type === "schedule") {
    const currentComponent =
      selectedScheduleIndex !== null
        ? scheduleData[selectedScheduleIndex].component
        : null;

    const handleClose = () => {
      setSelectedScheduleIndex(null);
      onClose(); // callback đóng modal chính
    };

    return (
      <Modal
        open={open}
        onCancel={handleClose}
        width={"auto"}
        footer={null}
        centered>
        {selectedScheduleIndex === null ? (
          <div className="flex flex-col gap-4 items-center">
            <div className="primary xl:text-xl text-sm">
              {t("which.option.would.you.like.to.choose")}
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {scheduleData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScheduleIndex(index)}
                  className="border-gray-300 flex flex-col text-start px-6 xl:py-8 py-3 hover:bg-[rgb(255,118,14,0.05)] hover:cursor-pointer hover:border-[#FE881C] hover:-translate-y-1 transition-all duration-200 
              justify-start items-start xl:gap-4 gap-1 rounded-lg border-1">
                  <span className="xl:text-4xl text-lg primary">
                    {item.icon}
                  </span>
                  <span className="font-semibold xl:text-lg text-xs">
                    {t(item?.title)}
                  </span>
                  <span className="text-gray-400 xl:text-base text-xs">
                    {t(item?.content)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>{currentComponent}</div>
        )}
      </Modal>
    );
  }

  if (type === "setting") {
    const currentStep = (contentMap.setting as StepData[])[stepIndex];
    const totalSteps = (contentMap.setting as StepData[]).length;

    return (
      <Modal
        open={open}
        onCancel={onClose}
        width={"70%"}
        centered
        title={
          <h1 className="primary xl:text-2xl text-sm text-center xl:text-start">
            {t(currentStep.title)}
          </h1>
        }
        footer={
          <>
            {stepIndex > 0 && (
              <Button onClick={() => setStepIndex((prev) => prev - 1)}>
                {t("previous")}
              </Button>
            )}
            {stepIndex < totalSteps - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  setStepIndex((prev) => prev + 1);
                  onNext();
                }}>
                {t("next")}
              </Button>
            )}
            {stepIndex === totalSteps - 1 && (
              <Button
                type="primary"
                onClick={() => {
                  done();
                  onClose();
                }}>
                {t("done")}
              </Button>
            )}
          </>
        }>
        <div className="flex flex-col items-center gap-2 overflow-y-auto max-h-[480px]">
          <div
            className="text-center"
            dangerouslySetInnerHTML={{ __html: currentStep.text }}
          />
          {currentStep.image && (
            <img
              src={currentStep.image}
              alt={currentStep.title}
              className="xl:size-[70%] size-[90%]"
            />
          )}
          {currentStep.text2 && (
            <div
              className="text-center"
              dangerouslySetInnerHTML={{ __html: currentStep.text2 }}
            />
          )}
          {currentStep.image2 && (
            <img
              src={currentStep.image2}
              alt={`${currentStep.title} extra`}
              className="xl:size-[70%] size-[90%]"
            />
          )}
        </div>
      </Modal>
    );
  }
};

export default LearnHowModal;
