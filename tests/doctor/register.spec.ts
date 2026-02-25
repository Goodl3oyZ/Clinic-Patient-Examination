import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/auth-page';

test.describe('EXAM-01: Doctor Register', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
    await authPage.clickDoctorCard();
    await authPage.switchToSignup();
  });

  test('EXAM-01-01: should not submit with empty form', async ({ page }) => {
    await authPage.submitSignup();
    await expect(authPage.signupNameInput).toBeVisible();
  });

  test('EXAM-01-02: should show error toast when password is shorter than 6 characters', async ({ page }) => {
    await authPage.fillSignupForm('ทดสอบ แพทย์', 'doctor@example.com', '123');
    await authPage.submitSignup();

    const errorToast = page.locator('[data-sonner-toast]').filter({ hasText: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });

  test('EXAM-01-03: should show success toast on valid registration', async ({ page }) => {
    const uniqueEmail = `doctor.test+${Date.now()}@example.com`;
    await authPage.fillSignupForm('ทดสอบ แพทย์', uniqueEmail, 'password123');
    await authPage.submitSignup();

    const successToast = page.locator('[data-sonner-toast]').filter({ hasText: 'ลงทะเบียนสำเร็จ' });
    await expect(successToast).toBeVisible({ timeout: 5000 });
    await expect(successToast).toContainText('กรุณาติดต่อผู้ดูแลระบบเพื่อเปิดใช้งานบัญชี');
  });
});
