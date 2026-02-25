import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/auth-page';
import { testPatient } from '../fixtures/test-data';

test.describe('PAT-04: Edit Patient Info', () => {
  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.loginAsPatient(testPatient.email, testPatient.password);
    await expect(page.getByText('ประวัติการรักษา')).toBeVisible({ timeout: 5000 });
    await page.goto('patient/profile');
  });

  test('PAT-04-01: should display read-only personal information', async ({ page }) => {
    await expect(page.getByText('HN:')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('ข้อมูลเหล่านี้ไม่สามารถแก้ไขได้')).toBeVisible();
  });

  test('PAT-04-02: should edit phone and save', async ({ page }) => {
    await page.getByRole('button', { name: 'แก้ไข' }).click();

    const phoneInput = page.locator('#phone');
    await expect(phoneInput).toBeVisible();
    await phoneInput.clear();
    await phoneInput.fill('0899999999');

    await page.getByRole('button', { name: 'บันทึก' }).click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: 'บันทึกข้อมูลสำเร็จ' });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('PAT-04-03: should cancel editing without saving', async ({ page }) => {
    await page.getByRole('button', { name: 'แก้ไข' }).click();
    await page.getByRole('button', { name: 'ยกเลิก' }).click();

    await expect(page.getByRole('button', { name: 'แก้ไข' })).toBeVisible();
  });
});
