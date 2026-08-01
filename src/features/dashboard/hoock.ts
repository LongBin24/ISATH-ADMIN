import { useState } from "react";

export function useDashboardModals() {
  const [activeModal, setActiveModal] = useState<
    "add" | "view" | "edit" | "success" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const openModal = (type: "add" | "view" | "edit" | "success", user?: any) => {
    setSelectedUser(user || null);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  return { activeModal, selectedUser, openModal, closeModal };
}
