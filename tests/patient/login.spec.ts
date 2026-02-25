import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/auth-page';
import { testPatient, invalidCredentials } from '../fixtures/test-data';

test.describe('PAT-02: Patient Login', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
    await authPage.clickPatientCard();
  });

  test('PAT-02-01: should not submit with empty form', async ({ page }) => {
    await authPage.submitPatientLogin();
    await expect(authPage.patientEmailInput).toBeVisible();
  });

  test('PAT-02-02: should show error toast on invalid credentials', async ({ page }) => {
    await authPage.fillPatientLoginForm(invalidCredentials.email, invalidCredentials.password);
    await authPage.submitPatientLogin();

    const errorToast = page.locator('[data-sonner-toast]').filter({ hasText: 'เข้าสู่ระบบไม่สำเร็จ' });
    await expect(errorToast).toBeVisible({ timeout: 5000 });
    await expect(errorToast).toContainText('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    await expect(authPage.patientEmailInput).toBeVisible();
  });

  test('PAT-02-03: should redirect to patient dashboard on valid credentials', async ({ page }) => {
    await authPage.fillPatientLoginForm(testPatient.email, testPatient.password);
    await authPage.submitPatientLogin();

    await expect(page.getByText('ประวัติการรักษา')).toBeVisible({ timeout: 5000 });
    await expect(page).not.toHaveURL(/\/auth/);
  });
});
