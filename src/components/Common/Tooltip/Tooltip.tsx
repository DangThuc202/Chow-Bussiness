import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

interface CustomTooltipProps {
  title: string;
  content: string;
  key?: any;
}

const TooltipComponent = ({ title, content, key }: CustomTooltipProps) => {
  const text = (
    <div key={key} className="py-3 px-4 text-center">
      <div className="font-semibold xl:text-lg underline text-black mb-2">
        {title}
      </div>
      <div className="text-black">{content}</div>
    </div>
  );

  return (
    <Tooltip
      title={text}
      placement="top"
      color="white"
      className="hover:cursor-pointer xl:text-base text-xs">
      <InfoCircleOutlined />
    </Tooltip>
  );
};

export default TooltipComponent;
