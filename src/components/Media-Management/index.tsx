import { useTranslation } from "react-i18next";
import Header from "../Common/Header/Header";
import ModalBeforeLogin from "../Common/Modal/ModalBeforeLogin";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/auth/handleCookies";
import { Button, Divider, Input, Modal, Table, TableProps } from "antd";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchFBPage, fetchPagePosts } from "@/services/FB-Service";
import FB from "@/assets/PostSchedule/iconFacebook.svg";
import IN from "@/assets/PostSchedule/iconInstagram.svg";

interface DataType {
  no: string;
  content: string;
  tag: any;
  url: string;
}

const MediaManagement = () => {
  const { t } = useTranslation();
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showModalABC, setShowModalABC] = useState(false);
  const [showBlogInput, setShowBlogInput] = useState(false);
  const [selectedPageDetail, setSelectedPageDetail] = useState<any>(null);
  const [currentItemKey, setCurrentItemKey] = useState<string | null>(null); // Thêm state để theo dõi item đang chọn
  const [viewContentModal, setViewContentModal] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [accessToken, setAccessTokenState] = useState<string>(
    () => getAccessToken() || ""
  );

  // Fetch danh sách page
  const { data: pages } = useQuery({
    queryKey: ["fb-pages", accessToken],
    queryFn: () => fetchFBPage(accessToken!),
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  });

  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery({
    queryKey: ["page-posts", selectedPageDetail?.id],
    queryFn: async () => {
      if (!selectedPageDetail?.accessToken || !selectedPageDetail?.id) {
        return []; // Trả về mảng rỗng nếu thiếu dữ liệu
      }
      const result = await fetchPagePosts(
        selectedPageDetail?.accessToken,
        selectedPageDetail?.id
      );
      return result;
    },
    enabled: !!selectedPageDetail?.id && !!selectedPageDetail?.accessToken, // Chỉ gọi khi cả pageId và accessToken có giá trị
    refetchOnWindowFocus: false,
  });

  // Check login
  useEffect(() => {
    if (!accessToken) {
      setShowModalLogin(true);
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: (
        <span className="xl:text-base text-xs flex justify-center">
          {t("no.")}
        </span>
      ),
      dataIndex: "no",
      key: "no",
      render: (text) => <span className="flex justify-center">{text}</span>,
      width: "10%",
    },
    {
      title: (
        <span className="xl:text-base text-xs flex justify-center text-center">
          {t("content")}
        </span>
      ),
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <span
          className="text-blue-500 underline cursor-pointer xl:text-base text-xs flex justify-center"
          onClick={() => {
            setModalContent(text);
            setViewContentModal(true);
          }}>
          {t("view")}
        </span>
      ),
      width: "20%",
    },
    {
      title: (
        <span className="xl:text-base text-xs flex justify-center">Tag</span>
      ),
      dataIndex: "tag",
      key: "tag",
      render: (text) => (
        <span className="flex justify-center">
          {text === "Facebook" ? (
            <img className="xl:size-10 size-5" src={FB} />
          ) : (
            <img className="xl:size-10 size-5" src={IN} />
          )}
        </span>
      ),
      width: "20%",
    },
    {
      title: (
        <span className="xl:text-base text-xs text-center flex justify-center">
          URL
        </span>
      ),
      dataIndex: "url",
      key: "url",
      render: (text) => (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 !underline cursor-pointer xl:text-base text-xs flex justify-center">
          {isMobile ? "URL" : text}
        </a>
      ),
    },
  ];

  const items = [
    { title: t("fb.page"), content: t("select.page.fb"), key: "fb-page" },
    { title: t("in.page"), content: t("select.page.in"), key: "in-page" },
    { title: "Blog URL", content: t("input.url.blog"), key: "blog" },
  ];

  const handleViewPageDetail = (page: any) => {
    setSelectedPageDetail({
      id: page.id,
      accessToken: page.access_token, // Giả sử page.access_token chứa Page Access Token
    });
    setShowModalABC(false); // Ẩn modal chọn page
  };

  const handleClick = (key: string) => {
    setCurrentItemKey(key); // Lưu key của item đang chọn
    if (key === "blog") {
      setShowBlogInput(true);
      setShowModalABC(false);
    } else {
      setShowBlogInput(false);
      setShowModalABC(true);
    }
  };

  const handleClick2 = () => {
    toast.error(`${t("this.feature.is.under.development")} ⏳`);
    setShowBlogInput(false);
  };

  return (
    <div>
      <Header left={t("get.list.post.social.media")} />

      <div className="mt-4">
        {items.map((items, index) => (
          <div className="flex gap-1 mb-2" key={index}>
            <div className="xl:w-40 w-30 font-bold xl:text-lg text-xs">
              {items.title}
            </div>

            {isLogin && (
              <div
                className="flex-1 xl:text-lg text-xs text-gray-400 underline cursor-pointer"
                onClick={() => handleClick(items.key)}>
                {items.content}
              </div>
            )}
          </div>
        ))}

        {/* Input Blog URL */}
        {showBlogInput && (
          <Modal
            open={showBlogInput}
            title="Blog URL"
            onCancel={() => setShowBlogInput(false)}
            footer={null}>
            <Input />
            <Button
              type="primary"
              className="w-full mt-4"
              onClick={handleClick2}>
              {t("submit")}
            </Button>
          </Modal>
        )}
      </div>

      {/* Modal login nếu chưa login */}
      <ModalBeforeLogin
        open={showModalLogin}
        onClose={() => setShowModalLogin(false)}
      />

      {/* Modal chọn page */}
      {showModalABC && currentItemKey !== "blog" && (
        <Modal
          open={showModalABC}
          title={t("select.page")}
          onCancel={() => {
            setShowModalABC(false);
            setSelectedPageDetail(null);
          }}
          footer={null}>
          {pages?.data.map((page: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="xl:text-lg text-xs font-bold">
                    {page.name}
                  </div>
                  <div className="xl:text-sm text-xs">ID: {page.id}</div>
                </div>
                <button
                  onClick={() => handleViewPageDetail(page)}
                  className="xl:px-4 xl:py-2 py-1 px-2 xl:text-base text-xs bg-transparent border-2 border-[#009951] text-[#009951] rounded-md hover:bg-[#009951] hover:text-white transition-all duration-300 ease-in-out hover">
                  {t("view")}
                </button>
              </div>
              <Divider />
            </div>
          ))}
        </Modal>
      )}

      {/* Hiển thị post nếu đã chọn page */}
      {selectedPageDetail && (
        <div className="mt-10">
          <div className="font-bold xl:text-lg text-sm mb-4">
            {t("posts.detail")}
          </div>
          <Table<DataType>
            loading={postsLoading}
            columns={columns}
            dataSource={
              posts?.map((item: any, index: number) => ({
                no: `${index + 1}`,
                content: item.content,
                tag: item.tag,
                url: item.url,
              })) ?? []
            }
            rowKey="url"
          />
        </div>
      )}

      <Modal
        open={viewContentModal}
        title="Content"
        onCancel={() => {
          setViewContentModal(false);
          setModalContent(null);
        }}
        footer={null}>
        <div
          style={{ maxHeight: 400, overflowY: "auto", whiteSpace: "pre-line" }}>
          {modalContent}
        </div>
      </Modal>
    </div>
  );
};

export default MediaManagement;
