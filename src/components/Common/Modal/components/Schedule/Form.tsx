import { getAccessToken } from "@/auth/handleCookies";
import { convertImg } from "@/services/BE-Service";
import { fetchFBPage, schedulePostFacebook } from "@/services/FB-Service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input, Select } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Form = ({
  platform,
  content = "",
  onClose,
}: {
  platform: string;
  content?: string;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  // Chỉ giữ content đã finalized từ Step1
  const [scheduledContent, setScheduledContent] = useState(content);
  const [inputImage, setInputImage] = useState<string[] | undefined>(undefined);
  const [inputDate, setInputDate] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const accessToken = getAccessToken();

  const { mutate: convert, isPending } = useMutation({
    mutationFn: convertImg,
    onSuccess: (url?: { img_urls: string[] }) => {
      const imageURL = url?.img_urls[0];
      if (imageURL) {
        setInputImage([imageURL]);
      }
      setStep(2);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["fb-pages", accessToken],
    queryFn: () => fetchFBPage(accessToken!),
    enabled: !!accessToken,
  });

  const postOnFacebookMutate = useMutation({
    mutationFn: schedulePostFacebook,
    onSuccess: () => {
      toast.success(t("post.successfully"));
      onClose?.();
      setTimeout(() => window.location.reload(), 500);
    },
    onError: () => toast.error(t("post.fail")),
  });

  const formatDateTime = (ts: number) => {
    const d = new Date(ts * 1000);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const handleSchedule = () => {
    const now = Math.floor(Date.now() / 1000);
    if (!inputDate) return toast.error(t("post.fail"));
    if (inputDate < now + 600)
      return toast.error(t("time.must.10.minutes.later"));

    setLoading(true);
    postOnFacebookMutate.mutate(
      {
        pageToken: data?.data.find((p: any) => p.id === selectedPageId)
          ?.access_token,
        pageId: selectedPageId,
        message: scheduledContent!,
        imageUrl: inputImage && inputImage.length > 0 ? [inputImage[0]] : null,
        scheduledTime: inputDate,
      },
      { onSettled: () => setLoading(false) }
    );
  };

  // ----- STEP 1 -----
  const Step1 = () => {
    const [localContent, setLocalContent] = useState(scheduledContent);

    const onNext = () => {
      if (!localContent) return toast.error(t("content.is.required"));
      setScheduledContent(localContent);
      if (inputImage) convert(inputImage[0]);
      else setStep(2);
    };

    return (
      <div className="p-4 flex flex-col gap-6">
        <label className="font-semibold xl:text-base text-xs">
          {t("content")}
        </label>
        <textarea
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          className="border p-2 rounded resize-none w-auto"
          rows={10}
          placeholder={t("input.content")}
        />

        <label className="font-semibold xl:text-base text-xs">
          {t("image.url")}
        </label>
        <Input
          value={inputImage || ""}
          onChange={(e) => setInputImage(e.target.value.split(","))}
          placeholder={t("paste") + t("image.url")}
        />

        <button
          onClick={onNext}
          disabled={isPending}
          className={`self-end px-4 py-2 rounded text-white hover ${
            isPending ? "bg-gray-400 cursor-not-allowed" : "bg-[rgb(3,105,94)]"
          }`}>
          {isPending ? `${t("next")}...` : t("next")}
        </button>
      </div>
    );
  };

  // ----- STEP 2 -----
  const [selectedPageId, setSelectedPageId] = useState(data?.data[0]?.id);
  const Step2 = () => (
    <div className="p-4 flex flex-col gap-6 w-auto">
      <label className="font-semibold xl:text-base text-xs">
        {t("select.page")}
      </label>
      <Select
        options={data?.data.map((p: any) => ({ value: p.id, label: p.name }))}
        value={selectedPageId}
        onChange={setSelectedPageId}
        className="w-full text-center"
        placeholder={t("select.a.page")}
      />

      <label className="font-semibold xl:text-base text-xs">
        {t("posting.time")}
      </label>
      <input
        type="datetime-local"
        value={inputDate ? formatDateTime(inputDate) : ""}
        onChange={(e) =>
          setInputDate(Math.floor(new Date(e.target.value).getTime() / 1000))
        }
        className="border p-2 rounded"
      />

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2 rounded bg-blue-500 text-white hover">
          {t("previous")}
        </button>
        <button
          onClick={handleSchedule}
          disabled={loading}
          className="px-4 py-2 rounded bg-green-500 text-white hover">
          {loading ? `${t("schedule")}...` : t("schedule")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 xl:w-[900px] w-[300px]">
      <h2 className="text-lg primary">
        {platform === "Facebook"
          ? t("schedule.fb.post")
          : t("schedule.in.post")}
      </h2>
      {step === 1 ? (
        <Step1 />
      ) : isLoading ? (
        <p>{t("loading")}...</p>
      ) : (
        <Step2 />
      )}
    </div>
  );
};

export default Form;
