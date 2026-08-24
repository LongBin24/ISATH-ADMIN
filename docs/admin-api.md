# iStash Admin REST API Reference

Personal finance management REST API. **Keycloak** owns login credentials, email verification, password-reset links, OAuth authorization, and access/refresh tokens. **Spring** orchestrates registration, local profile synchronization, PKCE state, and Keycloak email actions.

- **Version:** v1
- **Base paths:** all admin routes are prefixed `/api/v1/admin`

## Servers

| Environment | URL |
|---|---|
| Development | `http://localhost:8080` |
| Testing | `https://test-api.istashkh.com` |
| Production | `https://ite-api.istashkh.com` |

## Authentication

All endpoints use `bearerAuth`: an `Authorization: Bearer <JWT>` header, issued by Keycloak.

## Response envelope

Most endpoints wrap their payload in a common envelope:

```jsonc
{
  "success": true,
  "message": "string",
  "data": { /* endpoint-specific payload, see ApiResponse<T> below */ },
  "timestamp": "2026-08-13T00:00:00Z"
}
```

Endpoints returning Spring Data `Page`/`PagedModel` objects instead use one of two pagination shapes:

- **`Page*` style** (Users, Categories, Reviews): `content[]`, `totalElements`, `totalPages`, `size`, `number`/`pageNumber`, `first`, `last`.
- **`PagedModel*` style** (Notifications, Alert Rules): `content[]` + nested `page: { size, number, totalElements, totalPages }`.

---

## Admin Users

| Method | Path | Operation ID | Auth |
|---|---|---|---|
| GET | `/api/v1/admin/users` | `listUsers` | ✅ |
| POST | `/api/v1/admin/users` | `createUser` | ✅ |
| GET | `/api/v1/admin/users/{userId}` | `getUser` | ✅ |
| GET | `/api/v1/admin/users/{userId}/onboarding` | `getOnboardingStatus` | ✅ |
| GET | `/api/v1/admin/users/statistics` | `getStatistics` | ✅ |
| POST | `/api/v1/admin/users/{userId}/suspend` | `suspendUser` | ✅ |
| POST | `/api/v1/admin/users/{userId}/reactivate` | `reactivateUser` | ✅ |

### `GET /api/v1/admin/users` — List / search users

Query parameters:

| Name | Type | Notes |
|---|---|---|
| `query` | string (≤255) | free-text search |
| `accountStatus` | enum | `ACTIVE`, `SUSPENDED`, `DELETED` |
| `emailVerified` | boolean | |
| `onboardingCompleted` | boolean | |
| `createdFrom` / `createdTo` | date-time | range filter |
| `pageNumber` | int32 (≥0) | |
| `pageSize` | int32 (1–200) | |
| `sortBy` | string (≤100) | |
| `sortDirection` | string | pattern `(?i)^(asc\|desc)$` |

**Response 200:** `ApiResponse<Page<UserProfileResponse>>`

### `POST /api/v1/admin/users` — Create a user (admin-provisioned)

Body — `CreateAdminUserRequest` (all required except noted):

| Field | Type | Constraints |
|---|---|---|
| `firstName` | string | ≤100 |
| `lastName` | string | ≤100 |
| `email` | string (email) | ≤255 |
| `temporaryPassword` | string | 8–100 |
| `confirmPassword` | string | ≥1 |
| `role` | enum | `USER`, `ADMIN` |

**Response 200:** `ApiResponse<AdminCreatedUserResponse>` — `{ profile: UserProfileResponse, role, temporaryPassword: boolean }`

### `GET /api/v1/admin/users/{userId}` — Get user by ID
Path: `userId` (uuid). **Response:** `ApiResponse<UserProfileResponse>`

### `GET /api/v1/admin/users/{userId}/onboarding` — Get onboarding status
Path: `userId` (uuid). **Response:** `ApiResponse<OnboardingResponse>` — `{ userId, onboardingCompleted, completedNow }`

### `GET /api/v1/admin/users/statistics` — Aggregate user statistics
No parameters. **Response:** `ApiResponse<UserStatisticsResponse>`:

