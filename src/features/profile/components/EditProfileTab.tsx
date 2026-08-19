"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema, EditProfileFormValues } from "../schema";
import { UserProfile } from "../types";
import { useUpdateProfileMutation } from "../api";
import { User, Mail, Phone, MapPin, FileText, Save, RefreshCw, AlertCircle } from "lucide-react";
<<<<<<< HEAD
import { useAdminI18n } from "@/i18n/admin-i18n";
=======
import { useI18n } from "@/hooks/use-i18n";
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

interface EditProfileTabProps {
  profile: UserProfile;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function EditProfileTab({
  profile,
  onSuccess,
  onError,
}: EditProfileTabProps) {
<<<<<<< HEAD
  const { t } = useAdminI18n();
=======
  const { dict, isEnglish } = useI18n();
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      bio: profile.bio,
      location: profile.location,
    },
  });

  useEffect(() => {
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      bio: profile.bio,
      location: profile.location,
    });
  }, [profile, reset]);

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      await updateProfile(values).unwrap();
<<<<<<< HEAD
      onSuccess(t("Profile updated successfully."));
    } catch {
      onError(t("Unable to save profile changes. Please try again."));
=======
      onSuccess(dict.profile.updateSuccess);
    } catch (err) {
      onError(dict.profile.updateError);
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 font-google-sans">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-[#003377] dark:text-[#FFC83D]" />
<<<<<<< HEAD
          {t("Edit Profile")}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-google-sans">
          {t("Update your personal identity, contact details, and biography.")}
=======
          {dict.profile.editTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {dict.profile.editSubtitle}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
<<<<<<< HEAD
              {t("First Name")} <span className="text-rose-500">*</span>
=======
              {dict.profile.firstName} <span className="text-rose-500">*</span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            </label>
            <input
              type="text"
              {...register("firstName")}
<<<<<<< HEAD
              placeholder={t("Enter first name")}
=======
              placeholder={isEnglish ? "Enter first name..." : "បញ្ចូលនាមត្រកូល..."}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
                errors.firstName
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
<<<<<<< HEAD
              {t("Last Name")} <span className="text-rose-500">*</span>
=======
              {dict.profile.lastName} <span className="text-rose-500">*</span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            </label>
            <input
              type="text"
              {...register("lastName")}
<<<<<<< HEAD
              placeholder={t("Enter last name")}
=======
              placeholder={isEnglish ? "Enter last name..." : "បញ្ចូលនាមខ្លួន..."}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
                errors.lastName
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
<<<<<<< HEAD
            {t("Display Name")} <span className="text-rose-500">*</span>
=======
            {dict.profile.displayName} <span className="text-rose-500">*</span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          </label>
          <input
            type="text"
            {...register("displayName")}
<<<<<<< HEAD
            placeholder={t("Enter display name")}
=======
            placeholder={isEnglish ? "Enter display name..." : "បញ្ចូលឈ្មោះដែលត្រូវបង្ហាញនៅលើប្រព័ន្ធ..."}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
              errors.displayName
                ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
            }`}
          />
          {errors.displayName && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.displayName.message}
            </p>
          )}
        </div>

        {/* Email & Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
<<<<<<< HEAD
              {t("Email Address")} <span className="text-rose-500">*</span>
=======
              {dict.profile.email} <span className="text-rose-500">*</span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            </label>
            <input
              type="email"
              {...register("email")}
<<<<<<< HEAD
              placeholder={t("Enter email address")}
=======
              placeholder={isEnglish ? "Enter email address..." : "បញ្ចូលអាសយដ្ឋានអ៊ីមែល..."}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
                errors.email
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
<<<<<<< HEAD
              {t("Phone Number")} <span className="text-rose-500">*</span>
=======
              {dict.profile.phoneNumber} <span className="text-rose-500">*</span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            </label>
            <input
              type="text"
              {...register("phoneNumber")}
              placeholder="012 345 678"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
                errors.phoneNumber
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
<<<<<<< HEAD
            {t("Location")} <span className="text-rose-500">*</span>
=======
            {dict.profile.location} <span className="text-rose-500">*</span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          </label>
          <input
            type="text"
            {...register("location")}
<<<<<<< HEAD
            placeholder="Phnom Penh, Cambodia"
=======
            placeholder={isEnglish ? "e.g. Phnom Penh, Cambodia" : "រាជធានីភ្នំពេញ, កម្ពុជា..."}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
              errors.location
                ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
            }`}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
<<<<<<< HEAD
            {t("Biography")}
=======
            {dict.profile.bio}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          </label>
          <textarea
            rows={4}
            {...register("bio")}
<<<<<<< HEAD
            placeholder={t("Tell us a little bit about yourself...")}
=======
            placeholder={dict.profile.bioPlaceholder}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
              errors.bio
                ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
            }`}
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty || isLoading}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50"
          >
<<<<<<< HEAD
            {t("Reset")}
=======
            {dict.common.refresh}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-[#FFC83D] px-6 py-2.5 text-xs font-bold text-[#003377] shadow hover:bg-[#f0ba33] transition disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
<<<<<<< HEAD
            {t("Save Changes")}
=======
            {isLoading ? dict.profile.saving : dict.profile.saveChanges}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          </button>
        </div>
      </form>
    </div>
  );
}
