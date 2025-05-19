import { QuestionCircleOutlined, SendOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Header from "../Common/Header/Header";
import TooltipComponent from "../Common/Tooltip/Tooltip";
import Calendar from "./components/Calendar";
import LearnHowModal from "../Common/Modal/LearnHowModal";
import ModalBeforeLogin from "../Common/Modal/ModalBeforeLogin";
import { fetchFBPage } from "@/services/FB-Service";
import { getAccessToken } from "@/auth/handleCookies";

const PostSchedule = () => {
  const { t } = useTranslation();
  const [openPostSchedule, setOpenPostSchedule] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState(() => {
    return localStorage.getItem("selectedPageId") || "";
  });

  useEffect(() => {
    if (selectedPageId) {
      localStorage.setItem("selectedPageId", selectedPageId);
    }
  }, [selectedPageId]);

  const accessToken = getAccessToken();
  const linkedinAccessToken = localStorage.getItem("linkedin_access_token");

  const isLoggedIn = !!accessToken || !!linkedinAccessToken;

  const { data, isLoading } = useQuery({
    queryKey: ["fb-pages", accessToken],
    queryFn: () => fetchFBPage(accessToken!),
    enabled: isLoggedIn,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!accessToken && !linkedinAccessToken) {
      setShowModal(true);
    }
  }, [accessToken]);

  return (
    <div>
      <Header left={t("posting.schedule")} />
      <div className="flex flex-col gap-3 mt-3">
        <span className="xl:text-lg text-xs xl:flex grid justify-between">
          {t("plan.and.manage.your.social.media.content.in.one.place")}
        </span>

        <div className="xl:flex grid gap-2">
          <span className="font-medium xl:text-base text-xs">
            {t("schedule.post")}
          </span>
          <span
            onClick={() => setOpenPostSchedule(true)}
            className="flex gap-2 primary2 hover:underline hover:cursor-pointer xl:text-base text-xs">
            <QuestionCircleOutlined />
            {t("learn.how.to.schedule.post")}
          </span>

          <LearnHowModal
            open={openPostSchedule}
            onClose={() => setOpenPostSchedule(false)}
            onNext={() => {}}
            done={() => {}}
            type="postSchedule"
          />
        </div>

        <button
          onClick={() => setOpenSchedule(true)}
          className="xl:text-base text-xs xl:py-2 xl:px-5 p-2 text-white rounded-lg bg-primary w-fit flex gap-2">
          <SendOutlined />
          {t("click.here.to.schedule.post")}
        </button>

        <LearnHowModal
          open={openSchedule}
          onClose={() => setOpenSchedule(false)}
          onNext={() => {}}
          done={() => {}}
          type="schedule"
        />

        <div className="font-medium xl:text-base text-xs">
          {t("select.a.page.to.view.schedule.posts")}
          <TooltipComponent
            title={t("view.scheduled.posts")}
            content={t("view.scheduled.posts.content")}
          />
        </div>

        {isLoggedIn ? (
          <Select
            className="max-w-[250px] text-center"
            placeholder={t("select.a.page")}
            value={selectedPageId || undefined}
            loading={isLoading}
            onChange={(value) => setSelectedPageId(value)}
            options={data?.data?.map((page: any) => ({
              value: page.id,
              label: page.name,
            }))}
          />
        ) : (
          <div className="xl:text-base text-xs flex gap-2">
            {t("no.page.available")}
            <a className="primary2 hover:underline" href="/setting">
              {t("let.connect")}
            </a>
          </div>
        )}

        <Calendar pageId={selectedPageId} />
      </div>

      <ModalBeforeLogin open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default PostSchedule;
