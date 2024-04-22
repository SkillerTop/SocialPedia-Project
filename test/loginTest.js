import axios from 'axios';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { junit } from 'jest-junit';

const BASE_URL = 'http://localhost:3001'; // Замініть на адресу вашого сервера

const testLogin = async () => {
  try {
    // Відправляємо POST-запит на логін
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com', // Замініть на реальну електронну адресу
      password: 'password123', // Замініть на реальний пароль
    });

    // Перевіряємо, чи успішно автентифікований користувач
    if (response.status === 200) {
      console.log('Login test passed!');
    } else {
      console.error('Login test failed!');
    }

    // Зберігаємо результати тестування у форматі JUnit
    const reportPath = resolve(__dirname, 'test-results.xml');
    writeFileSync(reportPath, junit(response));

    // Виводимо шлях до звіту для подальшого використання
    console.log(`Test results saved to: ${reportPath}`);
  } catch (error) {
    console.error('An error occurred during login test:', error.message);
    process.exit(1); // Завершуємо процес з кодом помилки, щоб Jenkins визначив, що тест не пройшов успішно
  }
};

testLogin();