import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Модуль автентифікації та авторизації користувачів.
 * @module Auth
 */

/**
 * Реєстрація нового користувача.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object} - Об'єкт створеного користувача.
 */
export const register = async (req, res) => {
  try {
    // Отримання даних користувача з тіла запиту
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      userLocation,
      occupation,
    } = req.body;

    // Генерація солі для хешування паролю
    const salt = await bcrypt.genSalt();
    // Хешування паролю з використанням солі
    const passwordHash = await bcrypt.hash(password, salt);

    // Створення нового користувача
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: req.file.location,
      friends,
      userLocation,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    // Збереження нового користувача у базі даних
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Авторизація користувача.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object} - JWT токен та об'єкт користувача.
 */
export const login = async (req, res) => {
  try {
    // Отримання електронної адреси та паролю користувача з тіла запиту
    const { email, password } = req.body;
    // Пошук користувача за електронною адресою
    const user = await User.findOne({ email: email });

    // Перевірка чи користувач існує
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    // Порівняння хешованого паролю з паролем у базі даних
    const isMatch = await bcrypt.compare(password, user.password);

    // Перевірка чи пароль вірний
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    // Створення JWT токену з ідентифікатором користувача
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // Видалення паролю з об'єкта користувача
    delete user.password;
    // Відправлення відповіді з токеном та об'єктом користувача
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
