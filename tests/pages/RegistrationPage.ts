import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmInput: Locator;
  readonly agreeCheckbox: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly confirmError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.confirmInput = page.getByTestId('confirm');
    this.agreeCheckbox = page.getByTestId('agree');
    this.submitButton = page.getByTestId('submit');
    this.successMessage = page.getByTestId('success');
    this.emailError = page.getByTestId('email-error');
    this.passwordError = page.getByTestId('password-error');
    this.confirmError = page.getByTestId('confirm-error');
  }

  async open() { await this.page.goto('/'); }
  async fillEmail(email: string) { await this.emailInput.fill(email); }
  async fillPassword(password: string) { await this.passwordInput.fill(password); }
  async fillConfirm(password: string) { await this.confirmInput.fill(password); }
  async checkAgree() { await this.agreeCheckbox.check(); }
  async submit() { await this.submitButton.click(); }

  async register(data: { email: string; password: string; confirm?: string; agree?: boolean; }) {
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillConfirm(data.confirm ?? data.password);
    if (data.agree ?? true) await this.checkAgree();
    await this.submit();
  }

  async expectSuccess() { await expect(this.successMessage).toBeVisible(); }
  async expectEmailError(text: string) { await expect(this.emailError).toHaveText(text); }
  async expectPasswordError(text: string) { await expect(this.passwordError).toHaveText(text); }
  async expectConfirmError(text: string) { await expect(this.confirmError).toHaveText(text); }
}