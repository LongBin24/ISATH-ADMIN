import { NextResponse } from "next/server";

interface MockContactMessage {
  id: string;
  userId: string | null;
  registeredUser: boolean;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  messagePreview: string;
  createdAt: string;
}

const mockContactMessages: MockContactMessage[] = [
  {
    id: "21e1f22d-527d-4466-844c-f8fdb62a3b9c",
    userId: null,
    registeredUser: false,
    name: "សុខ ដារ៉ា",
    email: "dara@example.com",
    phone: "012345678",
    subject: "សំណួរអំពី iStash",
    messagePreview: "ខ្ញុំចង់ដឹងព័ត៌មានបន្ថែមអំពី iStash និងរបៀបប្រើប្រាស់មុខងារតាមដានចំណាយ។",
    createdAt: "2026-08-21T22:27:37.373641Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    userId: "123e4567-e89b-12d3-a456-426614174000",
    registeredUser: true,
    name: "រ៉ូសាលីន កែវ",
    email: "rosalin.keo@istash.app",
    phone: "098765432",
    subject: "ជំនួយក្នុងការធ្វើសមកាលកម្មគណនី",
    messagePreview: "ខ្ញុំមានបញ្ហាក្នុងការតភ្ជាប់រូបិយប័ណ្ណ និងធ្វើសមកាលកម្មទិន្នន័យចំណាយប្រចាំខែ។",
    createdAt: "2026-08-24T08:34:59.605Z",
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    userId: "b2f5056d-8e67-4fbf-a0bf-7bb78ae5e153",
    registeredUser: true,
    name: "វ៉ាន់ដា ម៉េង",
    email: "vanda.meng@gmail.com",
    phone: "077123456",
    subject: "សំណើបន្ថែមប្រភេទចំណាយថ្មី",
    messagePreview: "សូមជួយបន្ថែមជម្រើសប្រភេទចំណាយសម្រាប់ការវិនិយោគ និងការទិញភាគហ៊ុន។",
    createdAt: "2026-08-23T14:15:22.102Z",
  },
  {
    id: "4bb85f64-5717-4562-b3fc-2c963f66afa7",
    userId: null,
    registeredUser: false,
    name: "ចាន់ សុផល",
    email: "sophal.chan@outlook.com",
    phone: "089887766",
    subject: "កិច្ចសហប្រតិបត្តិការដៃគូអាជីវកម្ម",
    messagePreview: "ពួកយើងចង់ពិភាក្សាអំពីការរួមបញ្ចូលប្រព័ន្ធទូទាត់ជាមួយ iStash Platform។",
    createdAt: "2026-08-22T09:40:10.512Z",
  },
  {
    id: "5cc85f64-5717-4562-b3fc-2c963f66afa8",
    userId: "c4a5056d-8e67-4fbf-a0bf-7bb78ae5e199",
    registeredUser: true,
    name: "លីណា ថន",
    email: "lina.thorn@yahoo.com",
    phone: "015998877",
    subject: "សំណួរសុវត្ថិភាពទិន្នន័យហិរញ្ញវត្ថុ",
    messagePreview: "តើទិន្នន័យប្រតិបត្តិការរបស់ខ្ញុំត្រូវបានការពារ និង encrypt ដោយរបៀបណា?",
    createdAt: "2026-08-20T16:55:00.000Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(
    searchParams.get("page") || searchParams.get("pageNumber") || "0",
    10
  );
  const size = parseInt(
    searchParams.get("size") || searchParams.get("pageSize") || "20",
    10
  );
  const query = (
    searchParams.get("query") ||
    searchParams.get("search") ||
    ""
  ).toLowerCase().trim();
  const registeredUserParam = searchParams.get("registeredUser");

  let filtered = [...mockContactMessages];

  if (registeredUserParam !== null && registeredUserParam !== undefined && registeredUserParam !== "") {
    const isRegistered = registeredUserParam === "true";
    filtered = filtered.filter((item) => item.registeredUser === isRegistered);
  }

  if (query) {
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        (item.phone && item.phone.includes(query)) ||
        item.subject.toLowerCase().includes(query) ||
        item.messagePreview.toLowerCase().includes(query)
    );
  }

  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const start = page * size;
  const content = filtered.slice(start, start + size);

  return NextResponse.json({
    success: true,
    message: "Contact messages retrieved successfully.",
    data: {
      content,
      page,
      size,
      totalElements,
      totalPages,
      first: page === 0,
      last: page >= totalPages - 1,
    },
    timestamp: new Date().toISOString(),
  });
}