```jsonc
{
  "totalUsers": 0,
  "gender": { "male": 0, "female": 0, "other": 0, "preferNotToSay": 0, "unspecified": 0 },
  "ageGroups": { "under15": 0, "age15To24": 0, "age25To44": 0, "age45To59": 0, "age60To74": 0, "age75Plus": 0, "unknown": 0 },
  "generatedAt": "2026-08-13T00:00:00Z"
}
```

### `POST /api/v1/admin/users/{userId}/suspend` — Suspend a user
Path: `userId` (uuid). No body. **Response:** `ApiResponse<UserProfileResponse>` (updated `accountStatus: SUSPENDED`).

### `POST /api/v1/admin/users/{userId}/reactivate` — Reactivate a suspended user
Path: `userId` (uuid). No body. **Response:** `ApiResponse<UserProfileResponse>` (updated `accountStatus: ACTIVE`).

#### `UserProfileResponse`
`id`, `keycloakUserId`, `username`, `firstName`, `lastName`, `displayName`, `email`, `emailVerified`, `phoneNumber`, `profileImageUrl`, `dateOfBirth`, `gender` (`MALE`/`FEMALE`/`OTHER`/`PREFER_NOT_TO_SAY`), `occupation`, `addressLine1`, `addressLine2`, `city`, `stateProvince`, `postalCode`, `countryCode`, `profileCompleted`, `onboardingCompleted`, `accountStatus` (`ACTIVE`/`SUSPENDED`/`DELETED`), `termsAcceptedAt`, `privacyPolicyAcceptedAt`, `createdAt`, `updatedAt`, `deletedAt`.

---

## Admin Notifications

| Method | Path | Operation ID | Auth |
|---|---|---|---|
| GET | `/api/v1/admin/notifications` | `search` | ✅ |
| POST | `/api/v1/admin/notifications` | `create` | ✅ |
| GET | `/api/v1/admin/notifications/{notificationId}` | `get` | ✅ |
| POST | `/api/v1/admin/notifications/{notificationId}/deliveries/retry` | `retryDeliveries` | ✅ |

### `GET /api/v1/admin/notifications` — List all notifications

Query parameters: `userId` (uuid), `notificationType` (enum, see below), `referenceType` (`BUDGET`/`SAVINGS_GOAL`/`RECURRING_TRANSACTION`/`WALLET`/`WALLET_INVITATION`/`TRANSACTION`), `referenceId` (uuid), `read` (boolean), `alertRuleId` (uuid), `createdFrom`/`createdTo` (date-time), `pageNumber`, `pageSize`, `sortBy`, `sortDirection`.

`notificationType` enum: `DAILY_REMINDER`, `BUDGET_WARNING`, `SAVINGS_REMINDER`, `RECURRING_REMINDER`, `MONTHLY_SUMMARY`, `EXPENSE_CATEGORY_REVIEW_REQUIRED`, `WALLET_INVITATION`, `WALLET_INVITATION_ACCEPTED`, `WALLET_INVITATION_DECLINED`, `WALLET_INVITATION_CANCELLED`, `WALLET_INVITATION_EXPIRED`, `WALLET_MEMBER_JOINED`, `WALLET_MEMBER_REMOVED`, `WALLET_ROLE_CHANGED`, `SHARED_TRANSACTION_CREATED`, `SHARED_TRANSACTION_UPDATED`, `SHARED_TRANSACTION_DELETED`, `SYSTEM`.

**Response 200:** `PagedModel<NotificationResponse>` (not wrapped in the `ApiResponse` envelope).

### `POST /api/v1/admin/notifications` — Create a system notification

Body — `CreateAdminNotificationRequest` (required: `userId`, `title`, `message`, `notificationType`):

| Field | Type | Notes |
|---|---|---|
| `userId` | uuid | target user |
| `title` | string (≤200) | |
| `message` | string (≤2000) | |
| `notificationType` | enum | see above |
| `referenceType` | enum | optional |
| `referenceId` | uuid | optional |
| `actionUrl` | string (≤500) | optional |
| `metadata` | object | free-form key/value |
| `expiresAt` | date-time | optional |
| `channels` | enum[] (unique) | `IN_APP`, `EMAIL` |

**Response 201:** `NotificationResponse`.

### `GET /api/v1/admin/notifications/{notificationId}` — Get notification
Path: `notificationId` (uuid). **Response:** `NotificationResponse`.

