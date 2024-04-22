import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js'; // Імпортуємо ваш файл index.js, де налаштовано сервер

describe('Authentication API Tests', () => {
  let token; // Змінна для зберігання токену, який буде отриманий після входу

  // Тест для перевірки правильності входу користувача
  it('Should login user and return token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'ivan@gmail.com', password: 'awdijl912' }); // Перевірте, чи введено правильні дані
    expect(res.statusCode).to.equal(200); // Очікуємо статус коду 200 (OK)
    expect(res.body).to.have.property('token'); // Очікуємо, що відповідь містить токен
    token = res.body.token; // Зберігаємо токен для подальших тестів
  });
});
