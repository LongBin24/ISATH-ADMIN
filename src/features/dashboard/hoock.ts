import { useState } from "react";

export function useDashboardModals() {
  const [activeModal, setActiveModal] = useState<
    "add" | "view" | "edit" | "success" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);

  const openModal = (
    type: "add" | "view" | "edit" | "success",
    user?: Record<string, unknown> | null
  ) => {
    setSelectedUser(user || null);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  return { activeModal, selectedUser, openModal, closeModal };
}
