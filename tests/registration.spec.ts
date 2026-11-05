import { test } from '@playwright/test';
import { RegistrationPage } from './pages/RegistrationPage';

test.describe('Регистрация в КиноПодбор', () => {
  let page: RegistrationPage;

  test.beforeEach(async ({ page: p }) => {
    page = new RegistrationPage(p);
    await page.open();
  });

  test('TC-01: Успешная регистрация', async () => {
    await page.register({ email: 'newuser@test.ru', password: 'Qwerty12' });
    await page.expectSuccess();
  });

  test('TC-02: Пустой email', async () => {
    await page.register({ email: '', password: 'Qwerty12' });
    await page.expectEmailError('Email обязателен');
  });

  test('TC-03: Email без @', async () => {
    await page.register({ email: 'usertest.ru', password: 'Qwerty12' });
    await page.expectEmailError('Неверный формат email');
  });

  test('TC-04: Пароль 7 символов', async () => {
    await page.register({ email: 'newuser@test.ru', password: 'Qwerty1' });
    await page.expectPasswordError('Минимум 8 символов');
  });

  test('TC-05: Пароли не совпадают', async () => {
    await page.register({ email: 'newuser@test.ru', password: 'Qwerty12', confirm: 'Qwerty99' });
    await page.expectConfirmError('Пароли не совпадают');
  });

  test('TC-06: Дубликат email', async () => {
    await page.register({ email: 'existing@test.ru', password: 'Qwerty12' });
    await page.expectEmailError('Пользователь с таким email уже существует');
  });

  test('TC-07: SQL-инъекция', async () => {
    await page.register({ email: "' OR '1'='1", password: 'Qwerty12' });
    await page.expectEmailError('Неверный формат email');
  });

  test('TC-08: XSS-payload', async () => {
    await page.register({ email: '<script>alert(1)</script>@test.ru', password: 'Qwerty12' });
    await page.expectEmailError('Неверный формат email');
  });

  test('TC-09: Пароль ровно 8 символов', async () => {
    await page.register({ email: 'newuser@test.ru', password: 'Qwerty12' });
    await page.expectSuccess();
  });

  test('TC-10: Пароль ровно 64 символа', async () => {
    const pass = 'A1' + 'a'.repeat(62);
    await page.register({ email: 'newuser@test.ru', password: pass });
    await page.expectSuccess();
  });

  test('TC-11: Пароль 65 символов', async () => {
    const pass = 'A1' + 'a'.repeat(63);
    await page.register({ email: 'newuser@test.ru', password: pass });
    await page.expectPasswordError('Максимум 64 символа');
  });

  test('TC-12: Пароль без цифры', async () => {
    await page.register({ email: 'newuser@test.ru', password: 'Qwertyui' });
    await page.expectPasswordError('Пароль должен содержать букву и цифру');
  });
});