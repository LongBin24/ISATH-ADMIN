import { UserProfile } from "@/features/profile/types";

export let mockProfileState: UserProfile = {
  id: "884920",
  keycloakUserId: "884920",
  username: "sothea_dev",
  firstName: "សូធា",
  lastName: "ចាន់",
  displayName: "ចាន់ សូធា",
  email: "sothea.chan@istash.kh",
  emailVerified: true,
  phoneNumber: "012 889 977",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  isDefaultAvatar: false,
  bio: "អ្នកអភិវឌ្ឍន៍កម្មវិធីជាន់ខ្ពស់នៅ អាយស្តាស កម្ពុជា។ មានបទពិសោធន៍លើការបង្កើតកម្មវិធីបណ្តាញប្រព័ន្ធ និងរចនារូបរាងប្រព័ន្ធប្រកបដោយប្រសិទ្ធភាព។",
  role: "អ្នកគ្រប់គ្រងប្រព័ន្ធ",
  department: "នាយកដ្ឋានបច្ចេកវិទ្យាព័ត៌មាន",
  location: "រាជធានីភ្នំពេញ, កម្ពុជា",
  joinDate: "១៥ មករា ២០២៣",
  lastActive: "កំពុងដំណើរការ",
  status: "active",
  preferredCurrency: "KHR",
  notifications: {
    email: true,
    push: true,
    securityAlerts: true,
    productUpdates: false,
    weeklyReport: true,
    sound: true,
  },
  dateOfBirth: "",
  gender: "",
  occupation: "",
  addressLine1: "",
  addressLine2: "",
  stateProvince: "",
  postalCode: "",
  countryCode: "KH",
  profileCompleted: true,
  onboardingCompleted: true,
  termsAcceptedAt: "",
  privacyPolicyAcceptedAt: "",
  updatedAt: "",
  deletedAt: "",
  languageCode: "km",
  timezone: "Asia/Phnom_Penh",
  theme: "LIGHT",
};

export const updateMockProfile = (partial: Partial<UserProfile>) => {
  mockProfileState = {
    ...mockProfileState,
    ...partial,
  };
  return mockProfileState;
};