### `POST /api/v1/admin/notifications/{notificationId}/deliveries/retry` — Retry failed deliveries
Path: `notificationId` (uuid). Body — `RetryNotificationDeliveriesRequest` (optional): `{ channel?: "IN_APP" | "EMAIL" }`. If omitted, presumably retries all failed channels.

**Response 200:** `NotificationDeliveryResponse[]`:

| Field | Type |
|---|---|
| `id`, `notificationId` | uuid |
| `channel` | `IN_APP` \| `EMAIL` |
| `deliveryStatus` | `PENDING` \| `SENT` \| `DELIVERED` \| `FAILED` |
| `sentAt`, `deliveredAt` | date-time |
| `errorMessage` | string |

#### `NotificationResponse`
`id`, `userId`, `actorUserId`, `alertRuleId`, `title`, `message`, `notificationType`, `referenceType`, `referenceId`, `read`, `readAt`, `actionUrl`, `metadata`, `expiresAt`, `createdAt`, `updatedAt`.

---

## Admin Currencies

| Method | Path | Operation ID | Auth |
|---|---|---|---|
| GET | `/api/v1/admin/currencies` | `getAllCurrencies` | ✅ |
| GET | `/api/v1/admin/currencies/provider-status` | `getProviderStatus` | ✅ |
| POST | `/api/v1/admin/currencies/synchronize` | `synchronize` | ✅ |
| PATCH | `/api/v1/admin/currencies/{code}/activate` | `activateCurrency` | ✅ |
| PATCH | `/api/v1/admin/currencies/{code}/deactivate` | `deactivateCurrency` | ✅ |

### `GET /api/v1/admin/currencies` — List all currencies
No parameters. **Response:** `ApiResponse<CurrencyResponse[]>`.

### `GET /api/v1/admin/currencies/provider-status` — Exchange-rate provider health
No parameters. **Response:** `ApiResponse<CurrencyProviderStatusResponse>`:

| Field | Type |
|---|---|
| `provider` | string |
| `status` | `HEALTHY` \| `STALE` \| `UNAVAILABLE` \| `SYNCHRONIZING` \| `NEVER_SYNCED` |
| `lastAttemptAt`, `lastSuccessfulSyncAt` | date-time |
| `currenciesReceived`, `ratesUpdated` | int32 |
| `stale` | boolean |
| `lastError`, `message` | string |

### `POST /api/v1/admin/currencies/synchronize` — Trigger a currency/rate sync
No body. **Response:** `ApiResponse<CurrencySynchronizationResponse>`:

| Field | Type |
|---|---|
| `synchronizationId` | uuid |
| `provider` | string |
| `status` | `STARTED` \| `SUCCESS` \| `FAILED` |
| `currenciesReceived`, `currenciesUpdated`, `ratesReceived`, `ratesUpdated` | int32 |
| `startedAt`, `completedAt` | date-time |
| `errorMessage` | string |

### `PATCH /api/v1/admin/currencies/{code}/activate` / `.../deactivate`
Path: `code` (string, ISO currency code). No body. **Response:** `ApiResponse<CurrencyResponse>`.

#### `CurrencyResponse`
`code`, `name`, `symbol`, `decimalPlaces`, `active`, `provider`, `lastSyncedAt`, `createdAt`, `updatedAt`.

---

## Admin Categories

| Method | Path | Operation ID | Auth |
|---|---|---|---|
| GET | `/api/v1/admin/categories` | `search_1` | ✅ |
| POST | `/api/v1/admin/categories` | `create_1` | ✅ |
| PATCH | `/api/v1/admin/categories/{categoryId}` | `update` | ✅ |
| DELETE | `/api/v1/admin/categories/{categoryId}` | `delete` | ✅ |

### `GET /api/v1/admin/categories` — Search categories

| Name | Type | Default |
|---|---|---|
| `parentId` | uuid | — |
| `type` | enum `INCOME`/`EXPENSE`/`BOTH` | — |
| `status` | enum `ACTIVE`/`INACTIVE`/`DELETED` | — |
| `defaultCategory`, `systemCategory`, `rootOnly` | boolean | — |
| `keyword` | string | — |
| `includeHidden` | boolean | `true` |
| `pageNumber` | int32 | `0` |
| `pageSize` | int32 | `20` |
| `sortBy` | string | `name` |
| `sortDirection` | string | `ASC` |

