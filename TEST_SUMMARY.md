# E2E Test Suite Summary

## Overview
This document summarizes the Playwright E2E test suite created for the Mongkolkiri Health Hub clinic patient examination system.

## Test Structure

### Directory Organization
```
tests/
├── doctor/              # Doctor user flow tests
│   └── login.spec.ts    # Doctor authentication tests (12 test cases)
├── patient/             # Patient user flow tests (to be implemented)
├── fixtures/            # Reusable test components
│   ├── auth-page.ts     # Page Object Model for auth flows
│   └── test-data.ts     # Test data and credentials
└── utils/               # Helper functions (to be implemented)
```

## Implemented Tests

### Doctor Login Tests (`tests/doctor/login.spec.ts`)

**12 comprehensive test cases covering:**

1. **Role Selection Page Tests**
   - ✅ Display doctor role card on entry page
   - ✅ Display patient role card on entry page

2. **Navigation Tests**
   - ✅ Navigate to doctor login form when clicking card
   - ✅ Navigate back to role selection page

3. **Form Validation Tests**
   - ✅ Correct form elements (email, password inputs)
   - ✅ Validation for empty form submission
   - ✅ Validation for invalid email format

4. **Authentication Tests**
   - ✅ Successfully login with valid credentials
   - ✅ Handle login with invalid credentials

5. **Tab Switching Tests**
   - ✅ Switch between login and signup tabs
   - ✅ Preserve form state when switching tabs

6. **UI/UX Tests**
   - ✅ Correct labels and placeholders

## Page Object Model

### AuthPage (`tests/fixtures/auth-page.ts`)

**Locators:**
- `doctorCard`, `patientCard` - Role selection cards
- `doctorEmailInput`, `doctorPasswordInput` - Doctor login form
- `patientEmailInput`, `patientPasswordInput` - Patient login form
- `loginTab`, `signupTab` - Tab navigation
- `backButton` - Navigation back to role selection

**Methods:**
- `goto()` - Navigate to /auth page
- `clickDoctorCard()` - Select doctor role
- `clickPatientCard()` - Select patient role
- `fillDoctorLoginForm(email, password)` - Fill doctor credentials
- `fillPatientLoginForm(email, password)` - Fill patient credentials
- `loginAsDoctor(email, password)` - Complete doctor login flow
- `loginAsPatient(email, password)` - Complete patient login flow
- `switchToSignup()`, `switchToLogin()` - Tab switching

## Test Data

### Test Credentials (`tests/fixtures/test-data.ts`)
- `testDoctor` - Valid doctor test account
- `testPatient` - Valid patient test account
- `invalidCredentials` - Invalid credentials for negative testing
- `medicalData` - Sample medical data for future tests

## Running Tests

### All Tests
```bash
pnpm test                    # Run all tests
pnpm test:headed             # Run with visible browser
pnpm test:ui                 # Run with Playwright UI
```

### Specific Tests
```bash
pnpm test:doctor             # Run only doctor tests
pnpm test:patient            # Run only patient tests (when implemented)
```

### Browser-Specific
```bash
pnpm test:chromium           # Chrome only
pnpm test:firefox            # Firefox only
pnpm test:webkit             # Safari only
```

### Debug Mode
```bash
pnpm test:debug              # Debug with Playwright Inspector
```

### View Reports
```bash
pnpm report                  # View HTML test report
```

## Next Steps

### Immediate Tasks
1. Install system dependencies: `sudo pnpm exec playwright install-deps`
2. Update test credentials in `tests/fixtures/test-data.ts` with actual test accounts
3. Run and verify doctor login tests pass

### Future Test Implementation (Based on backlog.md)

#### Patient Tests (Sprint 1-2)
- [ ] Patient login/signup
- [ ] View personal information
- [ ] View medical treatment history
- [ ] View medication history

#### Doctor Tests (Sprint 2)
- [ ] Record diagnosis details
- [ ] Record patient's chief complaint
- [ ] Create treatment plans
- [ ] Record prescription orders
- [ ] Record medical procedure documents
- [ ] Export medical documents as PDF

## Configuration

### Playwright Config (`playwright.config.ts`)
- **Base URL**: `https://pubestpubest.github.io/mongkolkiri_clinic-main`
- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Artifacts**: Screenshots and videos on failure, traces on retry

## Notes

### Application Flow
1. User visits `/auth` - sees role selection (Doctor vs Patient)
2. Click role card → shows login/signup form for that role
3. Login → redirects to respective dashboard
   - Doctor → `/` (Index/Dashboard)
   - Patient → `/patient` (PatientDashboard)

### Key Selectors
- Role cards use `.cursor-pointer` class with `hasText` filter
- Form inputs use specific IDs:
  - Doctor: `#login-email`, `#login-password`
  - Patient: `#patient-login-email`, `#patient-login-password`
- Tabs use `role="tab"` with Thai text
- Error messages use Sonner toast with `[data-sonner-toast]` attribute

### Thai Language UI
All UI text is in Thai language:
- "เข้าสู่ระบบ" = Login
- "เข้าสู่ระบบผู้ป่วย" = Patient Login
- "ลงทะเบียนบัญชี" = Sign up
- "กลับ" = Back
- "อีเมล" = Email
- "รหัสผ่าน" = Password
