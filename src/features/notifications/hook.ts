import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  setActiveTab,
  setSelectedCategoryFilter,
  setSearchQuery,
  setSelectedNotification,
  closeDetailModal,
  setIsTriggerModalOpen,
  setEmailPreviewCategory,
} from "./slice";
import { NotificationItem, NotificationCategory } from "./types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useNotificationUI() {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.notificationsUI);

  return {
    ...uiState,
    changeTab: (tab: "in-app" | "email-preview" | "preferences" | "trigger") =>
      dispatch(setActiveTab(tab)),
    changeCategoryFilter: (cat: string) => dispatch(setSelectedCategoryFilter(cat)),
    changeSearchQuery: (query: string) => dispatch(setSearchQuery(query)),
    selectNotification: (notif: NotificationItem | null) =>
      dispatch(setSelectedNotification(notif)),
    dismissDetailModal: () => dispatch(closeDetailModal()),
    toggleTriggerModal: (isOpen: boolean) => dispatch(setIsTriggerModalOpen(isOpen)),
    changeEmailPreviewCategory: (cat: NotificationCategory) =>
      dispatch(setEmailPreviewCategory(cat)),
  };
}