**Response:** `ApiResponse<CategorySearchResponse>` (`content[]`, `pageNumber`, `pageSize`, `totalElements`, `totalPages`, `first`, `last`).

### `POST /api/v1/admin/categories` — Create category

Body — `CreateCategoryRequest` (required: `name`, `categoryType`):

| Field | Type | Constraints |
|---|---|---|
| `parentId` | uuid | optional, nests under parent |
| `name` | string | ≤100 |
| `categoryType` | enum | `INCOME`/`EXPENSE`/`BOTH` |
| `icon` | string | ≤100 |
| `color` | string | ≤20, pattern `^#(?:[0-9a-fA-F]{3}\|[0-9a-fA-F]{6}\|[0-9a-fA-F]{8})$` |
| `systemCategory` | boolean | |
| `categoryKey` | string | ≤100, pattern `^[A-Z][A-Z0-9_]*$` |
| `defaultCategory` | boolean | |

**Response 201:** `ApiResponse<CategoryResponse>`.

### `PATCH /api/v1/admin/categories/{categoryId}` — Update category
Path: `categoryId` (uuid). Body — `UpdateCategoryRequest`: `name` (1–100), `categoryType`, `parentId`, `moveToRoot` (boolean — reparents to root), `icon`, `color` (same hex pattern), `defaultCategory`, `status`. **Response:** `ApiResponse<CategoryResponse>`.

### `DELETE /api/v1/admin/categories/{categoryId}` — Delete category
Path: `categoryId` (uuid). **Response:** `ApiResponse<void>`.

#### `CategoryResponse`
`id`, `parentId`, `parentName`, `userId`, `categoryKey`, `name`, `categoryType`, `icon`, `color`, `defaultCategory`, `systemCategory`, `ownedByCurrentUser`, `hiddenForCurrentUser`, `status`, `deletedAt`, `createdAt`, `updatedAt`.

---

## Admin AI Prompt Templates

_Skipped for now — out of scope for this pass. (10 endpoints under `/api/v1/admin/ai/prompt-templates/**`; also note none of them declared a `security` requirement in the source spec, unlike every other group, if this gets picked up later.)_

---

## Admin Reviews

| Method | Path | Operation ID | Auth |
|---|---|---|---|
| GET | `/api/v1/admin/reviews` | `searchReviews` | ✅ |
| GET | `/api/v1/admin/reviews/{id}` | `getReviewById` | ✅ |
| DELETE | `/api/v1/admin/reviews/{id}` | `deleteReview` | ✅ |
| PATCH | `/api/v1/admin/reviews/{id}/status` | `updateReviewStatus` | ✅ |

### `GET /api/v1/admin/reviews` — Search reviews

| Name | Type | Required |
|---|---|---|
| `type` | enum `SUGGESTION`/`BUG_REPORT`/`COMPLAINT`/`COMPLIMENT`/`GENERAL` | no |
| `status` | enum `PENDING`/`IN_REVIEW`/`RESOLVED`/`CLOSED` | no |
| `pageable` | `Pageable` object (`page`, `size`, `sort[]`) | **yes** |

Note: `pageable` is the one query "object" param in the spec — in practice this is Spring's standard `page`/`size`/`sort` query parameters, but it is flagged `required: true`, unlike every other listing endpoint's pagination params. Confirm the client always supplies at least `page`/`size`.

**Response:** `ApiResponse<PageResponse<ReviewResponse>>` (`content[]`, `page`, `size`, `totalElements`, `totalPages`, `first`, `last`).

### `GET /api/v1/admin/reviews/{id}` — Get review
Path: `id` (uuid). **Response:** `ApiResponse<ReviewResponse>`.

### `DELETE /api/v1/admin/reviews/{id}` — Delete review
Path: `id` (uuid). **Response:** `ApiResponse<void>`.

### `PATCH /api/v1/admin/reviews/{id}/status` — Update review status
Path: `id` (uuid). Body — `UpdateReviewStatusRequest` (required: `reviewStatus`): `{ reviewStatus: PENDING|IN_REVIEW|RESOLVED|CLOSED, latestReviewNote?: string }`. **Response:** `ApiResponse<ReviewResponse>`.

