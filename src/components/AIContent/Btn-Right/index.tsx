import Header from "@/components/Common/Header/Header";
import { useTranslation } from "react-i18next";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Input, Select } from "antd";
import { BsStars } from "react-icons/bs";
import AIContent from "..";
import AIContentHeader from "../components/AIContentHeader";

const Socials = [
  { icon: <FacebookOutlined />, name: "Facebook", disabled: false },
  { icon: <InstagramOutlined />, name: "Instagram", disabled: false },
  { icon: <LinkedinOutlined />, name: "LinkedIn", disabled: true },
];

const BtnRight = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [back, setBack] = useState(false);

  const handleClick = (name: string, disabled: boolean) => {
    if (!disabled) {
      setSelected(name);
      setShowText(true);
    }
  };

  return (
    <>
      {!back ? (
        <div>
          <AIContentHeader setBack={setBack} />
          <div className="flex flex-col gap-3 mt-3">
            <div className="xl:text-lg text-xs primary">
              {t("which.social.platform.do.you.want.AI.to.create.posts.for")}
            </div>
            <div className="xl:flex grid xl:my-0 gap-4">
              {Socials.map((social, index) => (
                <button
                  key={index}
                  disabled={social.disabled}
                  onClick={() => handleClick(social.name, social.disabled)}
                  className={`xl:text-base text-xs border py-2 px-5 rounded flex gap-2 justify-center transition-all duration-200 font-bold
              ${
                social.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : selected === social.name
                  ? "bg-primary text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
              }
            `}>
                  <span>{social.icon}</span>
                  <span>{social.name}</span>
                </button>
              ))}
            </div>

            {showText && (
              <div className="xl:text-lg text-xs primary mt-2 flex flex-col gap-2">
                <Select
                  className="xl:w-45 w-33 custom-select text-center"
                  defaultValue={t("select.a.page")}
                />
                {t(
                  "which.pages.do.you.want.to.generate.for.the.marketing.plan?"
                )}
              </div>
            )}

            <div
              className="xl:text-base text-xs flex gap-2 items-center primary2 hover:underline hover:cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}>
              <SettingOutlined
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
              {t("advanced.settings")}
            </div>

            {isOpen && (
              <div className="xl:flex grid gap-6">
                <div className="xl:flex grid gap-2 items-center">
                  <span className="primary w-full xl:text-base text-xs">
                    {t("business.type")}
                  </span>
                  <Input />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="primary w-fit flex xl:text-base text-xs">
                    {t("language")}:{" "}
                  </span>
                  <Select
                    defaultValue="Tiếng Việt"
                    style={{ width: "120px" }}
                    options={[
                      { value: "vi", label: "Tiếng Việt" },
                      { value: "en", label: "English" },
                    ]}
                  />
                </div>
              </div>
            )}

            <button className="px-2 mt-6 py-2 xl:text-lg text-xs w-max text-white font-medium rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 hover:cursor-pointer">
              {t("generate.post.content.AI")} <BsStars />
            </button>
          </div>
        </div>
      ) : (
        <AIContent />
      )}
    </>
  );
};

export default BtnRight;
