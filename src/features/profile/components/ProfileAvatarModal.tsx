"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { useUploadAvatarMutation, useUploadAvatarFileMutation, useResetAvatarMutation } from "../api";
import { Camera, RefreshCw, Upload, Check, X } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface ProfileAvatarModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/png?seed=istashUser1&backgroundColor=003377",
  "https://api.dicebear.com/7.x/bottts/png?seed=istashUser2&backgroundColor=FFC83D",
  "https://api.dicebear.com/7.x/avataaars/png?seed=sothea1",
  "https://api.dicebear.com/7.x/avataaars/png?seed=sothea2",
  "https://api.dicebear.com/7.x/identicon/png?seed=sothea3",
  "https://api.dicebear.com/7.x/lorelei/png?seed=sothea4",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
];

async function urlToFile(url: string, filename = "avatar.png"): Promise<File | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const mimeType = blob.type || "image/png";
    const ext = mimeType.includes("jpeg") || mimeType.includes("jpg")
      ? "jpg"
      : mimeType.includes("svg")
      ? "svg"
      : "png";
    return new File([blob], filename.replace(/\.[^.]+$/, `.${ext}`), { type: mimeType });
  } catch (err) {
    console.warn("[ProfileAvatarModal] Could not fetch image as File:", err);
    return null;
  }
}

export default function ProfileAvatarModal({
  profile,
  isOpen,
  onClose,
  onSuccess,
  onError,
}: ProfileAvatarModalProps) {
  const { t } = useAdminI18n();
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile.avatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customUrl, setCustomUrl] = useState<string>("");
  const [isDefault, setIsDefault] = useState<boolean>(profile.isDefaultAvatar);

  const [uploadAvatar, { isLoading: isUploadingUrl }] = useUploadAvatarMutation();
  const [uploadAvatarFile, { isLoading: isUploadingFile }] = useUploadAvatarFileMutation();
  const [resetAvatar, { isLoading: isResetting }] = useResetAvatarMutation();
  const isUploading = isUploadingUrl || isUploadingFile;

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAvatar(profile.avatar);
      setSelectedFile(null);
      setIsDefault(profile.isDefaultAvatar);
      setCustomUrl("");
    }
  }, [isOpen, profile.avatar, profile.isDefaultAvatar]);

  if (!isOpen) return null;

  const handleSelectPreset = async (url: string) => {
    setSelectedAvatar(url);
    setIsDefault(false);
    const file = await urlToFile(url, "preset-avatar.png");
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleApplyCustomUrl = async () => {
    const trimmed = customUrl.trim();
    if (trimmed) {
      setSelectedAvatar(trimmed);
      setIsDefault(false);
      setCustomUrl("");
      const file = await urlToFile(trimmed, "custom-avatar.png");
      if (file) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(URL.createObjectURL(file));
      setSelectedFile(file);
      setIsDefault(false);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      let fileToUpload = selectedFile;
      if (!fileToUpload && selectedAvatar && !isDefault) {
        fileToUpload = await urlToFile(selectedAvatar, "avatar.png");
      }

      if (fileToUpload) {
        try {
          await uploadAvatarFile(fileToUpload).unwrap();
        } catch (fileErr) {
          console.warn("[ProfileAvatarModal] uploadAvatarFile failed, trying uploadAvatar fallback:", fileErr);
          await uploadAvatar({
            avatarUrl: selectedAvatar,
            isDefault: isDefault,
          }).unwrap();
        }
      } else {
        await uploadAvatar({
          avatarUrl: selectedAvatar,
          isDefault: isDefault,
        }).unwrap();
      }
      onSuccess(t("Avatar updated successfully."));
      onClose();
    } catch {
      onError(t("Unable to update profile photo. Please try again."));
    }
  };

  const handleResetToDefault = async () => {
    try {
      const res = await resetAvatar().unwrap();
      setSelectedAvatar(res.avatar);
      setIsDefault(true);
      onSuccess(t("Reset to default avatar successfully."));
      onClose();
    } catch {
      onError(t("Unable to reset avatar."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003377] text-[#FFC83D]">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-google-sans">
                {t("Change Profile Photo")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-google-sans">
                {t("Choose a custom photo or use default avatar.")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t("Close")}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Preview */}
        <div className="my-6 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <img
              key={selectedAvatar}
              src={selectedAvatar}
              alt={t("Avatar")}
              className="h-28 w-28 rounded-full border-4 border-[#FFC83D] object-cover shadow-md dark:border-[#003377]"
            />
            {isDefault && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#003377] px-2 py-0.5 text-xs font-semibold text-[#FFC83D] shadow">
                {t("Default Avatar")}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-google-sans">
            {t("Current photo preview")}
          </p>
        </div>

        {/* Option 1: Presets & Default Avatars */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300 font-google-sans">
            {t("Choose from Presets")}
          </label>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_AVATARS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(url)}
                aria-label={`${t("Avatar Preset")} ${idx + 1}`}
                className={`relative flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedAvatar === url
                    ? "border-[#FFC83D] bg-[#FFC83D]/10 dark:border-[#FFC83D]"
                    : "border-slate-200 hover:border-[#003377] dark:border-slate-700"
                }`}
              >
                <img
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  className="h-10 w-10 rounded-full object-cover"
                />
                {selectedAvatar === url && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#003377] text-[#FFC83D]">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Option 2: Upload File / Custom URL */}
        <div className="mb-6 space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 font-google-sans">
            {t("Upload Photo")}
          </label>
          <div className="flex items-center gap-3">
            <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:border-[#003377] hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800 font-google-sans">
              <Upload className="h-4 w-4 text-[#003377] dark:text-[#FFC83D]" />
              {t("Select from computer")}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder={t("Or enter image URL...")}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800 dark:bg-slate-950 dark:text-white font-google-sans"
            />
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="rounded-xl bg-[#003377] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#002255] font-google-sans"
            >
              {t("Apply")}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isResetting}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 font-google-sans disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
            {t("Use Default Avatar")}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-google-sans"
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              onClick={handleSaveAvatar}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-xl bg-[#FFC83D] px-5 py-2 text-xs font-bold text-[#003377] shadow hover:bg-[#f0ba33] transition font-google-sans disabled:opacity-50"
            >
              {isUploading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4 stroke-[3]" />
              )}
              {t("Save Changes")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
