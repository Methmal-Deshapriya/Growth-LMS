import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const apiOrigin = new URL(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1",
).origin;

const student = {
  id: "90000000-0000-4000-8000-000000000001",
  firstName: "Browser",
  lastName: "Student",
  email: "browser@example.test",
  role: "STUDENT",
  emailVerified: true,
  permissions: [
    "COURSES_SELF_ENROLL",
    "PROJECTS_SUBMIT",
    "PROJECTS_VIEW_OWN",
    "PROJECTS_EDIT_OWN",
  ],
  createdAt: "2026-08-15T00:00:00.000Z",
};

async function authenticateStudent(context: BrowserContext, page: Page) {
  await context.addCookies([
    {
      name: "token",
      value: "browser-test-session",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
    },
  ]);
  await page.route("**/auth/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: student }),
    }),
  );
}

function classroomResponse({
  enrollmentId,
  deliveryMode,
  courseTitle,
  sessionTitle,
}: {
  enrollmentId: string;
  deliveryMode: "COHORT" | "SELF_PACED";
  courseTitle: string;
  sessionTitle: string;
}) {
  return {
    success: true,
    data: {
      enrollment: {
        id: enrollmentId,
        status: "ACTIVE",
        source: deliveryMode === "COHORT" ? "ADMIN" : "SELF",
        deliveryMode,
        course: {
          id: `${enrollmentId}-course`,
          slug: "browser-course",
          title: courseTitle,
          summary: "Browser release-gate fixture",
          level: "BEGINNER",
          levelLabel: "Beginner",
          durationValue: 4,
          durationUnit: "WEEKS",
          durationLabel: "4 weeks",
          accessType: deliveryMode === "COHORT" ? "PAID" : "FREE",
          enrollmentStatus: "OPEN",
          price: deliveryMode === "COHORT" ? 1000 : 0,
          currency: "LKR",
          certificateEnabled: false,
        },
        batch:
          deliveryMode === "COHORT"
            ? {
                id: "batch-browser",
                name: "August 2026",
                code: "BROWSER-AUG",
                status: "ACTIVE",
                startDate: "2026-08-01",
                expectedEndDate: "2026-12-01",
                timezone: "Asia/Colombo",
              }
            : null,
      },
      sessions: [
        {
          courseSessionId: `${enrollmentId}-session`,
          orderIndex: 0,
          title: sessionTitle,
          description: "Available only through this enrollment fixture.",
          recordingUrl: "https://recordings.example.test/session",
          materialUrl: null,
          quizUrl: null,
          feedbackUrl: null,
          durationMinutes: 60,
          sessionStatus: "READY",
          availableAt: "2026-08-15T00:00:00.000Z",
          completed: false,
          completedAt: null,
        },
      ],
      progress: {
        enrollmentId,
        courseId: `${enrollmentId}-course`,
        completedCount: 0,
        availableSessionCount: 1,
        progressPercent: 0,
      },
    },
  };
}

test("a stale HttpOnly cookie cannot trap public recovery routes", async ({
  context,
  page,
}) => {
  await context.addCookies([
    {
      name: "token",
      value: "expired-or-invalid",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
    },
  ]);
  await page.route("**/auth/me", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ success: false, code: "UNAUTHORIZED" }),
    }),
  );

  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/reset-password?token=sample");
  await expect(page).toHaveURL(/\/reset-password\?token=sample$/);
});

test("production CSP permits the configured API origin", async ({ page }) => {
  const response = await page.goto("/");
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(csp).toContain(`connect-src 'self' ${apiOrigin}`);
});

test("an unavailable API does not block the public site", async ({ page }) => {
  await page.route("**/auth/me", (route) => route.abort("connectionrefused"));

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Welcome to/i })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test("student sessions are denied by the admin route layout", async ({
  context,
  page,
}) => {
  await authenticateStudent(context, page);

  await page.goto("/admin/services");
  await expect(
    page.getByRole("heading", { name: "Administration access required" }),
  ).toBeVisible();
});

test("free enrollment return intent opens the self-paced classroom", async ({
  context,
  page,
}) => {
  await authenticateStudent(context, page);
  await page.route("**/courses/free-course/enroll", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: { id: "free-enrollment" } }),
    }),
  );
  await page.route("**/enrollments/free-enrollment/classroom", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        classroomResponse({
          enrollmentId: "free-enrollment",
          deliveryMode: "SELF_PACED",
          courseTitle: "Free Browser Learning",
          sessionTitle: "Free session available immediately",
        }),
      ),
    }),
  );

  await page.goto("/dashboard?enrollCourse=free-course");
  await expect(page).toHaveURL(/\/my-courses\/free-enrollment$/);
  await expect(
    page.getByRole("heading", { name: "Free Browser Learning" }),
  ).toBeVisible();
  await expect(page.getByText("Free session available immediately")).toBeVisible();
});

test("paid classroom renders only the sessions returned for its enrollment", async ({
  context,
  page,
}) => {
  await authenticateStudent(context, page);
  await page.route("**/enrollments/paid-enrollment/classroom", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        classroomResponse({
          enrollmentId: "paid-enrollment",
          deliveryMode: "COHORT",
          courseTitle: "Paid Browser Bootcamp",
          sessionTitle: "Released cohort session",
        }),
      ),
    }),
  );

  await page.goto("/my-courses/paid-enrollment");
  await expect(
    page.getByRole("heading", { name: "Paid Browser Bootcamp" }),
  ).toBeVisible();
  await expect(page.getByText("Released cohort session")).toBeVisible();
  await expect(page.getByText("Another batch private session")).toHaveCount(0);
});
