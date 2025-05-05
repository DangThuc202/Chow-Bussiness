import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsProps } from "antd";
import { CloseOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import ChatBox from "./components/ChatBox";
import ChowAICanvas from "./components/ChowAICanvas";
import GeneratedPost from "./components/GeneratedPost";

const AICanvas = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [generatedPostContent, setGeneratedPostContent] = useState<
    string | null
  >(null);
  const [showChowContent, setShowChowContent] = useState(false);

  const handleContentGenerated = (content: string) => {
    setGeneratedPostContent(content);
  };

  const handlePostConfirmed = () => {
    setShowChowContent(true);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Chow AI Canvas",
      children: (
        <ChowAICanvas
          generatedContent={generatedPostContent}
          showChowContent={showChowContent}
        />
      ),
    },
    {
      key: "2",
      label: t("generated.posts"),
      children: (
        <GeneratedPost
          generatedContent={generatedPostContent}
          onConfirm={handlePostConfirmed}
        />
      ),
    },
  ];

  const containerWidthClass = collapsed ? "w-[4%]" : "w-[30%]";

  return (
    <div className="flex pt-2 gap-[2%] w-full justify-between">
      <div className="w-full h-[85vh]">
        <ChatBox onGenerateContent={handleContentGenerated} />
      </div>

      <div
        className={`relative transition-all duration-300 ${containerWidthClass}`}>
        {collapsed && (
          <button
            className="absolute top-2 left-2 z-10 bg-white shadow-md rounded-full p-2 text-xs hover"
            onClick={() => setCollapsed(false)}>
            <MenuUnfoldOutlined />
          </button>
        )}

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              key="tabs-panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative border border-gray-300 px-2 rounded-2xl bg-white overflow-hidden">
              <button
                className=" bg-white shadow-md rounded-full p-2 hover text-xs mt-1"
                onClick={() => setCollapsed(true)}>
                <CloseOutlined />
              </button>
              <Tabs items={items} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AICanvas;
