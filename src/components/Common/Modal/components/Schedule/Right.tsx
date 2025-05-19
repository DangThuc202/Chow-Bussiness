import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import FB from "@/assets/PostSchedule/iconFacebook.svg";
import IN from "@/assets/PostSchedule/iconInstagram.svg";
import LI from "@/assets/PostSchedule//iconLinkedIn.svg";
import { useState } from "react";
import Form from "./Form";

const btn = [
  {
    icon: FB,
    text: "Facebook",
    key: "facebook",
  },
  {
    icon: IN,
    text: "Instagram",
    key: "instagram",
  },
  {
    icon: LI,
    text: "LinkedIn",
    key: "linkedin",
  },
];

const Right = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<null | string>(null);

  const handleClick = (platform: string) => {
    setSelectedPlatform(platform);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlatform(null);
  };

  return (
    <div className="flex flex-col xl:gap-6 gap-4">
      <div className="primary xl:text-lg text-base">{t("schedule.post")}</div>
      <div className="font-medium xl:text-base text-sm text-center">
        {t("which.social.platform.do.you.want.to.schedule.posts.for")}
      </div>
      <div className="xl:flex grid xl:gap-6 gap-2 justify-center">
        {btn.map((item, index) => (
          <button
            onClick={() => handleClick(item.key)}
            className="flex gap-2 items-center xl:p-4 p-2 rounded-md border-2 border-gray-300 hover:cursor-pointer hover:border-[#FE881C] hover:-translate-y-1 transition-all duration-200"
            key={index}>
            <img src={item.icon} className="xl:size-8 size-4" />
            <div className="xl:text-base text-sm font-semibold">
              {item.text}
            </div>
          </button>
        ))}
      </div>

      {/* Modal hiển thị form */}
      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        centered
        width={"auto"}>
        {selectedPlatform && (
          <Form platform={selectedPlatform} onClose={handleClose} />
        )}
      </Modal>
    </div>
  );
};

export default Right;