#### `ReviewResponse`
`id`, `userId`, `reviewType`, `title`, `description`, `screenshotUrl`, `uiRating`, `performanceRating`, `easeOfUseRating`, `featureRating`, `overallRating` (all int32 ratings), `reviewStatus`, `reviewedBy`, `latestReviewNote`, `reviewedAt`, `createdAt`, `updatedAt`.

---

## Admin Contact Us

| Method | Path | Operation ID | Auth |
|---|---|---|---|
| GET | `/api/v1/admin/contact-us` | `getContactMessages` | ✅ |
| GET | `/api/v1/admin/contact-us/{id}` | `getContactMessageById` | ✅ |

### `GET /api/v1/admin/contact-us` — List contact messages

Query parameters:

| Name | Type | Notes |
|---|---|---|
| `query` / `search` | string | Search by name, email, phone, subject, or message |
| `registeredUser` | boolean | Filter by registered user vs guest inquiries |
| `page` / `pageNumber` | int32 (≥0) | Page index (0-indexed) |
| `size` / `pageSize` | int32 (1–200) | Items per page |
| `sortBy` | string | Field to sort by (e.g. `createdAt`, `name`) |
| `sortDirection` | string | `ASC` / `DESC` |

**Response 200:** `ApiResponse<ContactMessagePage>`:

```jsonc
{
  "success": true,
  "message": "Contact messages retrieved successfully.",
  "data": {
    "content": [
      {
        "id": "21e1f22d-527d-4466-844c-f8fdb62a3b9c",
        "userId": null,
        "registeredUser": false,
        "name": "សុខ ដារ៉ា",
        "email": "dara@example.com",
        "phone": "012345678",
        "subject": "សំណួរអំពី iStash",
        "messagePreview": "ខ្ញុំចង់ដឹងព័ត៌មានបន្ថែមអំពី iStash។",
        "createdAt": "2026-08-21T22:27:37.373641Z"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "timestamp": "2026-08-24T08:42:35.850864744Z"
}
```

### `GET /api/v1/admin/contact-us/{contactId}` — Get contact message by ID

Path parameter: `contactId` (uuid/string).

**Response 200:** `ApiResponse<ContactMessage>`:

```jsonc
{
  "success": true,
  "message": "Contact message retrieved successfully.",
  "data": {
    "id": "21e1f22d-527d-4466-844c-f8fdb62a3b9c",
    "userId": null,
    "registeredUser": false,
    "name": "សុខ ដារ៉ា",
    "phone": "012345678",
    "email": "dara@example.com",
    "subject": "សំណួរអំពី iStash",
    "message": "ខ្ញុំចង់ដឹងព័ត៌មានបន្ថែមអំពី iStash។",
    "createdAt": "2026-08-21T22:27:37.373641Z"
  },
  "timestamp": "2026-08-24T08:56:17.647058944Z"
}
```

#### `ContactMessage`
`id`, `userId` (uuid or null), `registeredUser` (boolean), `name`, `phone`, `email`, `subject`, `message`, `messagePreview` (optional), `createdAt`.

---

## Admin Alert Rules

| Method | Path | Operation ID | Auth |
|---|---|---|---|
| GET | `/api/v1/admin/alert-rules` | `search_2` | ✅ |
| GET | `/api/v1/admin/alert-rules/{ruleId}` | `get_1` | ✅ |

### `GET /api/v1/admin/alert-rules` — List all alert rules

| Name | Type |
|---|---|
| `userId` | uuid |
| `alertType` | enum `DAILY_EXPENSE_REMINDER`/`BUDGET_THRESHOLD`/`SAVINGS_REMINDER`/`RECURRING_REMINDER`/`MONTHLY_SUMMARY` |
| `triggerType` | enum `TIME`/`THRESHOLD`/`EVENT`/`SCHEDULE` |
| `severity` | enum `INFO`/`WARNING`/`CRITICAL` |
| `enabled` | boolean |
| `referenceType` | enum `BUDGET`/`SAVINGS_GOAL`/`RECURRING_TRANSACTION` |
| `referenceId` | uuid |
| `pageNumber`, `pageSize`, `sortBy`, `sortDirection` | pagination |

