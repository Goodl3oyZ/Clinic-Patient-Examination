import { test, expect } from '@playwright/test';

test.describe('SEC-01: Unauthorized Access Blocked', () => {
  test('SEC-01-01: should redirect unauthenticated user from doctor dashboard', async ({ page }) => {
    await page.goto('');
    // Should redirect to auth page or show login
    await expect(page.getByText('เข้าสู่ระบบ').first()).toBeVisible({ timeout: 5000 });
  });

  test('SEC-01-02: should redirect unauthenticated user from patient dashboard', async ({ page }) => {
    await page.goto('patient');
    await expect(page.getByText('เข้าสู่ระบบ').first()).toBeVisible({ timeout: 5000 });
  });

  test('SEC-01-03: should redirect unauthenticated user from patients list', async ({ page }) => {
    await page.goto('patients');
    await expect(page.getByText('เข้าสู่ระบบ').first()).toBeVisible({ timeout: 5000 });
  });

  test('SEC-01-04: should redirect unauthenticated user from patient profile', async ({ page }) => {
    await page.goto('patient/profile');
    await expect(page.getByText('เข้าสู่ระบบ').first()).toBeVisible({ timeout: 5000 });
  });

  test('SEC-01-05: should redirect unauthenticated user from treatment history', async ({ page }) => {
    await page.goto('patient/treatments');
    await expect(page.getByText('เข้าสู่ระบบ').first()).toBeVisible({ timeout: 5000 });
  });
});
