import { useEffect, useRef, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import {
  LinkOutlined,
  OpenAIOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  VerticalRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { logo, vi, en } from "@/assets/SideBar";
import { useLanguage } from "@/contexts/LanguagesContext";
import TooltipComponent from "../Common/Tooltip/Tooltip";

const SideBar = () => {
  const { t } = useTranslation();
  const { selectedLanguage, changeLanguage } = useLanguage();

  const [isCollapsedSidebar, setIsCollapsedSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [selectedKey, setSelectedKey] = useState<string>("");

  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    {
      key: "item1",
      icon: (
        <div className="flex gap-1 relative group">
          <span
            className={`text-white z-10 ${
              isCollapsedSidebar && !isMobile
                ? "hidden"
                : "opacity-0 group-hover:opacity-100"
            }`}>
            <TooltipComponent
              title={t("manage.AI.content")}
              content={t("manage.AI.content.content")}
            />
          </span>
          <OpenAIOutlined style={{ fontSize: "24px" }} />
        </div>
      ),
      label: <Link to="/ai_content_creation">{t("ai.content")}</Link>,
    },
    {
      key: "item2",
      icon: (
        <div className="flex gap-1.5 relative group">
          <span
            className={`text-white z-10 ${
              isCollapsedSidebar && !isMobile
                ? "hidden"
                : "opacity-0 group-hover:opacity-100"
            }`}>
            <TooltipComponent
              title={t("manage.social.media")}
              content={t("manage.social.media.content")}
            />
          </span>
          <UsergroupAddOutlined style={{ fontSize: "24px" }} />
        </div>
      ),
      label: t("social.media"),
      children: [
        {
          key: "item2-1",
          label: (
            <Link to="/social-media/social-media-manager">
              {t("media.management")}
            </Link>
          ),
        },
        {
          key: "item2-2",
          label: (
            <Link to="/social-media/social-post-scheduler">
              {t("post.schedule")}
            </Link>
          ),
        },
      ],
    },
    {
      key: "item3",
      icon: (
        <div className="flex gap-1.5 relative group">
          <span
            className={`text-white z-10 ${
              isCollapsedSidebar && !isMobile
                ? "hidden"
                : "opacity-0 group-hover:opacity-100"
            }`}>
            <TooltipComponent
              title={t("manage.traffic.grow.center")}
              content={t("manage.social.media.content")}
            />
          </span>
          <LinkOutlined style={{ fontSize: "24px" }} />
        </div>
      ),
      label: <Link to="/affiliate_management">{t("traffic.grow.center")}</Link>,
    },
    {
      key: "item4",
      icon: (
        <div className="flex gap-1.5 relative group">
          <span
            className={`text-white z-10 ${
              isCollapsedSidebar && !isMobile
                ? "hidden"
                : "opacity-0 group-hover:opacity-100"
            }`}>
            <TooltipComponent
              title={t("what.a.beautiful.day")}
              content={t("what.a.beautiful.day.content")}
            />
          </span>
          <SettingOutlined style={{ fontSize: "24px" }} />
        </div>
      ),
      label: <Link to="/setting">{t("setting")}</Link>,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobile &&
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isMobileOpen]);

  return (
    <>
      {/* Button nhỏ ở mobile khi sidebar đang đóng */}
      {isMobile && !isMobileOpen && (
        <button
          className="fixed top-0 left-0 z-20 bg-orange-500 text-white p-1 rounded-br-md shadow-md"
          onClick={() => setIsMobileOpen(true)}>
          <VerticalRightOutlined className="rotate-180" />
        </button>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full z-30 bg-custom-sidebar shadow-2xl rounded-r-md
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? isMobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "relative translate-x-0"
          }
          ${isCollapsedSidebar && !isMobile ? "w-[90px]" : "w-[230px]"}
          flex flex-col items-center px-2
        `}>
        {/* Nút thu gọn/mở rộng chỉ hiển thị ở desktop hoặc khi sidebar đang mở (mobile) */}
        <span className="size-6 text-white mt-3 text-end w-full">
          <VerticalRightOutlined
            className={`text-xl hover:cursor-pointer transition-transform duration-300 ${
              isCollapsedSidebar && !isMobile ? "rotate-180" : ""
            }`}
            onClick={() => {
              if (isMobile) {
                setIsMobileOpen(false); // Đóng sidebar ở mobile
              } else {
                setIsCollapsedSidebar((prev) => !prev); // Toggle ở desktop
              }
            }}
          />
        </span>

        {/* Logo */}
        {!isCollapsedSidebar && (
          <div className="w-full h-1/8 flex justify-center items-end">
            <img
              className="w-[80%] h-auto object-cover"
              src={logo}
              alt="Logo"
            />
          </div>
        )}

        {/* Menu */}
        <Menu
          className="custom-menu"
          style={{
            border: "none",
            backgroundColor: "#FE881C",
            marginTop: "40px",
          }}
          selectedKeys={[selectedKey]} // Dùng selectedKeys để xác định item nào đang chọn
          defaultOpenKeys={["item1"]}
          mode="inline"
          inlineCollapsed={isCollapsedSidebar && !isMobile}
          items={items}
          onClick={(e) => {
            setSelectedKey(e.key); // Cập nhật key khi click
            if (isMobile) setIsMobileOpen(false); // Đóng sidebar nếu đang ở chế độ mobile
          }}
        />

        {/* Ngôn ngữ */}
        <div className="absolute w-full text-center px-3 bottom-5">
          <div className="relative">
            <button
              className="py-3 px-6 text-white w-full font-medium hover:cursor-pointer hover:bg-white/20 text-center"
              onClick={() => setShowDropdown(!showDropdown)}>
              <span className="flex justify-center items-center gap-2">
                <img
                  src={selectedLanguage === "en" ? en : vi}
                  className="size-5"
                  alt="Lang"
                />
                {!isCollapsedSidebar && (
                  <span>
                    {selectedLanguage === "en" ? "English" : "Tiếng Việt"}
                  </span>
                )}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-md shadow-lg z-50">
                <div
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-left flex items-center gap-2"
                  onClick={() => {
                    changeLanguage("en");
                    setShowDropdown(false);
                  }}>
                  <img src={en} className="size-5" />
                  English
                </div>
                <div
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-left flex items-center gap-2"
                  onClick={() => {
                    changeLanguage("vi");
                    setShowDropdown(false);
                  }}>
                  <img src={vi} className="size-5" />
                  Tiếng Việt
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
