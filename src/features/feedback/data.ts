import { FeedbackItem, FeedbackStatus } from "./types";

export const feedbackTabs: Array<{ key: FeedbackStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "resolved", label: "Resolved" },
  { key: "in-progress", label: "In Progress" },
  { key: "new", label: "New" },
];

export const feedbackSample: FeedbackItem[] = [
  {
    id: "feedback-1",
    title: "Dark mode for mobile app",
    description:
      "ខ្ញុំពិតជាចង់បានមុខងារ Dark mode ពេញលេញមួយនៅលើកម្មវិធីទូរស័ព្ទ។ ផ្ទៃពណ៌ភ្លឺបច្ចុប្បន្នគឺភ្លឺខ្លាំងពេកសម្រាប់ការប្រើប្រាស់នៅពេលយប់។ ប្រសិនបើវាអាចរៀបចំឱ្យសមស្របជាមួយអេក្រង់ប្រភេទ OLED (ពណ៌ខ្មៅដិតខ្លាំង) ទៀតនោះ គឺពិតជាល្អឥតខ្ចោះ។",
    category: "UX",
    status: "in-progress",
    rating: 4,
    votes: 12,
    date: "28/01/2026",
  },
  {
    id: "feedback-2",
    title: "The AI spending analysis is incredible",
    description:
      "ក្នុងរយៈពេលមួយឆ្នាំចុងក្រោយនេះ ខ្ញុំបានសាកល្បងប្រើកម្មវិធីហិរញ្ញវត្ថុចំនួន ៦ ផ្សេងគ្នា ប៉ុន្តែមិនទាន់មានកម្មវិធីណាមួយអាចផ្ដល់ការវិភាគបានស៊ីជម្រៅដូច iStash នោះទេ។ មុខងារស្វែងរកភាពមិនប្រក្រតី (Anomaly detection) របស់វា ថែមទាំងបានរកឃើញការកាត់ប្រាក់ស្ទួនគ្នាដែលខ្ញុំបានរំលងចោលទាំងស្រុងទៀតផង!",
    category: "Product",
    status: "resolved",
    rating: 5,
    votes: 3,
    date: "18/01/2026",
  },
  {
    id: "feedback-3",
    title: "Onboarding felt a bit long",
    description:
      "លំហូរនៃការរៀបចំប្រវត្តិរូបមានដល់ទៅ ៥ ជំហាន ប៉ុន្តែប្រឡោះព័ត៌មានជាច្រើនមិនចាំបាច់បំពេញក៏បាន។ ប្រហែលជាគួរតែផ្ដល់ជម្រើស 'ចាប់ផ្ដើមរហ័ស' ដែលសួរតែព័ត៌មានចាំបាច់បំផុត ហើយអនុញ្ញាតឱ្យអ្នកប្រើប្រាស់បំពេញផ្នែកដែលនៅសល់នៅពេលក្រោយបាន។",
    category: "UX",
    status: "new",
    rating: 3,
    votes: 5,
    date: "08/01/2026",
  },
  {
    id: "feedback-4",
    title: "Voice entry transcription wrong language",
    description:
      "នៅពេលដែលខ្ញុំនិយាយជាភាសាអេស្ប៉ាញ ការបំប្លែងសំឡេងទៅជាអក្សរ បែរជាចេញមកជាការបញ្ចេញសំឡេងភាសាអង់គ្លេសដែលមិនអាចស្ដាប់បាន (ឥតន័យ)។ វាហាក់ដូចជាកម្មវិធីមិនអាចសម្គាល់ភាសាដែលខ្ញុំកំពុងនិយាយនោះទេ។",
    category: "Bug",
    status: "resolved",
    rating: 1,
    votes: 2,
    date: "29/10/2026",
  },
  {
    id: "feedback-5",
    title: "Payment category suggestions are too generic",
    description:
      "ប្រព័ន្ធណែនាំប្រភេទចំណាយគួរតែមានភាពឆ្លាតវៃជាងមុន និងប្រើប្រាស់ប្រតិបត្តិការថ្មីៗ ដើម្បីចាត់ថ្នាក់ចំណាយបានកាន់តែត្រឹមត្រូវ។",
    category: "Product",
    status: "in-progress",
    rating: 4,
    votes: 7,
    date: "02/02/2026",
  },
];
