import { useState } from "react";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/services/BE-Service";

const Profile = () => {
  const { t } = useTranslation();

  const { userEmail } = useAuth();

  const [displayName, setDisplayName] = useState(
    userEmail?.displayName || name || ""
  );

  const updateMutate = useMutation({
    mutationFn: async (data: any) => {
      const token = await userEmail?.getIdToken();
      if (!token) {
        throw new Error("Token is missing");
      }
      return updateProfile(data, token); // Chắc chắn token là một string hợp lệ
    },
    onSuccess: () => {
      toast.success("update.successfully");
    },
    onError: (e) => {
      console.log(e);
      toast.error("update.failed");
    },
  });

  const handleUpdate = (e: any) => {
    e.preventDefault(); // chặn reload trang
    const formData = {
      display_name: displayName,
      // các field khác
    };

    updateMutate.mutate(formData); // ✅ truyền đúng dữ liệu
  };

  return (
    <div>
      <img
        className="size-50 mt-5 rounded-full"
        src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-ngay-moi-hanh-phuc-sieu-cute-inkythuatso-09-13-35-50.jpg"
      />

      <div className="w-[30%] flex flex-col gap-4 mt-5">
        <Input
          size="large"
          value={userEmail?.email || ""}
          disabled
          prefix={<MailOutlined />}
        />
        <Input
          size="large"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName || name || ""}
          prefix={<UserOutlined />}
        />
      </div>
      <Button
        onClick={handleUpdate}
        color="cyan"
        variant="solid"
        className="mt-5">
        {t("save")}
      </Button>
    </div>
  );
};

export default Profile;
