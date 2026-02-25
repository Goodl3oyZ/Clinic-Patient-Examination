import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Authentication pages
 */
export class AuthPage {
  readonly page: Page;

  // Role selection cards on entry page
  readonly doctorCard: Locator;
  readonly patientCard: Locator;
  readonly doctorRoleButton: Locator;
  readonly patientRoleButton: Locator;

  // Tab navigation
  readonly loginTab: Locator;
  readonly signupTab: Locator;

  // Doctor login form elements
  readonly doctorEmailInput: Locator;
  readonly doctorPasswordInput: Locator;
  readonly doctorLoginSubmitButton: Locator;

  // Patient login form elements
  readonly patientEmailInput: Locator;
  readonly patientPasswordInput: Locator;
  readonly patientLoginSubmitButton: Locator;

  // Signup form elements
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupPasswordInput: Locator;
  readonly signupSubmitButton: Locator;

  // Navigation
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Role selection - target the Card by the heading text
    this.doctorCard = page.locator('div.cursor-pointer').filter({ hasText: 'แพทย์/เจ้าหน้าที่' });
    this.patientCard = page.locator('div.cursor-pointer').filter({ hasText: 'ผู้ป่วย' }).first();

    // Role selection buttons (inside the cards)
    this.doctorRoleButton = page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true });
    this.patientRoleButton = page.getByRole('button', { name: 'เข้าสู่ระบบผู้ป่วย' });

    // Tab navigation
    this.loginTab = page.getByRole('tab', { name: 'เข้าสู่ระบบ' });
    this.signupTab = page.getByRole('tab', { name: 'ลงทะเบียนบัญชี' });

    // Doctor login form (id="login-email", id="login-password")
    this.doctorEmailInput = page.locator('#login-email');
    this.doctorPasswordInput = page.locator('#login-password');
    this.doctorLoginSubmitButton = page.locator('form').filter({ has: page.locator('#login-email') }).getByRole('button', { name: 'เข้าสู่ระบบ' });

    // Patient login form (id="patient-login-email", id="patient-login-password")
    this.patientEmailInput = page.locator('#patient-login-email');
    this.patientPasswordInput = page.locator('#patient-login-password');
    this.patientLoginSubmitButton = page.locator('form').filter({ has: page.locator('#patient-login-email') }).getByRole('button', { name: 'เข้าสู่ระบบ' });

    // Signup form elements
    this.signupNameInput = page.locator('#signup-name');
    this.signupEmailInput = page.locator('#signup-email');
    this.signupPasswordInput = page.locator('#signup-password');
    this.signupSubmitButton = page.getByRole('button', { name: 'ลงทะเบียน' });

    // Navigation
    this.backButton = page.getByRole('button', { name: '← กลับ' });
  }

  async goto() {
    await this.page.goto('auth');
  }

  async clickDoctorCard() {
    await this.doctorCard.click();
  }

  async clickPatientCard() {
    await this.patientRoleButton.click();
  }

  async fillDoctorLoginForm(email: string, password: string) {
    await this.doctorEmailInput.fill(email);
    await this.doctorPasswordInput.fill(password);
  }

  async fillPatientLoginForm(email: string, password: string) {
    await this.patientEmailInput.fill(email);
    await this.patientPasswordInput.fill(password);
  }

  async submitDoctorLogin() {
    await this.doctorLoginSubmitButton.click();
  }

  async submitPatientLogin() {
    await this.patientLoginSubmitButton.click();
  }

  async loginAsDoctor(email: string, password: string) {
    await this.goto();
    await this.clickDoctorCard();
    await this.fillDoctorLoginForm(email, password);
    await this.submitDoctorLogin();
  }

  async loginAsPatient(email: string, password: string) {
    await this.goto();
    await this.clickPatientCard();
    await this.fillPatientLoginForm(email, password);
    await this.submitPatientLogin();
  }

  async goBack() {
    await this.backButton.click();
  }

  async switchToSignup() {
    await this.signupTab.click();
  }

  async switchToLogin() {
    await this.loginTab.click();
  }

  async fillSignupForm(name: string, email: string, password: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupPasswordInput.fill(password);
  }

  async submitSignup() {
    await this.signupSubmitButton.click();
  }
}
