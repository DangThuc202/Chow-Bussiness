import React from "react";
import { Modal } from "antd";

interface CustomModalProps {
  open: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  onCancel: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  content,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      footer={null}
      className="text-center">
      {content}
    </Modal>
  );
};

export default CustomModal;
