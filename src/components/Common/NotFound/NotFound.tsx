import { Button, Result } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t("404.mess")}
      extra={
        <Button onClick={() => navigate(-1)} type="primary">
          {t("back")}
        </Button>
      }
    />
  );
};

export default NotFound;
