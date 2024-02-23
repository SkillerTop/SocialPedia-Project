import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body; // отримання даних користувача з тіла запиту

    const salt = await bcrypt.genSalt(); // генерація солі для хешування паролю
    const passwordHash = await bcrypt.hash(password, salt); // хешування паролю з використанням солі

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save(); // збереження нового користувача у базі даних
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // отримання електронної адреси та паролю користувача з тіла запиту
    const user = await User.findOne({ email: email });

    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password); // порівняння хешованого паролю з паролем у базі даних

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // створення JWT токену з ідентифікатором користувача
    delete user.password;
    res.status(200).json({ token, user }); // відправлення відповіді з токеном та об'єктом користувача
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
