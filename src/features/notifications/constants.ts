import {
  NotificationCategoryConfig,
  UserNotificationPreferences,
} from "./types";

export const CATEGORY_CONFIGS: Record<string, NotificationCategoryConfig> = {
  DAILY_EXPENSE: {
    id: "DAILY_EXPENSE",
    nameKh: "ការរំលឹកការចំណាយប្រចាំថ្ងៃ",
    nameEn: "Daily Expense Reminder",
    descriptionKh: "ផ្ញើសាររំលឹកជាប្រចាំថ្ងៃដើម្បីឱ្យអ្នកកត់ត្រាការចំណាយទាន់ពេលវេលា",
    descriptionEn: "Automated daily reminder to log your daily financial transactions",
    iconName: "Wallet",
    defaultPriority: "MEDIUM",
    color: "#FFC83D", // Primary
  },
  BUDGET_WARNING: {
    id: "BUDGET_WARNING",
    nameKh: "ការព្រមានអំពីថវិកា",
    nameEn: "Budget Warning Notification",
    descriptionKh: "ជូនដំណឹងភ្លាមៗនៅពេលការចំណាយជិតដល់ ឬលើសពីកម្រិតកំណត់ (80%-100%)",
    descriptionEn: "Instant alert when category spending reaches warning threshold",
    iconName: "AlertTriangle",
    defaultPriority: "HIGH",
    color: "#EF4444", // Red / Warning accent
  },
  SAVINGS_GOAL: {
    id: "SAVINGS_GOAL",
    nameKh: "ការរំលឹកគោលដៅសន្សំប្រាក់",
    nameEn: "Savings Goal Reminder",
    descriptionKh: "រំលឹក និងអបអរសាទរនៅពេលអ្នកខិតជិតសម្រេចគោលដៅសន្សំប្រាក់",
    descriptionEn: "Remind and track your progress towards financial savings targets",
    iconName: "Target",
    defaultPriority: "MEDIUM",
    color: "#10B981", // Emerald Green
  },
  RECURRING_TX: {
    id: "RECURRING_TX",
    nameKh: "ការរំលឹកប្រតិបត្តិការថេរ",
    nameEn: "Recurrin g Transaction Reminder",
    descriptionKh: "រំលឹកការទូទាត់វិក្កយបត្រ សេវាកម្មប្រចាំខែ ឬការបង់រំលស់",
    descriptionEn: "Upcoming recurring payment and monthly bill reminders",
    iconName: "Repeat",
    defaultPriority: "HIGH",
    color: "#003377", // Secondary Navy
  },
  MONTHLY_SUMMARY: {
    id: "MONTHLY_SUMMARY",
    nameKh: "សេចក្តីសង្ខេបហិរញ្ញវត្ថុប្រចាំខែ",
    nameEn: "Monthly Financial Summary",
    descriptionKh: "របាយការណ៍វិភាគសង្ខេបអំពីចំណូល ចំណាយ និងការសន្សំប្រចាំខែ",
    descriptionEn: "Comprehensive analytics breakdown of monthly income & expenses",
    iconName: "BarChart3",
    defaultPriority: "LOW",
    color: "#6366F1", // Indigo Accent
  },
};

