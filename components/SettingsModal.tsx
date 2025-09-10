"use client";

import { useSettingsModal } from "@/store/useSettingsModal";
import Modal from "./Modal";

const SettingsModal = () => {
  const { isOpen, onClose } = useSettingsModal();

  return (
    <Modal
      title="App Settings"
      description="Manage Application settings"
      isOpen={isOpen}
      handleChange={(open) => !open && onClose()}
    ></Modal>
  );
};

export default SettingsModal;
