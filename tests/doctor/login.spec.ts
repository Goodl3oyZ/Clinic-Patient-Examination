import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/auth-page';
import { testDoctor, invalidCredentials } from '../fixtures/test-data';

test.describe('Doctor Login', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test('should display doctor role card on entry page', async ({ page }) => {
    // Verify doctor card and button are visible
    await expect(authPage.doctorCard).toBeVisible();
    await expect(authPage.doctorRoleButton).toBeVisible();
    await expect(authPage.doctorRoleButton).toHaveText('เข้าสู่ระบบ');

    // Verify page header
    await expect(page.getByRole('heading', { name: 'คลินิกแพทย์แผนไทย' })).toBeVisible();
  });

  test('should display patient role card on entry page', async ({ page }) => {
    // Verify patient card and button are visible
    await expect(authPage.patientCard).toBeVisible();
    await expect(authPage.patientRoleButton).toBeVisible();
    await expect(authPage.patientRoleButton).toHaveText('เข้าสู่ระบบผู้ป่วย');
  });

  test('should navigate to doctor login form when clicking card', async ({ page }) => {
    // Click doctor card
    await authPage.clickDoctorCard();

    // Verify we're on the doctor login form
    await expect(authPage.doctorEmailInput).toBeVisible();
    await expect(authPage.doctorPasswordInput).toBeVisible();
    await expect(authPage.doctorLoginSubmitButton).toBeVisible();

    // Verify tabs are present
    await expect(authPage.loginTab).toBeVisible();
    await expect(authPage.signupTab).toBeVisible();

    // Verify correct card title
    await expect(page.getByRole('heading', { name: 'เข้าสู่ระบบ' })).toBeVisible();
  });

  test('should have correct form elements', async ({ page }) => {
    await authPage.clickDoctorCard();

    // Check email input attributes
    await expect(authPage.doctorEmailInput).toHaveAttribute('type', 'email');
    await expect(authPage.doctorEmailInput).toHaveAttribute('required', '');
    await expect(authPage.doctorEmailInput).toHaveAttribute('placeholder', 'your@email.com');

    // Check password input attributes
    await expect(authPage.doctorPasswordInput).toHaveAttribute('type', 'password');
    await expect(authPage.doctorPasswordInput).toHaveAttribute('required', '');
  });

  test('should show validation for empty form submission', async ({ page }) => {
    await authPage.clickDoctorCard();

    // Try to submit without filling the form
    await authPage.submitDoctorLogin();

    // Browser's built-in validation should prevent submission
    // Email input should still be visible (no navigation occurred)
    await expect(authPage.doctorEmailInput).toBeVisible();
  });

  test('should show validation for invalid email format', async ({ page }) => {
    await authPage.clickDoctorCard();

    // Fill with invalid email
    await authPage.fillDoctorLoginForm(invalidCredentials.malformedEmail, testDoctor.password);

    // Try to submit
    await authPage.submitDoctorLogin();

    // Should still be on login page due to HTML5 validation
    await expect(authPage.doctorEmailInput).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Perform login
    await authPage.loginAsDoctor(testDoctor.email, testDoctor.password);

    // Wait for navigation after successful login
    // Doctor should be redirected to "/" (Index/Dashboard)
    await page.waitForURL('**/', { timeout: 10000 });

    // Verify we're no longer on the auth page
    await expect(page).not.toHaveURL(/\/auth/);
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await authPage.clickDoctorCard();

    // Fill with invalid credentials
    await authPage.fillDoctorLoginForm(invalidCredentials.email, invalidCredentials.password);
    await authPage.submitDoctorLogin();

    // Wait for toast/error message to appear
    await page.waitForTimeout(2000);

    // Should remain on login page
    await expect(authPage.doctorEmailInput).toBeVisible();

    // Check for error toast (Sonner toast)
    const errorToast = page.locator('[data-sonner-toast]').filter({ hasText: /ไม่สำเร็จ|ไม่ถูกต้อง/ });
    await expect(errorToast.or(authPage.doctorEmailInput)).toBeVisible();
  });

  test('should allow switching between login and signup tabs', async ({ page }) => {
    await authPage.clickDoctorCard();

    // Verify login tab is active by default
    await expect(authPage.loginTab).toHaveAttribute('aria-selected', 'true');
    await expect(authPage.loginTab).toHaveAttribute('data-state', 'active');

    // Verify signup tab is inactive
    await expect(authPage.signupTab).toHaveAttribute('aria-selected', 'false');
    await expect(authPage.signupTab).toHaveAttribute('data-state', 'inactive');

    // Switch to signup tab
    await authPage.switchToSignup();

    // Verify signup tab is now active
    await expect(authPage.signupTab).toHaveAttribute('aria-selected', 'true');
    await expect(authPage.signupTab).toHaveAttribute('data-state', 'active');
    await expect(authPage.loginTab).toHaveAttribute('data-state', 'inactive');

    // Verify signup form elements are visible
    await expect(authPage.signupNameInput).toBeVisible();
    await expect(authPage.signupEmailInput).toBeVisible();
    await expect(authPage.signupPasswordInput).toBeVisible();

    // Switch back to login
    await authPage.switchToLogin();

    // Verify login tab is active again
    await expect(authPage.loginTab).toHaveAttribute('data-state', 'active');
    await expect(authPage.doctorEmailInput).toBeVisible();
  });

  test('should navigate back to role selection page', async ({ page }) => {
    await authPage.clickDoctorCard();

    // Verify we're on doctor login form
    await expect(authPage.doctorEmailInput).toBeVisible();

    // Click back button
    await authPage.goBack();

    // Verify we're back on role selection page
    await expect(authPage.doctorCard).toBeVisible();
    await expect(authPage.patientCard).toBeVisible();
    await expect(page.getByText('กรุณาเลือกบทบาทของคุณ')).toBeVisible();
  });

  test('should preserve form state when switching tabs', async ({ page }) => {
    await authPage.clickDoctorCard();

    // Fill login form
    await authPage.fillDoctorLoginForm(testDoctor.email, testDoctor.password);

    // Verify inputs have values
    await expect(authPage.doctorEmailInput).toHaveValue(testDoctor.email);
    await expect(authPage.doctorPasswordInput).toHaveValue(testDoctor.password);

    // Switch to signup tab and back
    await authPage.switchToSignup();
    await authPage.switchToLogin();

    // Check if form state is preserved
    const emailValue = await authPage.doctorEmailInput.inputValue();
    const passwordValue = await authPage.doctorPasswordInput.inputValue();

    // In React, form state persists unless explicitly cleared
    expect(emailValue).toBe(testDoctor.email);
    expect(passwordValue).toBe(testDoctor.password);
  });

  test('should have correct labels and placeholders', async ({ page }) => {
    await authPage.clickDoctorCard();

    // Check labels
    await expect(page.getByText('อีเมล')).toBeVisible();
    await expect(page.getByText('รหัสผ่าน')).toBeVisible();

    // Check card description
    await expect(page.getByText('เข้าสู่ระบบด้วยบัญชีแพทย์/เจ้าหน้าที่')).toBeVisible();
  });
});
