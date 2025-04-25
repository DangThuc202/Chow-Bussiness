import React, { useState, useEffect } from "react";
import Header from "../Common/Header/Header";
import { useTranslation } from "react-i18next";
import { Input, Select } from "antd";
import toast from "react-hot-toast";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/auth/handleCookies";
import LearnHowModal from "../Common/Modal/LearnHowModal";
import { useQuery } from "@tanstack/react-query";
import { fetchFBPage, getPageTokenByPageId } from "@/services/FB-Service";

const Setting = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [appId, setAppId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [isOpenPopupContinueScheduling, setIsOpenPopupContinueScheduling] =
    useState(false);
  const [tokenExpiryTimeout, setTokenExpiryTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [accessToken, setAccessTokenState] = useState<string>(
    getAccessToken() || ""
  );

  const [selectedPages, setSelectedPages] = useState<{
    currentFbPage: { pageId: string; pageName: string };
    currentInstaPage: { pageId: string; pageName: string };
  }>({
    currentFbPage: { pageId: "", pageName: "" },
    currentInstaPage: { pageId: "", pageName: "" },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["fb-pages", accessToken],
    queryFn: () => fetchFBPage(accessToken!),
  });

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      const pageInfos = data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        pageToken: item.access_token,
      }));
      localStorage.setItem("fbPageInfos", JSON.stringify(pageInfos));
    }
  }, [data]);

  // Check if user is logged in when component is mounted
  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, [accessToken]);

  const handleClickSave = () => {
    businessType === ""
      ? toast.error(t("empty.toast"))
      : toast.success(t("save.successfully"));
  };

  const handleConnect = async (appId: string) => {
    if (!appId.trim()) {
      toast.error(t("please.enter.a.valid.app.ID."));
      return;
    }

    try {
      await loadFacebookSDK(appId);
    } catch (error) {
      toast.error(t("Error loading Facebook SDK"));
      return;
    }

    if (window.FB) {
      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            const { accessToken: newAccessToken, expiresIn } =
              response.authResponse;

            resetAppState();

            setAccessTokenState(newAccessToken);
            setAccessToken(newAccessToken);
            setIsLoggedIn(true);
            toast.success(t("login.successful"));

            checkTokenExpiry(expiresIn);

            const schedulingPost = localStorage.getItem("schedulingPost");
            if (schedulingPost) {
              setIsOpenPopupContinueScheduling(true);
            }

            window.FB.api("/me/accounts", (res: any) => {
              if (res && !res.error && res.data?.length > 0) {
                const page = res.data[0];
                setSelectedPages((prev) => ({
                  ...prev,
                  currentFbPage: {
                    pageId: page.id,
                    pageName: page.name,
                  },
                }));
              }
            });
          } else {
            toast.error(t("login.cancelled.or.invalid.app.ID"));
          }
        },
        {
          scope:
            "pages_show_list,pages_read_engagement,pages_manage_metadata,instagram_basic,instagram_content_publish,pages_manage_posts",
        }
      );
    }
  };

  const checkTokenExpiry = (expiresIn: number) => {
    if (tokenExpiryTimeout) {
      clearTimeout(tokenExpiryTimeout);
    }

    const timeout = setTimeout(() => {
      setIsTokenExpired(true);
      resetAppState();
      setIsLoggedIn(false);
      localStorage.removeItem("dataTable");
      localStorage.removeItem("instagramAccounts");
    }, expiresIn * 1000);

    setTokenExpiryTimeout(timeout);
  };

  const resetAppState = () => {
    setAccessTokenState("");
    removeAccessToken();

    setSelectedPages({
      currentFbPage: { pageId: "", pageName: "" },
      currentInstaPage: { pageId: "", pageName: "" },
    });
  };

  const loadFacebookSDK = (appId: string) => {
    return new Promise<void>((resolve, reject) => {
      if (window.FB) {
        resolve();
        return;
      }

      window.fbAsyncInit = function () {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: "v16.0",
        });
        resolve();
      };

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.onerror = () => reject(new Error("Failed to load SDK"));
      document.body.appendChild(script);
    });
  };

  return (
    <div>
      <Header left={t("social.media.management")} />
      <div className="flex flex-col mt-4 gap-3">
        <div className="xl:flex gap-2 xl:text-lg text-xs grid">
          {t("manage.your.pages.with.an.App.ID")}
          <span
            onClick={() => setOpen(true)}
            className="hover:underline hover:cursor-pointer primary2">
            {t("learn.how.to.set.it.up")}
          </span>

          <LearnHowModal
            open={open}
            onClose={() => setOpen(false)}
            onNext={() => {}}
            done={() => {}}
            type="setting"
          />
        </div>
        <div className="flex flex-col gap-3">
          <span className="primary xl:text-lg text-sm">
            {t("social.app.ID")}
          </span>
          <div className="xl:flex gap-4 xl:w-[50%] w-full grid">
            <Input
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder={t("enter.your.app.ID.social.media")}
            />
            <button
              onClick={() => handleConnect(appId)}
              className="bg-primary text-white xl:text-lg text-xs py-2 px-6 font-semibold rounded-md hover w-fit whitespace-nowrap xl:w-auto">
              {t("connect")}
            </button>
          </div>

          <div className="font-semibold xl:text-lg text-sm">
            {t("select.a.default.facebook.page")}
          </div>

          {data ? (
            <Select
              className="max-w-[290px] text-center"
              placeholder={t("select.a.page")}
              loading={isLoading}
              options={data?.data?.map((page: any) => ({
                value: page.id,
                label: page.name,
              }))}
            />
          ) : (
            <span className="text-gray-400 xl:text-base text-xs">
              {t("no.page.available")}
            </span>
          )}

          <span className="primary xl:text-lg text-sm">
            {t("business.type")}
          </span>
          <div className="xl:flex grid gap-4 xl:w-[50%] w-full">
            <Input
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder={t("enter.your.business.type")}
            />
            <button
              onClick={handleClickSave}
              className="bg-primary text-white xl:text-lg text-xs py-2 px-6 font-semibold rounded-md hover whitespace-nowrap xl:-w-full w-fit">
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
