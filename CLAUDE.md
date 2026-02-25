# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **software testing project** for class 261449 (Software Testing). The project focuses on creating comprehensive E2E tests for the **Mongkolkiri Health Hub** - a clinic patient examination system with two user roles:
- **Patients**: Login, view personal information, medical history, and medication history
- **Doctors**: Login, view patient information, record diagnoses/complaints, create treatment plans, prescribe medications, and export medical documents

## Package Manager

**Always use `pnpm`** - never use `npm` or `yarn`. The project is configured with `pnpm@10.28.0`.

## Application Under Test

- **URL**: https://pubestpubest.github.io/mongkolkiri_clinic-main/
- **Type**: React SPA (Single Page Application) hosted on GitHub Pages
- **Language**: Thai language UI ("เข้าสู่ระบบผู้ป่วย" for patient login, "เข้าสู่ระบบ" for doctor login)

## Testing Commands

### Run all tests
```bash
pnpm exec playwright test
```

### Run tests in headed mode (visible browser)
```bash
pnpm exec playwright test --headed
```

### Run tests for specific browser
```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

### Run specific test file
```bash
pnpm exec playwright test tests/patient/login.spec.ts
pnpm exec playwright test tests/doctor/record-diagnosis.spec.ts
```

### Run tests in debug mode
```bash
pnpm exec playwright test --debug
```

### View test report
```bash
pnpm exec playwright show-report
```

### Update Playwright browsers
```bash
pnpm exec playwright install
```

## Test Architecture

### Directory Structure
```
tests/
├── patient/       # E2E tests for patient user flows
├── doctor/        # E2E tests for doctor user flows
├── fixtures/      # Test data, test users, and page object models
└── utils/         # Shared helper functions (auth, navigation, etc.)
```

### Test Organization by User Stories

Tests are organized by user role and map to user stories in `backlog.md`:

**Patient Tests** (Sprint 1-2, High Priority):
1. Login/Sign up authentication
2. View personal information
3. View medical treatment history
4. View medication history

**Doctor Tests** (Sprint 1-2, High/Medium Priority):
1. Login/Sign up authentication
2. View patient personal information
3. Record diagnosis details
4. Record patient's chief complaint
5. Create treatment plans
6. Record prescription orders
7. Record medical procedure documents
8. Export medical documents as PDF

### Multi-Browser Testing

Tests run across 5 browser configurations:
- Desktop: Chromium, Firefox, WebKit (Safari)
- Mobile: Pixel 5 (Chrome), iPhone 12 (Safari)

### Test Configuration

- **Base URL**: Configured in `playwright.config.ts`
- **Parallel execution**: Enabled by default
- **Retries**: 2 retries on CI, 0 locally
- **Artifacts**: Screenshots and videos on failure, traces on first retry

## Test Data Management

- Store test users and credentials in `tests/fixtures/test-data.ts`
- Create page object models in `tests/fixtures/` for reusable page interactions
- Use auth helpers in `tests/utils/auth-helpers.ts` for login/signup flows

## Application Architecture

**Tech Stack:**
- Frontend: React 18 with TypeScript
- Routing: React Router v6 with basename `/mongkolkiri_clinic-main`
- Auth: Supabase (via `@/contexts/AuthContext`)
- UI: shadcn/ui + Tailwind CSS
- State: React Query (`@tanstack/react-query`)
- Toasts: Sonner

**Key Routes:**
- `/auth` - Role selection and login (doctor vs patient)
- `/` - Staff/Doctor dashboard (protected)
- `/patient` - Patient dashboard (protected)
- `/patients` - Patient list for staff
- `/patients/:patientId` - Patient detail page

**Auth Flow:**
1. `/auth` shows role selection cards (Doctor | Patient)
2. Click card → state-based form display (no route change)
3. Login → redirect to role-specific dashboard
   - Doctor/Staff → `/` (must have staff role in DB)
   - Patient → `/patient` (must have patient_accounts record)

## Element Selection Strategy

The application uses Thai language and standard Tailwind/shadcn-ui components without custom data-testid attributes. Use:
1. **Form inputs**: ID-based selectors (e.g., `#login-email`, `#patient-login-email`)
2. **Role selection**: Target `.cursor-pointer` cards with `hasText` filter
3. **Text content**: Use Thai text with `getByRole` or `getByText` for unique elements
4. **Tabs**: Use `role="tab"` with `aria-selected` and `data-state` attributes
5. **Toasts**: Target `[data-sonner-toast]` for error messages

## Backlog Reference

All test scenarios are derived from `backlog.md`. When creating new tests:
1. Reference the user story ID and description
2. Follow the sprint priority (High → Medium → Low)
3. Mark corresponding backlog items as "Done" when tests are implemented
4. Focus on "In progress" items in Sprint 2 for next test development
