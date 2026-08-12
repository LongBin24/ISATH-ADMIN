import { POST as syncHandler } from "../src/app/api/v1/admin/currencies/synchronize/route";
import { PATCH as deactivateHandler } from "../src/app/api/v1/admin/currencies/[code]/deactivate/route";
import { PATCH as activateHandler } from "../src/app/api/v1/admin/currencies/[code]/activate/route";
import { GET as providerStatusHandler } from "../src/app/api/v1/admin/currencies/provider-status/route";
import { GET as getCurrenciesHandler } from "../src/app/api/v1/admin/currencies/route";

async function runTests() {
  console.log("=================================================");
  console.log("🚀 STARTING API ENDPOINT TESTS FOR CURRENCIES");
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

  // Test 1: POST /api/v1/admin/currencies/synchronize
  try {
    console.log("🔍 Testing 1: POST /api/v1/admin/currencies/synchronize");
    const res = await syncHandler();
    const body = await res.json();
    assert(
      res.status === 200 &&
      body.success === true &&
      body.data?.status === "SUCCESS" &&
      typeof body.data?.synchronizationId === "string",
      "POST /api/v1/admin/currencies/synchronize",
      body
    );
  } catch (err) {
    assert(false, "POST /api/v1/admin/currencies/synchronize", err);
  }

  console.log("\n-------------------------------------------------\n");

  // Test 2: PATCH /api/v1/admin/currencies/{code}/deactivate
  try {
    console.log("🔍 Testing 2: PATCH /api/v1/admin/currencies/THB/deactivate");
    const req = new Request("http://localhost/api/v1/admin/currencies/THB/deactivate", {
      method: "PATCH",
    });
    const params = Promise.resolve({ code: "THB" });
    const res = await deactivateHandler(req, { params });
    const body = await res.json();
    assert(
      res.status === 200 &&
      body.success === true &&
      body.data?.code === "THB" &&
      body.data?.active === false,
      "PATCH /api/v1/admin/currencies/THB/deactivate",
      body
    );
  } catch (err) {
    assert(false, "PATCH /api/v1/admin/currencies/THB/deactivate", err);
  }

  console.log("\n-------------------------------------------------\n");

  // Test 3: PATCH /api/v1/admin/currencies/{code}/activate
  try {
    console.log("🔍 Testing 3: PATCH /api/v1/admin/currencies/THB/activate");
    const req = new Request("http://localhost/api/v1/admin/currencies/THB/activate", {
      method: "PATCH",
    });
    const params = Promise.resolve({ code: "THB" });
    const res = await activateHandler(req, { params });
    const body = await res.json();
    assert(
      res.status === 200 &&
      body.success === true &&
      body.data?.code === "THB" &&
      body.data?.active === true,
      "PATCH /api/v1/admin/currencies/THB/activate",
      body
    );
  } catch (err) {
    assert(false, "PATCH /api/v1/admin/currencies/THB/activate", err);
  }

  console.log("\n-------------------------------------------------\n");

  // Test 4: GET /api/v1/admin/currencies/provider-status
  try {
    console.log("🔍 Testing 4: GET /api/v1/admin/currencies/provider-status");
    const res = await providerStatusHandler();
    const body = await res.json();
    assert(
      res.status === 200 &&
      body.success === true &&
      body.data?.provider === "EXCHANGE_RATE_API_OPEN" &&
      body.data?.status === "HEALTHY",
      "GET /api/v1/admin/currencies/provider-status",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/currencies/provider-status", err);
  }

  console.log("\n-------------------------------------------------\n");

  // Test 5: GET /api/v1/admin/currencies (Bonus list endpoint)
  try {
    console.log("🔍 Testing 5: GET /api/v1/admin/currencies");
    const res = await getCurrenciesHandler();
    const body = await res.json();
    assert(
      res.status === 200 &&
      body.success === true &&
      Array.isArray(body.data) &&
      body.data.length > 0,
      "GET /api/v1/admin/currencies",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/currencies", err);
  }

  console.log("\n=================================================");
  console.log(`📊 SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} TESTS`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
