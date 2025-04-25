import { useEffect, useState, useMemo } from "react";
import { Badge, Calendar, DatePicker, Divider, Modal, Radio } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteSchedulePostFacebook,
  fetchFBPage,
  getAllSchedulePostFacebook,
  getScheduledPostFacebook,
} from "@/services/FB-Service";
import { getAccessToken } from "@/auth/handleCookies";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import FB from "@/assets/PostSchedule/iconFacebook.svg";
import avatar from "@/assets/AIContent/loadingGenerate.gif";
import toast from "react-hot-toast";
import LoadingPage from "@/components/Common/Loading/LoadingPage";

const hours = Array.from({ length: 25 }, (_, i) => i); // 0-24 giờ

const CalendarComponent = ({ pageId }: { pageId: string }) => {
  const [mode, setMode] = useState<"month" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedModalDate, setSelectedModalDate] = useState<string | null>(
    null
  );
  const { t } = useTranslation();
  const accessToken = getAccessToken();
  const [isMobile, setIsMobile] = useState(false);
  const [postId, setPostId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleTodayClick = () => {
    setSelectedDate(dayjs());
  };

  const { data: page } = useQuery({
    queryKey: ["fb-pages", accessToken],
    queryFn: () => fetchFBPage(accessToken!),
  });

  const { data } = useQuery({
    queryKey: ["facebook-scheduled-posts", pageId],
    queryFn: () =>
      getAllSchedulePostFacebook(page?.data[0].access_token, pageId),
    enabled: !!pageId && !!page?.data[0].access_token,
  });

  const { data: postDetail } = useQuery({
    queryKey: ["postDetail", postId],
    queryFn: () => getScheduledPostFacebook(page?.data[0].access_token, postId),
    enabled: !!postId && !!page?.data[0].access_token,
  });

  const deleteMutate = useMutation({
    mutationFn: () =>
      deleteSchedulePostFacebook(postId, page?.data[0].access_token),
    onMutate: () => {
      setIsPending(true);
      toast.loading(t("deleting"), { id: "delete-toast" });
    },
    onSuccess: () => {
      toast.success("Xóa thành công!", { id: "delete-toast" });
      setTimeout(() => window.location.reload(), 500);
    },
    onError: () => {
      toast.error("Xóa thất bại!", { id: "delete-toast" });
      setIsPending(false);
    },
  });

  const handleDelete = (data: any) => {
    deleteMutate.mutate(data);
    setIsPending(true);
  };

  const postCountByDate = useMemo(() => {
    if (!data?.data) return {};
    return data.data.reduce((acc: Record<string, number>, post: any) => {
      const date = dayjs.unix(post.scheduled_publish_time).format("YYYY-MM-DD");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleShowModal = (dateStr: string) => {
    setSelectedModalDate(dateStr);
    setShowModal(true);
  };

  const handleView = (post: any) => {
    setShowModalDetail(true);
    setSelectedPost(post);
  };

  const currentPage = page?.data.find((p: any) => p.id === pageId);
  const currentPageName = currentPage?.name;

  const renderDayView = () => {
    const startOfWeek = selectedDate.startOf("week");
    const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

    return (
      <div className="overflow-auto border rounded">
        <div className="grid grid-cols-8 border-b font-semibold sticky top-0 bg-white z-10">
          <div className="bg-gray-100 p-2" />
          {days.map((day) => (
            <div
              key={day.toString()}
              className="bg-gray-100 p-2 text-center xl:text-base text-xs">
              {day.format("ddd DD")}
            </div>
          ))}
        </div>

        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-2 bg-gray-50 text-right pr-4 text-gray-500 xl:text-base text-xs">
              {hour}:00
            </div>
            {days.map((day) => (
              <div
                key={day.toString() + hour}
                className="p-2 border-l border-gray-100 hover:bg-blue-50 cursor-pointer"
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="xl:flex grid xl:justify-between gap-3">
        <div className="xl:flex grid gap-3">
          <div className="w-1/2">
            <DatePicker
              className="w-full"
              picker={mode === "month" ? "month" : "date"}
              value={selectedDate}
              onChange={(d) => setSelectedDate(d!)}
            />
          </div>
          <button
            onClick={handleTodayClick}
            className="xl:px-5 px-2 py-1 border border-gray-300 rounded hover xl:text-base text-sm w-fit">
            {t("today")}
          </button>
        </div>
        <Radio.Group
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          optionType="button"
          className="!justify-end !flex"
          buttonStyle="solid">
          <Radio.Button value="month">{t("month")}</Radio.Button>
          <Radio.Button value="day">{t("day")}</Radio.Button>
        </Radio.Group>
      </div>

      {mode === "month" ? (
        <>
          <Calendar
            fullscreen
            value={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            headerRender={() => null}
            cellRender={(date) => {
              const formatted = date.format("YYYY-MM-DD");
              const count = postCountByDate[formatted];
              if (!count) return null;

              return (
                <div
                  onClick={() => handleShowModal(formatted)}
                  className="flex justify-center mt-4">
                  {isMobile ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      viewBox="0 0 48 48">
                      <linearGradient
                        id="blue-fb"
                        x1="9.993"
                        x2="40.615"
                        y1="9.993"
                        y2="40.615"
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#2aa4f4" />
                        <stop offset="1" stopColor="#007ad9" />
                      </linearGradient>
                      <rect
                        x="0"
                        y="0"
                        width="48"
                        height="48"
                        fill="url(#blue-fb)"
                      />
                      <path
                        fill="#fff"
                        d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                      />
                    </svg>
                  ) : (
                    <Badge count={count} className="xl:size-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="xl:size-10 size-3 rounded-lg"
                        viewBox="0 0 48 48">
                        <linearGradient
                          id="blue-fb"
                          x1="9.993"
                          x2="40.615"
                          y1="9.993"
                          y2="40.615"
                          gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#2aa4f4"></stop>
                          <stop offset="1" stopColor="#007ad9"></stop>
                        </linearGradient>
                        <rect
                          x="0"
                          y="0"
                          width="48"
                          height="48"
                          fill="url(#blue-fb)"
                        />
                        <path
                          fill="#fff"
                          d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                        />
                      </svg>
                    </Badge>
                  )}
                </div>
              );
            }}
          />

          <Modal
            width={"80%"}
            open={showModal}
            onCancel={() => setShowModal(false)}
            footer={null}>
            <div className="w-full">
              <h2 className="font-bold xl:text-lg text-sm mb-2 primary mb-7">
                <ScheduleOutlined className="xl:text-lg text-sm" />{" "}
                {t("list.schedule.post")} ({selectedModalDate})
              </h2>
              {data?.data
                ?.filter(
                  (post: any) =>
                    dayjs
                      .unix(post.scheduled_publish_time)
                      .format("YYYY-MM-DD") === selectedModalDate
                )
                .map((post: any, index: number, array: any[]) => (
                  <div onClick={() => setPostId(post?.id)} key={post.id}>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-10 items-center">
                        <img src={FB} className="xl:size-10 size-7" />
                        {!isMobile && (
                          <span className="font-medium xl:text-lg text-sm">
                            Facebook
                          </span>
                        )}
                      </div>
                      <div className="xl:text-base text-xs">
                        {dayjs(post?.created_time).format("hh:mm A")}
                      </div>
                      <div className="flex xl:gap-6 gap-3 xl:text-2xl text-sm">
                        <span className="text-green-500 hover">
                          <EditOutlined />
                        </span>
                        <span
                          onClick={handleDelete}
                          className="text-red-500 hover">
                          <DeleteOutlined />
                        </span>
                        <span
                          onClick={handleView}
                          className="text-blue-500 hover">
                          <EyeOutlined />
                        </span>

                        {showModalDetail && selectedPost && (
                          <Modal
                            open={showModalDetail}
                            onCancel={() => setShowModalDetail(false)}
                            footer={null}>
                            <div className="max-h-[500px] overflow-y-auto space-y-4">
                              <div className="flex flex-col gap-10">
                                <div className="flex gap-3 items-center">
                                  <img
                                    src={avatar}
                                    className="xl:size-10 size-7"
                                  />
                                  <div className="flex flex-col">
                                    <span className="xl:text-lg text-base font-semibold">
                                      {currentPageName}
                                    </span>
                                    <span className="xl:text-base text-xs">
                                      {dayjs(postDetail?.created_time).format(
                                        "hh:mm A"
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div
                                    className={`mt-1 whitespace-pre-wrap transition-all ${
                                      showFullMessage
                                        ? "max-h-full"
                                        : "max-h-[110px] overflow-hidden"
                                    }`}>
                                    {postDetail?.message}
                                  </div>
                                  {postDetail?.message?.length > 200 && (
                                    <button
                                      onClick={() =>
                                        setShowFullMessage(!showFullMessage)
                                      }
                                      className="text-blue-500 underline">
                                      {showFullMessage ? "Thu gọn" : "Xem thêm"}
                                    </button>
                                  )}
                                </div>
                                <div className="flex justify-center">
                                  {postDetail?.attachments?.data?.[0]?.media
                                    ?.image?.src ? (
                                    <img
                                      src={
                                        postDetail.attachments.data[0].media
                                          .image.src
                                      }
                                      alt={t("no.picture")}
                                      className="xl:size-[50%] size-[40%]"
                                    />
                                  ) : (
                                    <div className="text-gray-400 text-sm">
                                      {t("no.picture")}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Modal>
                        )}
                      </div>
                    </div>
                    {index < array.length - 1 && <Divider className="my-2" />}
                  </div>
                ))}
            </div>
          </Modal>
        </>
      ) : (
        renderDayView()
      )}
    </div>
  );
};

export default CalendarComponent;
