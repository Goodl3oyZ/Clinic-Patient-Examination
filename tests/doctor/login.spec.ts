import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/auth-page';
import { testDoctor, invalidCredentials } from '../fixtures/test-data';

test.describe('EXAM-02: Doctor Login', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
    await authPage.clickDoctorCard();
  });

  test('EXAM-02-01: should not submit with empty form', async ({ page }) => {
    await authPage.submitDoctorLogin();
    await expect(authPage.doctorEmailInput).toBeVisible();
  });

  test('EXAM-02-02: should show error toast on invalid credentials', async ({ page }) => {
    await authPage.fillDoctorLoginForm(invalidCredentials.email, invalidCredentials.password);
    await authPage.submitDoctorLogin();

    const errorToast = page.locator('[data-sonner-toast]').filter({ hasText: 'เข้าสู่ระบบไม่สำเร็จ' });
    await expect(errorToast).toBeVisible({ timeout: 5000 });
    await expect(errorToast).toContainText('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    await expect(authPage.doctorEmailInput).toBeVisible();
  });

  test('EXAM-02-03: should redirect to dashboard on valid credentials', async ({ page }) => {
    await authPage.fillDoctorLoginForm(testDoctor.email, testDoctor.password);
    await authPage.submitDoctorLogin();

    await expect(page.getByRole('heading', { name: 'แดชบอร์ด' })).toBeVisible({ timeout: 5000 });
    await expect(page).not.toHaveURL(/\/auth/);
  });
});
