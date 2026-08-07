"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema, EditProfileFormValues } from "../schema";
import { UserProfile } from "../types";
import { useUpdateProfileMutation } from "../api";
import { User, Mail, Phone, MapPin, FileText, Save, RefreshCw, AlertCircle } from "lucide-react";

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
      onSuccess("បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួនដោយជោគជ័យ!");
    } catch (err) {
      onError("មិនអាចរក្សាទុកការប្រែប្រួលបានទេ សូមពិនិត្យឡើងវិញ");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-google-sans flex items-center gap-2">
          <User className="h-5 w-5 text-[#003377] dark:text-[#FFC83D]" />
          កែប្រែព័ត៌មានផ្ទាល់ខ្លួន
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-google-sans">
          ធ្វើបច្ចុប្បន្នភាពឈ្មោះ អាសយដ្ឋាន អ៊ីមែល លេខទូរស័ព្ទ និងជីវប្រវត្តិរបស់អ្នក
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-google-sans">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              នាមត្រកូល <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("firstName")}
              placeholder="បញ្ចូលនាមត្រកូល..."
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
              នាមខ្លួន <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("lastName")}
              placeholder="បញ្ចូលនាមខ្លួន..."
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
            ឈ្មោះបង្ហាញ <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            {...register("displayName")}
            placeholder="បញ្ចូលឈ្មោះដែលត្រូវបង្ហាញនៅលើប្រព័ន្ធ..."
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
              អាសយដ្ឋានអ៊ីមែល <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="បញ្ចូលអាសយដ្ឋានអ៊ីមែល..."
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
              លេខទូរស័ព្ទ <span className="text-rose-500">*</span>
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
            ទីតាំងរស់នៅ ឬអាសយដ្ឋាន <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            {...register("location")}
            placeholder="រាជធានីភ្នំពេញ, កម្ពុជា..."
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
            ជីវប្រវត្តិសង្ខេប
          </label>
          <textarea
            rows={4}
            {...register("bio")}
            placeholder="សរសេរជីវប្រវត្តិសង្ខេបអំពីខ្លួនអ្នក..."
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
            កំណត់ឡើងវិញ
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
            រក្សាទុកព័ត៌មាន
          </button>
        </div>
      </form>
    </div>
  );
}
