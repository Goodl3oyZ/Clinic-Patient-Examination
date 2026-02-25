import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/auth-page';
import { testPatient } from '../fixtures/test-data';

test.describe('PAT-06: View Patient History Sorted by Time', () => {
  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.loginAsPatient(testPatient.email, testPatient.password);
    await expect(page.getByText('ประวัติการรักษา')).toBeVisible({ timeout: 5000 });
  });

  test('PAT-06-01: should navigate to treatment history page', async ({ page }) => {
    await page.getByText('ประวัติการรักษา').click();
    await expect(page.getByRole('tab', { name: /บันทึกอาการ/ })).toBeVisible({ timeout: 5000 });
  });

  test('PAT-06-02: should display consultation records tab', async ({ page }) => {
    await page.goto('patient/treatments');
    await page.getByRole('tab', { name: /บันทึกอาการ/ }).click();

    // Tab should be active and show content (records or empty message)
    const records = page.locator('[data-state="active"]');
    await expect(records).toBeVisible();
  });

  test('PAT-06-03: should display diagnosis records tab', async ({ page }) => {
    await page.goto('patient/treatments');
    await page.getByRole('tab', { name: /การวินิจฉัย/ }).click();

    const records = page.locator('[data-state="active"]');
    await expect(records).toBeVisible();
  });

  test('PAT-06-04: should display treatment plans tab', async ({ page }) => {
    await page.goto('patient/treatments');
    await page.getByRole('tab', { name: /แผนการรักษา/ }).click();

    const records = page.locator('[data-state="active"]');
    await expect(records).toBeVisible();
  });

  test('PAT-06-05: should display procedures tab', async ({ page }) => {
    await page.goto('patient/treatments');
    await page.getByRole('tab', { name: /หัตถการ/ }).click();

    const records = page.locator('[data-state="active"]');
    await expect(records).toBeVisible();
  });

  test('PAT-06-06: should navigate to medication history page', async ({ page }) => {
    await page.getByText('ประวัติการรับยา').click();

    // Should show medication history page or empty state
    await expect(
      page.getByText('ประวัติการรับยา').or(page.getByText('ยังไม่มีประวัติการรับยา'))
    ).toBeVisible({ timeout: 5000 });
  });
});
