import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/auth-page';
import { testDoctor } from '../fixtures/test-data';

test.describe('EXAM-03: Doctor Register Patient & PAT-05: Validation', () => {
  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.loginAsDoctor(testDoctor.email, testDoctor.password);
    await expect(page.getByRole('heading', { name: 'แดชบอร์ด' })).toBeVisible({ timeout: 5000 });
    await page.goto('register');
    await expect(page.getByRole('heading', { name: 'ลงทะเบียนผู้ป่วยใหม่' })).toBeVisible();
  });

  test('PAT-05-01: should show validation errors on empty form submission', async ({ page }) => {
    await page.getByRole('button', { name: 'บันทึกข้อมูล' }).click();

    await expect(page.getByText('กรุณากรอกชื่อ')).toBeVisible();
    await expect(page.getByText('กรุณากรอกนามสกุล')).toBeVisible();
    await expect(page.getByText('กรุณาเลือกวันเกิด')).toBeVisible();
  });

  test('PAT-05-02: should show error for national ID that is not 13 digits', async ({ page }) => {
    const unique = Date.now();
    await page.locator('#first_name').fill(`ทดสอบ${unique}`);
    await page.locator('#last_name').fill(`นามสกุล${unique}`);
    await page.locator('#dob').fill('1990-06-15');
    await page.locator('#national_id').fill('123456789');
    await page.getByRole('button', { name: 'บันทึกข้อมูล' }).click();

    await expect(page.getByText('เลขบัตรประชาชนต้องมี 13 หลัก')).toBeVisible();
  });

  test('EXAM-03-01: should auto-calculate age from date of birth', async ({ page }) => {
    await page.locator('#dob').fill('1990-01-01');
    await expect(page.getByText(/\d+ ปี/)).toBeVisible();
  });

  test('EXAM-03-02: should add and remove allergy', async ({ page }) => {
    await page.getByPlaceholder('กรอกชื่อสารที่แพ้').fill('เพนิซิลิน');
    await page.getByRole('button', { name: 'เพิ่ม' }).click();
    await expect(page.getByText('เพนิซิลิน')).toBeVisible();

    await page.locator('div').filter({ hasText: /^เพนิซิลิน$/ }).getByRole('button').click();
    await expect(page.getByText('เพนิซิลิน')).not.toBeVisible();
  });

  test('EXAM-03-03: should not add duplicate allergy', async ({ page }) => {
    const allergyInput = page.getByPlaceholder('กรอกชื่อสารที่แพ้');
    await allergyInput.fill('เพนิซิลิน');
    await page.getByRole('button', { name: 'เพิ่ม' }).click();
    await allergyInput.fill('เพนิซิลิน');
    await page.getByRole('button', { name: 'เพิ่ม' }).click();

    await expect(page.getByText('เพนิซิลิน')).toHaveCount(1);
  });

  test('EXAM-03-04: should register patient with all fields and redirect to dashboard', async ({ page }) => {
    const unique = Date.now();
    await page.locator('#first_name').fill(`ทดสอบ${unique}`);
    await page.locator('#last_name').fill(`นามสกุล${unique}`);
    await page.locator('#dob').fill('1990-06-15');
    await page.locator('#national_id').fill(String(unique));
    await page.locator('#phone').fill(String(unique).slice(-10));
    await page.locator('#address').fill('123 ถนนทดสอบ ตำบลทดสอบ อำเภอทดสอบ จังหวัดทดสอบ 10000');

    await page.getByPlaceholder('กรอกชื่อสารที่แพ้').fill('เพนิซิลิน');
    await page.getByRole('button', { name: 'เพิ่ม' }).click();

    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'บันทึกข้อมูล' }).click();

    await expect(page.getByRole('heading', { name: 'แดชบอร์ด' })).toBeVisible({ timeout: 5000 });
  });

  test('EXAM-03-05: should cancel and return to dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'ยกเลิก' }).click();
    await expect(page.getByRole('heading', { name: 'แดชบอร์ด' })).toBeVisible();
  });
});
