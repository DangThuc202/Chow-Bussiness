import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import AIContentHeader from "../../components/AIContentHeader";
import { useEffect, useState } from "react";
import TooltipComponent from "@/components/Common/Tooltip/Tooltip";
import { Input, Modal, Select, Upload } from "antd";
import {
  ClockCircleOutlined,
  CloudDownloadOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  ScheduleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { BsStars } from "react-icons/bs";
import pdfToText from "react-pdftotext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchFBPage, schedulePostFacebook } from "@/services/FB-Service";
import { getAccessToken } from "@/auth/handleCookies";
import LoadingPageAIGenerate from "@/components/Common/Loading/LoadingPageAIGenerate";
import { generateAIMarketingPlan, generatePost } from "@/services/BE-Service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;

const Generate = ({
  charCount,
  chatData,
}: {
  charCount: number;
  chatData: { formatted: string; raw: string[] } | null;
}) => {
  const LIMIT_COUNT = 10000;
  const locale = LIMIT_COUNT.toLocaleString();
  const { t } = useTranslation();

  const [back, setBack] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [pageToken, setPageToken] = useState<string>("");
  const [uploadedPDFs, setUploadedPDFs] = useState<
    { name: string; content: string; charCount: number }[]
  >([]);
  const [pdfCharCount, setPdfCharCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("VN");
  const [showModal, setShowModal] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const navigate = useNavigate();

  const fixExtractedText = (text: string) => {
    return text.replace(/\s+(?=[a-zA-Z])/g, "");
  };

  const handleClick = (name: string, disabled: boolean) => {
    if (!disabled) {
      setSelected(name);
      setShowText(true);
    }
  };

  const handleUploadMultipleFiles = async (files: File[]) => {
    const uploaded: {
      name: string;
      content: string;
      charCount: number;
    }[] = [];

    for (const file of files) {
      try {
        const text = await pdfToText(file);
        const fixedText = fixExtractedText(text);
        uploaded.push({
          name: file.name,
          content: fixedText,
          charCount: fixedText.length,
        });
      } catch (error) {
        console.error(`Error reading ${file.name}:`, error);
      }
    }

    setUploadedPDFs((prev) => [...prev, ...uploaded]);
    setPdfCharCount(
      (prev) => prev + uploaded.reduce((acc, f) => acc + f.charCount, 0)
    );
  };

  const props = {
    beforeUpload: async (file: File, fileList: File[]) => {
      const pdfFiles = fileList.filter((f) => f.type === "application/pdf");

      if (pdfFiles.length === 0) {
        alert("Chỉ được upload file PDF!");
        return Upload.LIST_IGNORE;
      }

      await handleUploadMultipleFiles(pdfFiles);
      return false;
    },
    multiple: true,
    maxCount: Infinity,
    accept: ".pdf",
    showUploadList: false,
  };

  const accessToken = getAccessToken();
  const isLoggedIn = !!accessToken;

  const { data, isLoading } = useQuery({
    queryKey: ["fb-pages", accessToken],
    queryFn: () => fetchFBPage(accessToken!),
    enabled: isLoggedIn,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.data?.length > 0) {
      const token = data.data[0].access_token; // hoặc chọn theo điều kiện
      setPageToken(token);
    }
  }, [data]);

  const Socials = [
    { icon: <FacebookOutlined />, name: "Facebook", disabled: false },
    { icon: <InstagramOutlined />, name: "Instagram", disabled: false },
    { icon: <LinkedinOutlined />, name: "LinkedIn", disabled: true },
  ];

  const generateMutate = useMutation({
    mutationFn: generateAIMarketingPlan,
    onSuccess: (data) => {
      setSuccessData(data);
      setShowModal(true);
      toast.success(t("marketing.plan.generated.successfully"));
      setIsGenerating(false);
    },
    onError: (error) => {
      toast.error(t("error.generating.marketing.plan"));
      console.error("Error:", error);
      setIsGenerating(false);
    },
  });

  const extractNumberOfDays = (text: string) => {
    // Sử dụng regex để tìm số ngày trong câu (ví dụ: "Số ngày là 5")
    const match = text.match(/\d+/); // Tìm số đầu tiên trong câu
    return match ? parseInt(match[0], 10) : 0; // Trả về số ngày hoặc 0 nếu không tìm thấy
  };

  const handleGenerate = () => {
    if (!selected) {
      toast.error("Vui lòng chọn nền tảng mạng xã hội!");
      return;
    }

    if (!selectedPageId) {
      toast.error("Vui lòng chọn page để tạo marketing plan!");
      return;
    }

    // Lấy thông tin từ chatData
    const contentCombined = uploadedPDFs.map((f) => f.content).join("\n");
    const additionalContent = chatData?.formatted || ""; // Hoặc bạn có thể sử dụng chatData.raw nếu cần

    // Lấy câu hỏi cuối cùng từ chatData.raw và trích xuất n_day
    const lastQuestion = chatData?.raw?.[chatData.raw.length - 1]; // Câu hỏi cuối cùng
    const n_day = lastQuestion ? extractNumberOfDays(lastQuestion) : 0; // Trích xuất số ngày từ câu hỏi cuối

    // Tạo payload
    const payload = {
      social_platform: selected,
      knowledge_base: contentCombined + "\n" + additionalContent, // Kết hợp nội dung từ PDF và chatData
      n_days: n_day,
      business: input,
      language: language,
    };
    setIsGenerating(true);
    generateMutate.mutate(payload);
  };

  const postMutate = useMutation({
    mutationFn: generatePost,
    onSuccess: (data) => {
      localStorage.setItem("postData", JSON.stringify(data));
      handlePostOnFacebook(data);
    },
    onError: (error) => {
      toast.error(t("error.generating.marketing.plan"));
      console.error("Error:", error);
    },
  });

  const handlePost = () => {
    const contentCombined = uploadedPDFs.map((f) => f.content).join("\n");
    const additionalContent = chatData?.formatted || "";
    const payload = {
      social_platform: "Facebook",
      business: input,
      language: language,
      knowledge_base: contentCombined + "\n" + additionalContent,
      post_titles: successData?.post_titles,
      timestamps: successData?.timestamps,
    };
    setIsPosting(true);
    postMutate.mutate(payload as any);
  };

  const postOnFacebookMutate = useMutation({
    mutationFn: schedulePostFacebook,
    onSuccess: (data) => {
      toast.success(t("marketing.plan.generated.successfully"));
      navigate("/social-media/social-post-scheduler", { state: data });
    },
    onError: () => {
      toast.error("Error");
    },
  });

  const handlePostOnFacebook = (post: any) => {
    const updateData = {
      pageToken: pageToken,
      pageId: selectedPageId,
      message: post?.social_posts[0],
      imageUrl: post?.imageUrl,
      scheduledTime: post?.timestamps[0], // nếu chỉ lấy 1 timestamp
    };
    postOnFacebookMutate.mutate(updateData);
  };

  return (
    <div>
      <AIContentHeader setBack={() => setBack(true)} />

      <div className="mt-3 flex flex-col gap-5">
        <div className="xl:text-base text-xs">
          {t("the.character...")} {locale} {t("...character")}{" "}
          <span className="text-blue-500">{charCount + pdfCharCount}</span>/
          {locale}
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <span className="primary font-semibold xl:text-lg text-xs">
              {t("upload.new.content")}
            </span>{" "}
            <span className="xl:text-base text-[8px]">{t("optional")}</span>{" "}
            <TooltipComponent
              title={t("simple.content")}
              content={t("simple.content.content")}
            />
          </div>

          <Dragger {...props}>
            {uploadedPDFs.length === 0 ? (
              <>
                <p className="ant-upload-drag-icon">
                  <CloudDownloadOutlined />
                </p>
                <p className="ant-upload-text">
                  {t("click.or.drag.file.upload")}
                </p>
                <p className="ant-upload-hint xl:text-base text-xs text-red-600">
                  {t("PDF.only")}
                </p>
              </>
            ) : (
              <div className="flex justify-around">
                <div className="text-xs xl:text-sm text-left">
                  <div className="font-semibold text-primary mb-2">
                    {t("uploaded.file.info")}
                  </div>
                  <ul className="space-y-1">
                    {uploadedPDFs.map((file, idx) => (
                      <li key={idx}>
                        <strong>{t("file.name")}:</strong> {file.name} —{" "}
                        <strong>{t("character.count")}:</strong>{" "}
                        {file.charCount.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="ant-upload-drag-icon">
                    <CloudDownloadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    {t("click.or.drag.file.upload")}
                  </p>
                  <p className="ant-upload-hint xl:text-base text-xs text-red-600">
                    {t("PDF.only")}
                  </p>
                </div>
              </div>
            )}
          </Dragger>
        </div>

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
                <span>{social.icon} </span>
                <span>{social.name}</span>
              </button>
            ))}
          </div>

          {showText && (
            <div className="xl:text-lg text-xs primary mt-2 flex flex-col gap-2">
              <Select
                className="max-w-[290px] text-center"
                placeholder={t("select.a.page")}
                loading={isLoading}
                options={data?.data?.map((page: any) => ({
                  value: page.id,
                  label: page.name,
                }))}
                onChange={(val) => setSelectedPageId(val)}
              />
              {t("which.pages.do.you.want.to.generate.for.the.marketing.plan?")}
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
                <Input onChange={(e) => setInput(e.target.value)} />
              </div>
              <div className="flex gap-2 items-center">
                <span className="primary w-fit flex xl:text-base text-xs">
                  {t("language")}:
                </span>
                <Select
                  defaultValue="VN"
                  onChange={(value) => setLanguage(value)}
                  style={{ width: "120px" }}
                  options={[
                    { value: "VN", label: "Tiếng Việt" },
                    { value: "EN", label: "English" },
                  ]}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="px-4 mt-6 py-2 xl:text-lg text-xs xl:w-max w-full justify-center text-white font-medium rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 hover:cursor-pointer">
            {isGenerating ? (
              <LoadingPageAIGenerate />
            ) : (
              <>
                {t("generate.post.content.AI")}
                <BsStars />
              </>
            )}
          </button>
        </div>
      </div>

      <Modal
        styles={{ body: { maxHeight: "50vh", overflowY: "auto" } }}
        width={"80%"}
        title={
          <div>
            <span className="flex gap-3 uppercase xl:text-lg text-sm">
              <ScheduleOutlined /> {t("posting.schedule")}
            </span>
            <span className="flex gap-3 xl:text-lg text-xs">
              <ClockCircleOutlined /> {t("estimated.generation.time")} 5{" "}
              {t("minutes")}
            </span>
          </div>
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={
          <div className="flex justify-between">
            <button className="px-4 mt-6 py-2 xl:text-lg text-xs w-max text-white font-medium rounded-md bg-blue-400">
              {t("cancel")}
            </button>

            {isPosting ? (
              <LoadingPageAIGenerate />
            ) : (
              <button
                onClick={handlePost}
                className="xl:px-4 mt-6 xl:py-2 px-1 xl:text-lg text-xs w-max text-white font-medium rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 hover:cursor-pointer">
                {t("generate.post.content.AI")}
                <BsStars className="xl: mr-0" />
              </button>
            )}
          </div>
        }>
        {successData && (
          <div className="whitespace-pre-line xl:text-lg text-xs">
            {successData?.marketing_plan}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Generate;
