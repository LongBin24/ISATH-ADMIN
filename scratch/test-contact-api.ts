import { GET as getContactMessagesHandler } from "../src/app/api/v1/admin/contact-us/route";
import { GET as getSingleContactHandler } from "../src/app/api/v1/admin/contact-us/[contactId]/route";

async function testContactUsEndpoints() {
  console.log("=================================================");
  console.log("🚀 TESTING GET /api/v1/admin/contact-us & [contactId]");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (detail) console.log("   Response Data:", JSON.stringify(detail, null, 2));
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (detail) console.error("   Details:", detail);
      failed++;
    }
  }

  // Test 1: GET /api/v1/admin/contact-us
  try {
    const req = new Request("http://localhost:3000/api/v1/admin/contact-us?page=0&size=20");
    const res = await getContactMessagesHandler(req);
    const body = await res.json();

    assert(
      res.status === 200 &&
      body.success === true &&
      body.data &&
      Array.isArray(body.data.content) &&
      body.data.content.length > 0,
      "GET /api/v1/admin/contact-us (List)",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/contact-us (List)", err);
  }

  // Test 2: GET /api/v1/admin/contact-us/{contactId} (Guest Message)
  try {
    const contactId = "21e1f22d-527d-4466-844c-f8fdb62a3b9c";
    const req = new Request(`http://localhost:3000/api/v1/admin/contact-us/${contactId}`);
    const params = Promise.resolve({ contactId });
    const res = await getSingleContactHandler(req, { params });
    const body = await res.json();

    assert(
      res.status === 200 &&
      body.success === true &&
      body.message === "Contact message retrieved successfully." &&
      body.data.id === contactId &&
      body.data.name === "សុខ ដារ៉ា" &&
      body.data.phone === "012345678" &&
      body.data.email === "dara@example.com" &&
      body.data.subject === "សំណួរអំពី iStash" &&
      body.data.message === "ខ្ញុំចង់ដឹងព័ត៌មានបន្ថែមអំពី iStash។" &&
      body.data.registeredUser === false &&
      body.data.userId === null,
      "GET /api/v1/admin/contact-us/{contactId} (Guest inquiry test)",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/contact-us/{contactId}", err);
  }

  // Test 3: GET /api/v1/admin/contact-us/{contactId} (Registered User)
  try {
    const contactId = "123e4567-e89b-12d3-a456-426614174000";
    const req = new Request(`http://localhost:3000/api/v1/admin/contact-us/${contactId}`);
    const params = Promise.resolve({ contactId });
    const res = await getSingleContactHandler(req, { params });
    const body = await res.json();

    assert(
      res.status === 200 &&
      body.success === true &&
      body.data.id === contactId &&
      body.data.registeredUser === true &&
      body.data.userId === "123e4567-e89b-12d3-a456-426614174000" &&
      body.data.name === "រ៉ូសាលីន កែវ",
      "GET /api/v1/admin/contact-us/{contactId} (Registered user test)",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/contact-us/{contactId} (Registered user)", err);
  }

  // Test 4: GET /api/v1/admin/contact-us/unknown-id -> 404
  try {
    const contactId = "non-existent-id";
    const req = new Request(`http://localhost:3000/api/v1/admin/contact-us/${contactId}`);
    const params = Promise.resolve({ contactId });
    const res = await getSingleContactHandler(req, { params });
    const body = await res.json();

    assert(
      res.status === 404 &&
      body.success === false,
      "GET /api/v1/admin/contact-us/{contactId} (404 Not Found)",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/contact-us/{contactId} (404)", err);
  }

  console.log("\n=================================================");
  console.log(`📊 SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} TESTS`);
  console.log("=================================================\n");
}

testContactUsEndpoints();
