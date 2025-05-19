import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Form, Input, Modal } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type LoginFormProps = {
  open: boolean;
  onClose: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { signInAuth, signUpAuth } = useAuth();

  const [isSignIn, setIsSignIn] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (data: any) => {
    const { email, password } = data;
    try {
      await signUpAuth(email, password);
      toast.success(t("signup.successfully"));
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error(t("signup.failed"));
    }
  };

  const handleSignIn = async (values: any) => {
    const { email, password } = values;
    try {
      await signInAuth(email, password);
      toast.success(t("signin.successfully"));
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error(t("signin.failed"));
    }
  };

  return (
    <Modal
      className=""
      title={
        <div className="text-xl text-center font-bold">
          {isSignIn === "signin" ? t("signin") : t("signup")}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose>
      {isSignIn === "signin" ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignIn}
          initialValues={{ email, password }}
          className="mt-7 flex flex-col gap-4">
          <Form.Item
            label={t("input.your.email")}
            name="email"
            rules={[
              { required: true, message: t("input.email.required") },
              { type: "email", message: t("input.email.invalid") },
            ]}>
            <Input
              size="large"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label={t("input.your.password")}
            name="password"
            rules={[{ required: true, message: t("input.password.required") }]}>
            <Input.Password
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <div
            className="whitespace-pre-line text-center"
            onClick={() => setIsSignIn("signup")}>
            {t("no.account")}
            <div className="text-blue-400 hover">{t("signup.now")}</div>
          </div>

          <Form.Item>
            <button className="bg-primary w-full py-2 text-white font-semibold">
              {t("signin")}
            </button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignUp}
          className="mt-7 flex flex-col gap-4">
          <Form.Item
            hasFeedback
            label={t("input.your.email")}
            name="email"
            rules={[{ type: "email" }]}>
            <Input size="large" />
          </Form.Item>

          <Form.Item
            hasFeedback
            label={t("input.your.password")}
            name="password"
            rules={[{ required: true, message: t("input.password.required") }]}>
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <button className="bg-primary w-full py-2 text-white font-semibold">
              {t("signup")}
            </button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default LoginForm;
