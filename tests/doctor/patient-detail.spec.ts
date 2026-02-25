import { test, expect } from '@playwright/test';
import { AuthPage } from '../fixtures/auth-page';
import { testDoctor, testPatientRecord } from '../fixtures/test-data';

const today = new Date().toISOString().split('T')[0];

/** Helper: login as doctor, navigate to patient list, search, and open patient detail */
async function openPatientDetail(page: import('@playwright/test').Page) {
  const authPage = new AuthPage(page);
  await authPage.loginAsDoctor(testDoctor.email, testDoctor.password);
  await expect(page.getByRole('heading', { name: 'แดชบอร์ด' })).toBeVisible({ timeout: 5000 });

  await page.goto('patients');
  await expect(page.getByRole('heading', { name: 'รายชื่อผู้ป่วย', exact: true })).toBeVisible();
  await page.getByPlaceholder('ค้นหาผู้ป่วย (ชื่อ, HN, เลขบัตรประชาชน)').fill(testPatientRecord.searchName);
  await page.getByRole('button', { name: 'ดูข้อมูล' }).first().click();
  await expect(page.getByRole('tab', { name: 'บันทึกอาการ' })).toBeVisible({ timeout: 5000 });
}

test.describe('EXAM-14: View Patient Info', () => {
  test('EXAM-14-01: should find patient by name search', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.loginAsDoctor(testDoctor.email, testDoctor.password);
    await expect(page.getByRole('heading', { name: 'แดชบอร์ด' })).toBeVisible({ timeout: 5000 });

    await page.goto('patients');
    await page.getByPlaceholder('ค้นหาผู้ป่วย (ชื่อ, HN, เลขบัตรประชาชน)').fill(testPatientRecord.searchName);

    await expect(page.getByText(`${testPatientRecord.firstName} ${testPatientRecord.lastName}`)).toBeVisible();
  });

  test('EXAM-14-02: should display patient detail with all tabs', async ({ page }) => {
    await openPatientDetail(page);

    await expect(page.getByText(`${testPatientRecord.firstName} ${testPatientRecord.lastName}`)).toBeVisible();
    await expect(page.getByRole('tab', { name: 'บันทึกอาการ' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'การวินิจฉัย' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'แผนการรักษา' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'หัตถการ' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'ประวัติยา' })).toBeVisible();
  });
});

