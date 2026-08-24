import { GET as getAuditLogsHandler } from "../src/app/api/v1/admin/audit-logs/route";
import { GET as getAuditLogByIdHandler } from "../src/app/api/v1/admin/audit-logs/[auditLogId]/route";
import { GET as getAuditLogsByUserHandler } from "../src/app/api/v1/admin/audit-logs/users/[userId]/route";
import { GET as getAuditLogsByEntityHandler } from "../src/app/api/v1/admin/audit-logs/entities/[entityType]/[entityId]/route";

async function testAuditLogsEndpoints() {
  console.log("=================================================");
  console.log("🚀 TESTING ALL AUDIT LOG ENDPOINTS");
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

  // Test 1: GET /api/v1/admin/audit-logs
  try {
    const req = new Request("http://localhost:3000/api/v1/admin/audit-logs?page=0&size=20");
    const res = await getAuditLogsHandler(req);
    const body = await res.json();

    assert(
      res.status === 200 &&
      body.success === true &&
      body.data &&
      Array.isArray(body.data.content) &&
      body.data.content.length > 0,
      "GET /api/v1/admin/audit-logs (List all)",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/audit-logs", err);
  }

  // Test 2: GET /api/v1/admin/audit-logs/{auditLogId} (User Sample Data exact match)
  try {
    const auditLogId = "bbd3c8ae-e7b7-4ba9-9c05-e1d2a31aee37";
    const req = new Request(`http://localhost:3000/api/v1/admin/audit-logs/${auditLogId}`);
    const params = Promise.resolve({ auditLogId });
    const res = await getAuditLogByIdHandler(req, { params });
    const body = await res.json();

    assert(
      res.status === 200 &&
      body.success === true &&
      body.message === "Audit log retrieved successfully." &&
      body.data.id === auditLogId &&
      body.data.action === "CREATE" &&
      body.data.entityType === "CONTACT_MESSAGE" &&
      body.data.entityId === "21e1f22d-527d-4466-844c-f8fdb62a3b9c" &&
      body.data.oldValues === null &&
      body.data.newValues?.object === true &&
      body.data.ipAddress === "127.0.0.1" &&
      body.data.userAgent === "curl/8.7.1" &&
      body.data.userId === null,
      "GET /api/v1/admin/audit-logs/{auditLogId} (Exact Sample Match)",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/audit-logs/{auditLogId}", err);
  }

  // Test 3: GET /api/v1/admin/audit-logs/users/{userId}
  try {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const req = new Request(`http://localhost:3000/api/v1/admin/audit-logs/users/${userId}`);
    const params = Promise.resolve({ userId });
    const res = await getAuditLogsByUserHandler(req, { params });
    const body = await res.json();

    assert(
      res.status === 200 &&
      body.success === true &&
      body.message === "User audit history retrieved successfully." &&
      body.data.content.length === 1 &&
      body.data.content[0].userId === userId,
      "GET /api/v1/admin/audit-logs/users/{userId}",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/audit-logs/users/{userId}", err);
  }

  // Test 4: GET /api/v1/admin/audit-logs/entities/{entityType}/{entityId} (Found entity history)
  try {
    const entityType = "CONTACT_MESSAGE";
    const entityId = "21e1f22d-527d-4466-844c-f8fdb62a3b9c";
    const req = new Request(`http://localhost:3000/api/v1/admin/audit-logs/entities/${entityType}/${entityId}`);
    const params = Promise.resolve({ entityType, entityId });
    const res = await getAuditLogsByEntityHandler(req, { params });
    const body = await res.json();

    assert(
      res.status === 200 &&
      body.success === true &&
      body.message === "Entity audit history retrieved successfully." &&
      body.data.content.length === 1 &&
      body.data.content[0].entityType === entityType &&
      body.data.content[0].entityId === entityId,
      "GET /api/v1/admin/audit-logs/entities/{entityType}/{entityId} (Entity Found)",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/audit-logs/entities/{entityType}/{entityId}", err);
  }

  // Test 5: GET /api/v1/admin/audit-logs/entities/{entityType}/{entityId} (Empty entity history matching user response sample)
  try {
    const entityType = "USER";
    const entityId = "non-existent-entity-999";
    const req = new Request(`http://localhost:3000/api/v1/admin/audit-logs/entities/${entityType}/${entityId}`);
    const params = Promise.resolve({ entityType, entityId });
    const res = await getAuditLogsByEntityHandler(req, { params });
    const body = await res.json();

    assert(
      res.status === 200 &&
      body.success === true &&
      body.message === "Entity audit history retrieved successfully." &&
      Array.isArray(body.data.content) &&
      body.data.content.length === 0 &&
      body.data.totalElements === 0 &&
      body.data.totalPages === 0 &&
      body.data.first === true &&
      body.data.last === true,
      "GET /api/v1/admin/audit-logs/entities/{entityType}/{entityId} (Empty History Match)",
      body
    );
  } catch (err) {
    assert(false, "GET /api/v1/admin/audit-logs/entities/{entityType}/{entityId} (Empty)", err);
  }

  console.log("\n=================================================");
  console.log(`📊 SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} TESTS`);
  console.log("=================================================\n");
}

testAuditLogsEndpoints();
