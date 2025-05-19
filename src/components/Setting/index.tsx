import React, { useState, useEffect, useRef } from "react";
import Header from "../Common/Header/Header";
import { useTranslation } from "react-i18next";
import { Input, Radio, Select } from "antd";
import toast from "react-hot-toast";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/auth/handleCookies";
import LearnHowModal from "../Common/Modal/LearnHowModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchFBPage } from "@/services/FB-Service";
import { vi, en } from "@/assets/SideBar";
import { fetchLinkedInAccessToken } from "@/services/LI-Service";
import { useLanguage } from "@/contexts/LanguagesContext";

const { Option } = Select;

const Setting = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const { selectedLanguage, changeLanguage } = useLanguage();
  const [appId, setAppId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popup, setPopup] = useState<Window | null>(null);
  const [stateValue, setStateValue] = useState("");
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [isOpenPopupContinueScheduling, setIsOpenPopupContinueScheduling] =
    useState(false);
  const [tokenExpiryTimeout, setTokenExpiryTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [accessToken, setAccessTokenState] = useState<string>(
    getAccessToken() || ""
  );

  // const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
  // const clientSecret = "WPL_AP1.SBQXS1iIi99EtpLP.KULfJQ==";

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
    enabled: !!accessToken,
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

  useEffect(() => {
    const existing = sessionStorage.getItem("linkedin_state");
    if (existing) {
      setStateValue(existing);
    } else {
      const generated = crypto.randomUUID();
      sessionStorage.setItem("linkedin_state", generated);
      setStateValue(generated);
    }
  }, []);

  const handleConnectLinkedIn = () => {
    const state = sessionStorage.getItem("linkedin_state");
    const linkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=http://localhost:5173/setting&scope=openid%20profile%20w_member_social%20email&state=${state}`;
    const newPopup = window.open(linkedInUrl, "_blank", "width=600,height=600");
    setPopup(newPopup);
  };

  const connectLinkedInMutate = useMutation({
    mutationFn: (payload: {
      code: string;
      redirect_uri: string;
      client_id: string;
      client_secret: string;
    }) => fetchLinkedInAccessToken(payload),
    onSuccess: (data) => {
      const accessToken = data?.access_token;
      if (accessToken) {
        localStorage.setItem("linkedin_access_token", accessToken);
        toast.success(t("login.successful"));
      }
    },
    onError: (e) => {
      console.log(e);
      toast.error(t("login.failed"));
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const storedState = sessionStorage.getItem("linkedin_state");

    if (code && state === storedState) {
      if (window.opener) {
        window.opener.postMessage(
          { type: "LINKEDIN_AUTH", code, state },
          window.origin
        );
        window.close();
      }

      connectLinkedInMutate.mutate({
        code,
        redirect_uri: `http://localhost:5173/setting`,
        client_id: clientId,
        client_secret: clientSecret,
      });
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (clientId) {
        if (event.origin !== window.origin) return;

        const { type, code } = event.data;

        if (type === "LINKEDIN_AUTH" && code) {
          connectLinkedInMutate.mutate({
            code,
            redirect_uri: "http://localhost:5173/setting",
            client_id: clientId,
            client_secret: clientSecret,
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [clientId, clientSecret]);

  const token = localStorage.getItem("linkedin_access_token");

  // const { data: userinfo } = useQuery({
  //   queryKey: ["userInfo", token],
  //   queryFn: () => getInfoUser(token as string),
  //   enabled: !!token,
  // });

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
            {t("Facebook App ID")}
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

          <span className="primary xl:text-lg text-sm">
            {t("LinkedIn Client ID")}
          </span>
          <div className="xl:flex gap-4 xl:w-[50%] w-full grid">
            <Input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder={t("Client ID")}
            />

            <Input.Password
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder={t("Client Secret")}
            />

            <button
              onClick={handleConnectLinkedIn}
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
              placeholder={t("please.enter.business.type")}
            />
            <button
              onClick={handleClickSave}
              className="bg-primary text-white xl:text-lg text-xs py-2 px-6 font-semibold rounded-md hover w-fit whitespace-nowrap xl:w-auto">
              {t("save")}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Select
          value={selectedLanguage}
          onChange={changeLanguage}
          className="custom-select w-32 text-center"
          optionLabelProp="label">
          <Option value="en" label="English">
            <span className="flex items-center gap-2">
              <img src={en} className="size-5" alt="EN" />
              <span>English</span>
            </span>
          </Option>
          <Option value="vi" label="Tiếng Việt">
            <span className="flex items-center gap-2">
              <img src={vi} className="size-5" alt="VI" />
              <span>Tiếng Việt</span>
            </span>
          </Option>
        </Select>
      </div>
    </div>
  );
};

export default Setting;
