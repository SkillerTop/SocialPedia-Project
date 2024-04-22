use PHPUnit\Framework\TestCase;

class AuthTest extends TestCase {
    public function testLoginSuccess() {
        // Підготовка тестових даних (електронна адреса та пароль)
        $data = [
            'email' => 'test@example.com',
            'password' => 'testpassword'
        ];

        // Виклик API для логіну
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost:6001/auth/login'); // Вкажіть URL вашого сервера
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

        // Виконання запиту
        $response = curl_exec($ch);
        curl_close($ch);

        // Перевірка, що запит був успішним (HTTP статус 200)
        $this->assertEquals(200, http_response_code());

        // Перевірка, що відповідь містить токен доступу та об'єкт користувача
        $this->assertArrayHasKey('token', json_decode($response, true));
        $this->assertArrayHasKey('user', json_decode($response, true));
    }

    public function testLoginFailure() {
        // Підготовка тестових даних (неіснуюча електронна адреса)
        $data = [
            'email' => 'nonexistent@example.com',
            'password' => 'testpassword'
        ];

        // Виклик API для логіну
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost:6001/auth/login'); // Вкажіть URL вашого сервера
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

        // Виконання запиту
        $response = curl_exec($ch);
        curl_close($ch);

        // Перевірка, що запит викликав помилку (HTTP статус 400)
        $this->assertEquals(400, http_response_code());

        // Перевірка, що відповідь містить повідомлення про невдалу автентифікацію
        $this->assertArrayHasKey('msg', json_decode($response, true));
    }
}
