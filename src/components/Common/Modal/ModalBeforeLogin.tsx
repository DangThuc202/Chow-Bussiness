import { Modal, Button } from "antd";
import { useTranslation } from "react-i18next";

const ModalBeforeLogin = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      footer={null}
      closable={true} // <-- cho phép hiển thị nút X
      onCancel={onClose} // <-- xử lý khi bấm X
    >
      <div className="text-center">
        <p className="xl:text-lg text-sm font-semibold mb-4">
          {t("please.login")}
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-primary  px-5 py-3 rounded-md">
            <a
              href="/setting"
              className="!text-white font-semibold xl:text-base text-xs">
              {t("login.now")}
            </a>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalBeforeLogin;