// export const INITIAL_NOTIFICATIONS: NotificationItem[] = [ 
//   {
//     id: "notif-001",
//     titleKh: "ដល់ម៉ោងកត់ត្រាការចំណាយប្រចាំថ្ងៃ!",
//     titleEn: "Daily Expense Reminder",
//     messageKh: "សូមចំណាយពេល 1 នាទីដើម្បីកត់ត្រាប្រតិបត្តិការចំណាយរបស់អ្នកសម្រាប់ថ្ងៃនេះ។ ការធ្វើបច្ចុប្បន្នភាពទៀងទាត់ជួយរក្សាស្ថេរភាពហិរញ្ញវត្ថុ។",
//     messageEn: "Please take 1 minute to log today's expenses. Keeping tracking updated leads to better budgeting.",
//     category: "DAILY_EXPENSE",
//     channels: ["IN_APP", "EMAIL"],
//     priority: "MEDIUM",
//     isRead: false,
//     createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
//     actionUrl: "/expenses/new",
//     metadata: {
//       periodMonth: "សីហា ២០២៦",
//     },
//   },
//   {
//     id: "notif-002",
//     titleKh: "ការព្រមាន៖ ការចំណាយលើ «អាហារ និងភេសជ្ជៈ» ជិតដល់កម្រិតកំណត់!",
//     titleEn: "Budget Warning Alert",
//     messageKh: "អ្នកបានចំណាយអស់ $340.00 (85%) នៃថវិកាសរុប $400.00 សម្រាប់ប្រភេទ «អាហារ និងភេសជ្ជៈ» ក្នុងខែនេះហើយ។",
//     messageEn: "You have spent $340.00 (85%) of your $400.00 monthly budget for Food & Beverage.",
//     category: "BUDGET_WARNING",
//     channels: ["IN_APP", "EMAIL"],
//     priority: "HIGH",
//     isRead: false,
//     createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
//     actionUrl: "/budgets",
//     metadata: {
//       amount: 340,
//       currency: "USD",
//       budgetCategory: "អាហារ និងភេសជ្ជៈ",
//       budgetLimit: 400,
//       budgetUsedPercent: 85,
//     },
//   },
//   {
//     id: "notif-003",
//     titleKh: "អបអរសាទរ! គោលដៅ «មូលនិធិអាសន្ន» សម្រេចបាន 75% ហើយ",
//     titleEn: "Savings Goal Update",
//     messageKh: "អ្នកបានសន្សំប្រាក់បាន $750.00 នៃគោលដៅសរុប $1,000.00។ ខ្វះតែ $250.00 ទៀតប៉ុណ្ណោះដើម្បីសម្រេចគោលដៅទាំងស្រុង!",
//     messageEn: "Great progress! You reached 75% ($750 / $1,000) of Emergency Fund target.",
//     category: "SAVINGS_GOAL",
//     channels: ["IN_APP"],
//     priority: "MEDIUM",
//     isRead: true,
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
//     actionUrl: "/savings",
//     metadata: {
//       savingsGoalName: "មូលនិធិអាសន្ន (Emergency Fund)",
//       savingsCurrent: 750,
//       savingsTarget: 1000,
//     },
//   },
//   {
//     id: "notif-004",
//     titleKh: "ការរំលឹកបង់ប្រាក់៖ វិក្កយបត្រ «សេវាអ៊ីនធឺណិត» ត្រូវបង់នៅថ្ងៃស្អែក",
//     titleEn: "Upcoming Bill Payment",
//     messageKh: "វិក្កយបត្រប្រចាំខែសេវាអ៊ីនធឺណិតចំនួន $35.00 នឹងត្រូវកាត់ប្រាក់ ឬបង់នៅថ្ងៃទី 08 សីហា ២០២៦។",
//     messageEn: "Internet subscription payment of $35.00 is due tomorrow.",
//     category: "RECURRING_TX",
//     channels: ["IN_APP", "EMAIL"],
//     priority: "HIGH",
//     isRead: false,
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
//     actionUrl: "/recurring",
//     metadata: {
//       amount: 35,
//       currency: "USD",
//       dueDate: "2026-08-08",
//     },
//   },
//   {
//     id: "notif-005",
//     titleKh: "របាយការណ៍ហិរញ្ញវត្ថុសង្ខេបប្រចាំខែកក្កដា ២០២៦ ត្រូវបានចេញផ្សាយ",
//     titleEn: "Monthly Summary Report",
//     messageKh: "ក្នុងខែកក្កដា អ្នកទទួលបានប្រាក់ចំណូលសរុប $2,450.00, ចំណាយសរុប $1,280.00, និងរក្សាបានការសន្សំសុទ្ធចំនួន $1,170.00 (កំណើន +12% ធៀបនឹងខែមិថុនា)។",
//     messageEn: "July financial summary: Total Income $2,450, Expenses $1,280, Net Savings $1,170 (+12% vs June).",
//     category: "MONTHLY_SUMMARY",
//     channels: ["IN_APP", "EMAIL"],
//     priority: "LOW",
//     isRead: true,
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
//     actionUrl: "/reports/monthly",
//     metadata: {
//       incomeTotal: 2450,
//       expenseTotal: 1280,
//       netSavings: 1170,
//       periodMonth: "កក្កដា ២០២៦",
//     },
//   },
// ];


export const INITIAL_PREFERENCES: UserNotificationPreferences = {
  email: "user.khmer@istash.com",
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  digestFrequency: "DAILY",
  categories: [
    {
      category: "DAILY_EXPENSE",
      inAppEnabled: true,
      emailEnabled: true,
      reminderTime: "20:00",
    },
    {
      category: "BUDGET_WARNING",
      inAppEnabled: true,
      emailEnabled: true,
      thresholdPercent: 80,
    },
    {
      category: "SAVINGS_GOAL",
      inAppEnabled: true,
      emailEnabled: false,
    },
    {
      category: "RECURRING_TX",
      inAppEnabled: true,
      emailEnabled: true,
      reminderTime: "09:00",
    },
    {
      category: "MONTHLY_SUMMARY",
      inAppEnabled: true,
      emailEnabled: true,
    },
  ],
};