test.describe('EXAM-04: Record Consultation', () => {
  test('EXAM-04-01: should add consultation note', async ({ page }) => {
    await openPatientDetail(page);

    await page.getByRole('button', { name: 'เพิ่มบันทึกอาการ' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('เพิ่มบันทึกอาการใหม่')).toBeVisible();

    await dialog.locator('#consultation_date').fill(today);
    await dialog.locator('#chief_complaint').fill('ปวดหัว เวียนศีรษะ 3 วัน');
    await dialog.locator('#blood_pressure').fill('120/80');
    await dialog.locator('#heart_rate').fill('80');
    await dialog.locator('#temperature').fill('36.5');

    await dialog.getByRole('button', { name: 'บันทึก' }).click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: 'บันทึกอาการสำเร็จ' });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-09: Delete Consultation', () => {
  test('EXAM-09-01: should delete consultation record', async ({ page }) => {
    await openPatientDetail(page);

    // Ensure there is at least one record, then delete it
    await page.locator('button[class*="text-destructive"]').first().click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: /ลบ.*สำเร็จ/ });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-05: Record Diagnosis', () => {
  test('EXAM-05-01: should add diagnosis', async ({ page }) => {
    await openPatientDetail(page);
    await page.getByRole('tab', { name: 'การวินิจฉัย' }).click();

    await page.getByRole('button', { name: 'เพิ่มการวินิจฉัย' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('เพิ่มการวินิจฉัยใหม่')).toBeVisible();

    await dialog.locator('#diagnosis_date').fill(today);
    await dialog.locator('#icd10_code').fill('J06.9');
    await dialog.locator('#description').fill('Upper respiratory infection');

    await dialog.getByRole('button', { name: 'บันทึก' }).click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: 'บันทึกการวินิจฉัยสำเร็จ' });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-10: Delete Diagnosis', () => {
  test('EXAM-10-01: should delete diagnosis record', async ({ page }) => {
    await openPatientDetail(page);
    await page.getByRole('tab', { name: 'การวินิจฉัย' }).click();

    await page.locator('button[class*="text-destructive"]').first().click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: 'ลบการวินิจฉัยสำเร็จ' });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-06: Record Treatment Plan', () => {
  test('EXAM-06-01: should add treatment plan', async ({ page }) => {
    await openPatientDetail(page);
    await page.getByRole('tab', { name: 'แผนการรักษา' }).click();

    await page.getByRole('button', { name: 'เพิ่มแผนการรักษา' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('เพิ่มแผนการรักษาใหม่')).toBeVisible();

    await dialog.locator('#plan_date').fill(today);
    await dialog.getByRole('combobox').click();
    await page.getByRole('option').first().click();
    await dialog.locator('#step_details').fill('ล้างสารพิษด้วยสมุนไพรไทย');
    await dialog.locator('#duration').fill('7 วัน');

    await dialog.getByRole('button', { name: 'บันทึก' }).click();

    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-11: Delete Treatment Plan', () => {
  test('EXAM-11-01: should delete treatment plan record', async ({ page }) => {
    await openPatientDetail(page);
    await page.getByRole('tab', { name: 'แผนการรักษา' }).click();

    await page.locator('button[class*="text-destructive"]').first().click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: /ลบ.*สำเร็จ/ });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-07: Record Procedure', () => {
  test('EXAM-07-01: should add procedure', async ({ page }) => {
    await openPatientDetail(page);
    await page.getByRole('tab', { name: 'หัตถการ' }).click();

    await page.getByRole('button', { name: 'เพิ่มหัตถการ' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('เพิ่มบันทึกหัตถการ')).toBeVisible();

    await dialog.locator('#procedure_date').fill(today);
    await dialog.locator('#procedure_name').fill('ล้างแผล');
    await dialog.locator('#body_part').fill('แขนซ้าย');

    await dialog.getByRole('button', { name: 'บันทึก' }).click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: 'บันทึกหัตถการสำเร็จ' });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-12: Delete Procedure', () => {
  test('EXAM-12-01: should delete procedure record', async ({ page }) => {
    await openPatientDetail(page);
    await page.getByRole('tab', { name: 'หัตถการ' }).click();

    await page.locator('button[class*="text-destructive"]').first().click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: 'ลบหัตถการสำเร็จ' });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-08: Record Prescription', () => {
  test('EXAM-08-01: should add prescription', async ({ page }) => {
    await openPatientDetail(page);
    await page.getByRole('tab', { name: 'ประวัติยา' }).click();

    await page.getByRole('button', { name: 'เพิ่มคำสั่งยา' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('เพิ่มคำสั่งยา')).toBeVisible();

    await dialog.locator('#rx_date').fill(today);
    await dialog.getByRole('combobox').click();
    await page.getByRole('option').first().click();
    await dialog.locator('#rx_quantity').fill('2');
    await dialog.locator('#rx_usage').fill('รับประทานครั้งละ 1 เม็ด วันละ 2 ครั้ง หลังอาหาร');

    await dialog.getByRole('button', { name: 'บันทึก' }).click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: 'บันทึกคำสั่งยาสำเร็จ' });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});

test.describe('EXAM-13: Delete Prescription', () => {
  test('EXAM-13-01: should delete prescription record', async ({ page }) => {
    await openPatientDetail(page);
    await page.getByRole('tab', { name: 'ประวัติยา' }).click();

    await page.locator('button[class*="text-destructive"]').first().click();

    const toast = page.locator('[data-sonner-toast]').filter({ hasText: 'ลบคำสั่งยาสำเร็จ' });
    await expect(toast).toBeVisible({ timeout: 5000 });
  });
});
