import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Radio, Input, Checkbox, Pagination } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";

interface ChowAICanvasProps {
  generatedContent: string | null;
  showChowContent: boolean;
}

const ChowAICanvas: React.FC<ChowAICanvasProps> = ({
  generatedContent,
  showChowContent,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState("knowledge");
  const items = [
    { title: t("branch.voice"), placeHolder: t("branch.voice.place.holder") },
    {
      title: t("target.audience"),
      placeHolder: t("target.audience.place.holder"),
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-[73vh]">
      <div className="text-xs font-semibold">
        <DatabaseOutlined /> Chow AI Canvas
      </div>
      <div className="w-full">
        <Radio.Group
          block
          defaultValue="knowledge"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          optionType="button"
          className="w-full"
          buttonStyle="solid">
          <Radio.Button value="knowledge">
            <div className="font-semibold">
              <BookOutlined /> {t("knowledge")}
            </div>
          </Radio.Button>
          <Radio.Button value="setting">
            <div className="font-semibold">
              <SettingOutlined /> {t("setting")}
            </div>
          </Radio.Button>
        </Radio.Group>
      </div>

      {mode === "knowledge" ? (
        <div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">{t("search.knowledge.base")}</span>
            <Input
              className="font-semibold"
              placeholder={t("search.your.knowledge.base")}
            />
            <div className="w-full absolute -bottom-1">
              <button className="border border-gray-200 w-full font-bold rounded-lg p-3 hover mb-4">
                {t("import.external.posts")}
              </button>
            </div>
          </div>
          <div>
            {showChowContent && generatedContent ? ( // Use showChowContent here
              <div className="flex flex-col gap-2 mt-4 border-2 border-gray-200 p-2 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">AI Generated</span>
                  <span className="text-gray-400 font-semibold text-sm">
                    {moment().format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="line-clamp-2">{generatedContent}</div>
              </div>
            ) : (
              <div className="mt-5">
                <div className="text-center font-bold text-xs">
                  {t("no.posts.in.knowledge.base.yet")}
                </div>
                <div className="break-words text-center text-[10px]">
                  {t("import.generated.posts.to.build.your.knowledge.base")}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div>
            <span className="font-semibold">{t("system.prompt")}</span>
            <TextArea rows={10} style={{ resize: "none" }} />
          </div>
          <span className="text-xs text-gray-400 font-semibold">
            {t("this.is.prompt.guide...")}
          </span>
          <div className="mt-3 flex flex-col gap-3">
            {items.map((item, index) => (
              <div key={index}>
                <span className="font-semibold">{item.title}</span>
                <Input placeholder={item.placeHolder} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChowAICanvas;
