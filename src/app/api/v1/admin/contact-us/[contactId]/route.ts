import { NextResponse } from "next/server";

interface MockContactDetail {
  id: string;
  userId: string | null;
  registeredUser: boolean;
  name: string;
  phone: string | null;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const mockMessages: MockContactDetail[] = [
  {
    id: "21e1f22d-527d-4466-844c-f8fdb62a3b9c",
    userId: null,
    registeredUser: false,
    name: "សុខ ដារ៉ា",
    phone: "012345678",
    email: "dara@example.com",
    subject: "សំណួរអំពី iStash",
    message: "ខ្ញុំចង់ដឹងព័ត៌មានបន្ថែមអំពី iStash។",
    createdAt: "2026-08-21T22:27:37.373641Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    userId: "123e4567-e89b-12d3-a456-426614174000",
    registeredUser: true,
    name: "រ៉ូសាលីន កែវ",
    phone: "098765432",
    email: "rosalin.keo@istash.app",
    subject: "ជំនួយក្នុងការធ្វើសមកាលកម្មគណនី",
    message: "ខ្ញុំមានបញ្ហាក្នុងការតភ្ជាប់រូបិយប័ណ្ណ និងធ្វើសមកាលកម្មទិន្នន័យចំណាយប្រចាំខែ។",
    createdAt: "2026-08-24T08:34:59.605Z",
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    userId: "b2f5056d-8e67-4fbf-a0bf-7bb78ae5e153",
    registeredUser: true,
    name: "វ៉ាន់ដា ម៉េង",
    phone: "077123456",
    email: "vanda.meng@gmail.com",
    subject: "សំណើបន្ថែមប្រភេទចំណាយថ្មី",
    message: "ជំរាបសួរ!\n\nខ្ញុំជាអ្នកប្រើប្រាស់ iStash ជាប្រចាំ។ ខ្ញុំសូមស្នើសុំបន្ថែមប្រភេទចំណាយសម្រាប់ការវិនិយោគ រួមទាំងការទិញភាគហ៊ុន និងមូលបត្របំណុល។\n\nអរគុណសម្រាប់ការអភិវឌ្ឍកម្មវិធីដ៏ល្អ!",
    createdAt: "2026-08-23T14:15:22.102Z",
  },
  {
    id: "4bb85f64-5717-4562-b3fc-2c963f66afa7",
    userId: null,
    registeredUser: false,
    name: "ចាន់ សុផល",
    phone: "089887766",
    email: "sophal.chan@outlook.com",
    subject: "កិច្ចសហប្រតិបត្តិការដៃគូអាជីវកម្ម",
    message: "សួស្តីក្រុមការងារ!\n\nក្រុមហ៊ុនយើងខ្ញុំចាប់អារម្មណ៍ក្នុងការធ្វើសហការ និងរួមបញ្ចូលប្រព័ន្ធ QR Code ទូទាត់ជាមួយ iStash។\n\nសូមផ្ញើព័ត៌មានលម្អិតសម្រាប់ការណាត់ជួបពិភាក្សា។",
    createdAt: "2026-08-22T09:40:10.512Z",
  },
  {
    id: "5cc85f64-5717-4562-b3fc-2c963f66afa8",
    userId: "c4a5056d-8e67-4fbf-a0bf-7bb78ae5e199",
    registeredUser: true,
    name: "លីណា ថន",
    phone: "015998877",
    email: "lina.thorn@yahoo.com",
    subject: "សំណួរសុវត្ថិភាពទិន្នន័យហិរញ្ញវត្ថុ",
    message: "សួស្តី!\n\nខ្ញុំចង់សួរអំពីគោលការណ៍សុវត្ថិភាព និងការរក្សាការសម្ងាត់ទិន្នន័យហិរញ្ញវត្ថុរបស់ iStash។\n\nតើទិន្នន័យត្រូវបានការពារដោយ encryption កម្រិតណា?\n\nសូមអរគុណ!",
    createdAt: "2026-08-20T16:55:00.000Z",
  },
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contactId?: string; id?: string }> }
) {
  const resolvedParams = await params;
  const targetId = resolvedParams.contactId || resolvedParams.id;
  const message = mockMessages.find((m) => m.id === targetId);

  if (!message) {
    return NextResponse.json(
      {
        success: false,
        message: "Contact message not found.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Contact message retrieved successfully.",
    data: message,
    timestamp: new Date().toISOString(),
  });
}
