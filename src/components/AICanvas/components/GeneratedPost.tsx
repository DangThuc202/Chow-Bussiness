import React, { useState, useEffect } from "react";
import {
  CheckOutlined,
  EditOutlined,
  ExportOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Checkbox, Pagination, Modal, Input } from "antd";
import { useTranslation } from "react-i18next";
import FB from "@/assets/PostSchedule/iconFacebook.svg";
import toast from "react-hot-toast";

interface GeneratedPostProps {
  generatedContent: string | null;
  onConfirm: () => void;
}
const GeneratedPost: React.FC<GeneratedPostProps> = ({
  generatedContent,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const pageContent = generatedContent ? [generatedContent] : [];
  const [localPageContent, setLocalPageContent] = useState(pageContent);

  useEffect(() => {
    setLocalPageContent(pageContent);
  }, [pageContent]);

  const handleConfirm = () => {
    toast.success(t("post.successfully"));
    onConfirm();
  };

  const showModal = () => {
    setIsModalVisible(true);
    setEditedContent(localPageContent[currentPage - 1] || "");
  };

  const handleModalOk = () => {
    const newPageContent = [...localPageContent];
    newPageContent[currentPage - 1] = editedContent;
    setLocalPageContent(newPageContent);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onEdit = () => {
    toast.success("OK");
    setIsModalVisible(false);
  };

  const handleExport = () => {
    const jsonData = {
      posts: localPageContent,
      exportedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(jsonData, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const file = document.createElement("a");
    file.href = url;
    file.download = "exported_posts.json";
    document.body.appendChild(file);
    file.click();
    document.body.removeChild(file);
    URL.revokeObjectURL(url);

    toast.success("export.successfully");
  };

  return (
    <div className="flex flex-col gap-4 h-[73vh]">
      <div className="flex justify-between">
        <div className="text-xs font-semibold items-center">
          <FileTextOutlined /> {t("generated.posts")}
        </div>
        <div className="flex gap-2 text-xs">
          <span>
            {pageContent.length} {t("post")}
          </span>
          {isChecked && pageContent.length > 0 && (
            <button
              className="border border-gray-400 px-2 flex gap-2 hover"
              onClick={handleExport}>
              <ExportOutlined />
              <span className="font-semibold text-xs">
                {t("export")} {pageContent.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {pageContent.length > 0 ? (
        <div className="border-2 border-gray-200 p-3 rounded-lg mt-2">
          <div className="flex justify-between">
            <div className="flex gap-1.5 items-center">
              <Checkbox onChange={handleCheckboxChange} />
              <img src={FB} className="size-4" alt="Facebook" />
              <span className="font-semibold text-xs">Facebook</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-blue-100 px-2 rounded-2xl text-xs flex items-center">
                marketing
              </div>
              <div className="bg-blue-100 px-2 rounded-2xl text-xs flex items-center">
                AI
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full items-center">
            <div className="mt-4 line-clamp-4">
              <p>{localPageContent[currentPage - 1]}</p>{" "}
            </div>
            <div className="mt-4">
              <Pagination
                current={currentPage}
                total={5}
                pageSize={1}
                onChange={onPageChange}
                size="small"
              />
            </div>
          </div>

          <div className="flex gap-5 w-full justify-center mt-4">
            <button
              className=" hover:cursor-pointer hover:bg-blue-200 p-1 rounded-md"
              onClick={showModal} // Show modal on click
            >
              <EditOutlined />
            </button>
            <button
              onClick={handleConfirm}
              className=" hover:cursor-pointer hover:bg-blue-200 p-1 rounded-md">
              <CheckOutlined />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 text-center">
          <p>{t("no.posts.generated.yet")}</p>
        </div>
      )}

      <Modal // Modal component
        title={t("edit.post")}
        open={isModalVisible}
        onOk={handleModalOk}
        footer={
          <button
            onClick={onEdit}
            className="w-full bg-black text-white rounded-lg p-3 hover">
            {t("save.changes")}
          </button>
        }
        onCancel={handleModalCancel}>
        <Input.TextArea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={7}
          style={{ resize: "none" }}
        />
      </Modal>
    </div>
  );
};

export default GeneratedPost;
