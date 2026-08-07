import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationCategory, NotificationItem } from "./types";

interface NotificationState {
  activeTab: "in-app" | "email-preview" | "preferences" | "trigger";
  selectedCategoryFilter: string; // "ALL" or NotificationCategory
  searchQuery: string;
  selectedNotification: NotificationItem | null;
  isDetailModalOpen: boolean;
  isTriggerModalOpen: boolean;
  emailPreviewCategory: NotificationCategory;
}

const initialState: NotificationState = {
  activeTab: "in-app",
  selectedCategoryFilter: "ALL",
  searchQuery: "",
  selectedNotification: null,
  isDetailModalOpen: false,
  isTriggerModalOpen: false,
  emailPreviewCategory: "DAILY_EXPENSE",
};

export const notificationSlice = createSlice({
  name: "notificationsUI",
  initialState,
  reducers: {
    setActiveTab: (
      state,
      action: PayloadAction<"in-app" | "email-preview" | "preferences" | "trigger">
    ) => {
      state.activeTab = action.payload;
    },
    setSelectedCategoryFilter: (state, action: PayloadAction<string>) => {
      state.selectedCategoryFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedNotification: (state, action: PayloadAction<NotificationItem | null>) => {
      state.selectedNotification = action.payload;
      state.isDetailModalOpen = !!action.payload;
    },
    closeDetailModal: (state) => {
      state.isDetailModalOpen = false;
      state.selectedNotification = null;
    },
    setIsTriggerModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isTriggerModalOpen = action.payload;
    },
    setEmailPreviewCategory: (state, action: PayloadAction<NotificationCategory>) => {
      state.emailPreviewCategory = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setSelectedCategoryFilter,
  setSearchQuery,
  setSelectedNotification,
  closeDetailModal,
  setIsTriggerModalOpen,
  setEmailPreviewCategory,
} = notificationSlice.actions;

export default notificationSlice.reducer;
