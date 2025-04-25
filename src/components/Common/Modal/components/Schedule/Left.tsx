import { useState } from "react";
import { useTranslation } from "react-i18next";
import img from "@/assets/PostSchedule/default_Image.jpg";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Form from "./Form";

const Left = () => {
  const storedData = localStorage.getItem("postData");
  const postData = storedData ? JSON.parse(storedData) : null;
  const { t } = useTranslation();

  const posts = postData?.social_posts || [];
  const [startIndex, setStartIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const visibleCount = 3;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - visibleCount));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(posts.length - visibleCount, prev + visibleCount)
    );
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  return (
    <div className="relative w-full flex flex-col gap-4 items-center">
      {showForm ? (
        <div className="w-full">
          <Form platform="Facebook" content={posts} />
        </div>
      ) : (
        <>
          <div className="primary xl:text-xl text-sm">{t("select.a.post")}</div>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="p-2 disabled:opacity-10 disabled:cursor-not-allowed cursor-pointer xl:text-4xl text-sm">
              <LeftOutlined />
            </button>

            {postData ? (
              <div className="overflow-hidden max-w-3xl">
                <div
                  className="flex transition-all duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      (startIndex / posts.length) * 100
                    }%)`,
                    width: `${(posts.length / visibleCount) * 100}%`,
                  }}>
                  {posts.map((post: string, index: number) => (
                    <div
                      key={index}
                      onClick={handleShowForm}
                      className="rounded-xl hover xl:p-4 p-2 shadow w-full max-w-sm flex-shrink-0 transition-all duration-300 hover:-translate-y-1"
                      style={{
                        width: `${100 / posts.length}%`,
                        paddingLeft: "0.5rem", // 1 = 0.25rem
                        paddingRight: "0.5rem",
                      }}>
                      <img src={img} className="xl:h-[60%] w-full h-[40%]" />
                      <p className="line-clamp-2 xl:text-sm text-[10px] text-gray-800 mt-5">
                        {post}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                        }}
                        className="text-blue-500 mt-2 xl:text-sm text-[10px] hover:underline hover">
                        Xem thêm
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <span>{t("no.post")}</span>
                <a
                  href="/ai_content_creation"
                  className="underline text-blue-500">
                  {t("create.now")}
                </a>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={startIndex + visibleCount >= posts.length}
              className="p-2 disabled:opacity-10 disabled:cursor-not-allowed cursor-pointer xl:text-4xl text-sm">
              <RightOutlined />
            </button>
          </div>

          {selectedPost && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
              <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {selectedPost}
                </p>
                <div className="text-right mt-4">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover">
                    {t("done")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Left;
