import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input, Select } from "antd";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchFBPage, schedulePostFacebook } from "@/services/FB-Service";
import { getAccessToken } from "@/auth/handleCookies";
import { getInfoUser, postOnLinkedIn } from "@/services/LI-Service";
import { data } from "react-router-dom";

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
  const [inputDate, setInputDate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | undefined>(); // Để chứa page ID, có thể undefined

  const accessToken = getAccessToken();
  const linkedinAccessToken = localStorage.getItem("linkedin_access_token");
  const linkedinId = localStorage.getItem("linkedin_id");

  const { mutate: convert, isPending } = useMutation({
    mutationFn: (file: string) =>
      new Promise<{ img_urls: string[] }>((resolve) => {
        setTimeout(() => resolve({ img_urls: [file] }), 1000);
      }),
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

  const { data: fbPages, isLoading: isFbLoading } = useQuery({
    queryKey: ["fb-pages", accessToken!],
    queryFn: () => fetchFBPage(accessToken!),
    enabled: !!accessToken && platform === "facebook", // Chỉ fetch khi có token và là platform facebook
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

  const token = localStorage.getItem("linkedin_access_token");

  const { data: userInfo } = useQuery({
    queryKey: ["userInfo", token],
    queryFn: () => getInfoUser(token as string),
    enabled: !!token,
  });

  const postOnLinkedinMutate = useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: { sub: string; content: string };
      token: string;
    }) => postOnLinkedIn(payload, token), // gọi đúng tên hàm
    onSuccess: () => {
      toast.success(t("post.successfully"));
      onClose?.();
      setTimeout(() => window.location.reload(), 500);
    },
    onError: (e) => {
      console.log(e);
      toast.error(t("post.fail"));
    },
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

    console.log(scheduledContent);

    setLoading(true);
    if (platform === "facebook") {
      postOnFacebookMutate.mutate(
        {
          pageToken: fbPages?.data.find((p: any) => p.id === selectedPageId)
            ?.access_token,
          pageId: selectedPageId!, // Thêm dấu ! để báo cho TS biết rằng selectedPageId chắc chắn có giá trị
          message: scheduledContent!,
          imageUrl:
            inputImage && inputImage.length > 0 ? [inputImage[0]] : null,
          scheduledTime: inputDate,
        },
        { onSettled: () => setLoading(false) }
      );
    } else if (platform === "linkedin") {
      postOnLinkedinMutate.mutate(
        {
          payload: {
            sub: linkedinId!,
            content: scheduledContent!,
          },
          token: linkedinAccessToken!,
        },
        { onSettled: () => setLoading(false) }
      );
      console.log(content);
    }
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
  const Step2 = () => {
    useEffect(() => {
      if (platform === "facebook" && fbPages?.data?.length > 0) {
        setSelectedPageId(fbPages.data[0].id);
      }
    }, [fbPages, platform]);

    return (
      <div className="p-4 flex flex-col gap-6 w-auto">
        {platform === "facebook" && (
          <>
            <label className="font-semibold xl:text-base text-xs">
              {t("select.page")}
            </label>
            <Select
              options={fbPages?.data.map((p: any) => ({
                value: p.id,
                label: p.name,
              }))}
              value={selectedPageId}
              onChange={setSelectedPageId}
              className="w-full text-center"
              placeholder={t("select.a.page")}
              disabled={platform !== "facebook"}
            />
          </>
        )}

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
  };

  return (
    <div className="flex flex-col gap-6 xl:w-[900px] w-[300px]">
      <h2 className="text-lg primary">
        {platform === "facebook"
          ? t("schedule.fb.post")
          : platform === "linkedin"
          ? t("schedule.li.post")
          : t("schedule.in.post")}
      </h2>
      {step === 1 ? <Step1 /> : <Step2 />}
    </div>
  );
};

export default Form;
