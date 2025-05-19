import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOutlined,
  CloseOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Radio, Input, Space, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import CustomModal from "@/components/Common/Modal/CustomModal";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteKnowledge,
  getAllKnowledge,
  getPrompt,
  updatePrompt,
} from "@/services/BE-Service";

import Cookies from "universal-cookie";

const cookies = new Cookies();
interface ChowAICanvasProps {
  rss: string[];
  knowledgeBase?: string;
  onChangeRss: (newRss: string[]) => void;
  onChangeKnowledgeBase?: (contents: string) => void; // 👈 phải có
}

const ChowAICanvas: React.FC<ChowAICanvasProps> = ({
  rss,
  onChangeRss,
  onChangeKnowledgeBase,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState("knowledge");
  const [show, setShow] = useState(false);
  const [inputs, setInputs] = useState<string[]>([""]);
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [promptValue, setPromptValue] = useState("");

  const string = selectedContents[0];

  const token = cookies.get("user_token");

  const handleChange = (value: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = value;

    setInputs(newInputs);
  };

  useEffect(() => {
    if (show) {
      setInputs(rss.length > 0 ? rss : [""]);
    }
  }, [show]);

  useEffect(() => {
    if (onChangeKnowledgeBase) {
      onChangeKnowledgeBase(string);
    }
  }, [selectedContents]);

  const handleAdd = () => {
    setInputs([...inputs, ""]);
  };

  const handleDone = () => {
    const invalidInputs = inputs.filter(
      (input) => !input.trim().toLowerCase().endsWith(".xml")
    );

    if (invalidInputs.length > 0) {
      toast.error(t("must.import.xml.file"));
      return;
    }
    toast.success(t("add.successfully"));
    onChangeRss(inputs);
    setShow(false);
  };

  const items = [
    { title: t("branch.voice"), placeHolder: t("branch.voice.place.holder") },
    {
      title: t("target.audience"),
      placeHolder: t("target.audience.place.holder"),
    },
  ];

  const { data } = useQuery({
    queryKey: ["getAllKnowledge", token],
    queryFn: () => getAllKnowledge(token),
    enabled: !!token,
  });

  const deleteMutate = useMutation({
    mutationFn: (postId: string) => deleteKnowledge(postId, token), // Gọi API xoá với postId
    onSuccess: () => {
      toast.success(t("delete.successfully"));
      window.location.reload();
    },
    onError: () => {
      toast.error(t("delete.failed"));
    },
  });

  // Xử lý sự kiện xóa
  const handleDelete = (id: string) => {
    deleteMutate.mutate(id); // Gọi hàm xóa khi click nút X
    setSelectedContents((prev) => prev.filter((content) => content !== id)); // Cập nhật lại selectedContents
  };

  const { data: prompt } = useQuery({
    queryKey: ["prompt", token],
    queryFn: () => getPrompt(token),
    enabled: !!token,
  });

  const updatePromptMutate = useMutation({
    mutationFn: ({ content, token }: { content: string; token: string }) =>
      updatePrompt(content, token),

    onSuccess: () => {
      toast.success(t("update.successfully"));
    },

    onError: (error) => {
      console.error(error);
      toast.error(t("update.failed"));
    },
  });

  const handleUpdatePrompt = async () => {
    const Token = cookies.get("user_token");
    if (!prompt) {
      toast.error("Không có dữ liệu prompt.");
      return;
    }

    updatePromptMutate.mutate({ content: prompt, token: Token });
  };

  useEffect(() => {
    if (prompt) {
      setPromptValue(prompt); // Cập nhật lại giá trị promptValue khi prompt thay đổi
    }
  }, [prompt]);

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
            <div className="font-semibold xl:text-sm text-xs xl:mt-1 mt-1.5">
              <BookOutlined /> {t("knowledge")}
            </div>
          </Radio.Button>
          <Radio.Button value="setting">
            <div className="font-semibold xl:text-sm text-xs xl:mt-1 mt-1.5">
              <SettingOutlined /> {t("setting")}
            </div>
          </Radio.Button>
        </Radio.Group>
      </div>

      {mode === "knowledge" ? (
        <div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold xl:text-base text-xs">
              {t("search.knowledge.base")}
            </span>
            <Input
              className="font-semibold"
              placeholder={t("search.your.knowledge.base")}
            />
            <div className="w-full absolute xl:-bottom-1 -bottom-15">
              <button
                onClick={() => setShow(true)}
                className="border border-gray-200 w-full font-bold rounded-lg p-3 hover mb-4">
                {t("import.external.posts")}
              </button>
            </div>

            {show && (
              <CustomModal
                open={show}
                onCancel={() => setShow(false)}
                title={t("add.xml.file")}
                content={
                  <div className="space-y-2">
                    {inputs.map((value, index) => (
                      <Input
                        key={index}
                        value={value}
                        onChange={(e) => handleChange(e.target.value, index)}
                        placeholder={`XML file ${index + 1}`}
                        className="!mt-2"
                      />
                    ))}

                    <Space className="mt-2">
                      <Button onClick={handleAdd}>Add</Button>
                      <Button type="primary" onClick={handleDone}>
                        Done
                      </Button>
                    </Space>
                  </div>
                }
              />
            )}
          </div>
          <div>
            {Array.isArray(data) && data.length > 0 ? (
              data
                .filter(
                  (item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                )
                .map((item) => {
                  const isSelected = selectedContents.includes(item.content);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 mt-4 border-2 border-gray-200 p-2 rounded-lg">
                      <div className="flex justify-between items-center mt-2">
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              const updated = isSelected
                                ? selectedContents.filter(
                                    (c) => c !== item.content
                                  )
                                : [...selectedContents, item.content];

                              setSelectedContents(updated);
                              onChangeRss(updated);
                            }}
                          />
                        </label>

                        <button
                          className="text-gray-500 text-xs hover"
                          onClick={() => handleDelete(item.id)}>
                          <CloseOutlined />
                        </button>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm">
                          AI Generated
                        </span>
                        <span className="text-gray-400 font-semibold text-sm">
                          {moment(item.created_at).format("DD/MM/YYYY")}
                        </span>
                      </div>

                      <div className="line-clamp-2">{item.content}</div>
                    </div>
                  );
                })
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
            <TextArea
              onChange={(e) => setPromptValue(e.target.value)}
              // rows={9}
              style={{ resize: "none" }}
              value={promptValue}
            />
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
          <div className="w-full flex justify-end mt-5">
            <Button
              onClick={() => handleUpdatePrompt()}
              variant="solid"
              color="cyan">
              {t("save")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChowAICanvas;