**Response:** `PagedModel<AlertRuleResponse>`.

### `GET /api/v1/admin/alert-rules/{ruleId}` — Get alert rule
Path: `ruleId` (uuid). **Response:** `AlertRuleResponse` (no `ApiResponse` wrapper, unlike most other single-resource GETs).

#### `AlertRuleResponse`
`id`, `userId`, `ruleName`, `alertType`, `triggerType`, `referenceType`, `referenceId`, `severity`, `enabled`, `canDisable`, `reminderTime`, `thresholdPercentage` (number), `daysBefore` (int32), `frequency` (`DAILY`/`WEEKLY`/`MONTHLY`/`ONCE`), `ruleConfiguration` (free-form object), `nextTriggerAt`, `lastTriggeredAt`, `createdAt`, `updatedAt`.

---

## Response-wrapping inconsistencies (worth knowing when integrating)

| Group | Wrapped in `ApiResponse<T>`? |
|---|---|
| Users | ✅ all endpoints |
| Notifications | ❌ (`search` and `create`/`get` return bare `PagedModel`/`NotificationResponse`) |
| Currencies | ✅ all endpoints |
| Categories | ✅ all endpoints |
| Reviews | ✅ all endpoints |
| Alert Rules | ❌ both endpoints return bare `PagedModel`/`AlertRuleResponse` |

Clients (this admin frontend included) need per-endpoint handling rather than assuming a single global envelope.

## Enum quick reference

- **`AccountStatus`**: `ACTIVE`, `SUSPENDED`, `DELETED`
- **`Gender`**: `MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY`
- **`Role`**: `USER`, `ADMIN`
- **`NotificationType`**: `DAILY_REMINDER`, `BUDGET_WARNING`, `SAVINGS_REMINDER`, `RECURRING_REMINDER`, `MONTHLY_SUMMARY`, `EXPENSE_CATEGORY_REVIEW_REQUIRED`, `WALLET_INVITATION`, `WALLET_INVITATION_ACCEPTED`, `WALLET_INVITATION_DECLINED`, `WALLET_INVITATION_CANCELLED`, `WALLET_INVITATION_EXPIRED`, `WALLET_MEMBER_JOINED`, `WALLET_MEMBER_REMOVED`, `WALLET_ROLE_CHANGED`, `SHARED_TRANSACTION_CREATED`, `SHARED_TRANSACTION_UPDATED`, `SHARED_TRANSACTION_DELETED`, `SYSTEM`
- **`NotificationChannel`**: `IN_APP`, `EMAIL`
- **`DeliveryStatus`**: `PENDING`, `SENT`, `DELIVERED`, `FAILED`
- **`ReferenceType`** (notifications): `BUDGET`, `SAVINGS_GOAL`, `RECURRING_TRANSACTION`, `WALLET`, `WALLET_INVITATION`, `TRANSACTION`
- **`CurrencySyncStatus`**: `STARTED`, `SUCCESS`, `FAILED`
- **`CurrencyProviderStatus`**: `HEALTHY`, `STALE`, `UNAVAILABLE`, `SYNCHRONIZING`, `NEVER_SYNCED`
- **`CategoryType`**: `INCOME`, `EXPENSE`, `BOTH`
- **`CategoryStatus`**: `ACTIVE`, `INACTIVE`, `DELETED`
- **`ReviewType`**: `SUGGESTION`, `BUG_REPORT`, `COMPLAINT`, `COMPLIMENT`, `GENERAL`
- **`ReviewStatus`**: `PENDING`, `IN_REVIEW`, `RESOLVED`, `CLOSED`
- **`AlertType`**: `DAILY_EXPENSE_REMINDER`, `BUDGET_THRESHOLD`, `SAVINGS_REMINDER`, `RECURRING_REMINDER`, `MONTHLY_SUMMARY`
- **`AlertTriggerType`**: `TIME`, `THRESHOLD`, `EVENT`, `SCHEDULE`
- **`AlertSeverity`**: `INFO`, `WARNING`, `CRITICAL`
- **`AlertReferenceType`**: `BUDGET`, `SAVINGS_GOAL`, `RECURRING_TRANSACTION`
- **`AlertFrequency`**: `DAILY`, `WEEKLY`, `MONTHLY`, `ONCE`