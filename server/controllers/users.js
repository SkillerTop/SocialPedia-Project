import User from "../models/User.js";

/** @module User **/
/**
 * Отримує дані користувача за його ідентифікатором.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object} - Об'єкт користувача.
 */
export const getUser = async (req, res) => {
  try {
    // Отримує ідентифікатор користувача з параметрів запиту
    const { id } = req.params;
    // Знаходить користувача за його ідентифікатором
    const user = await User.findById(id);
    // Повертає об'єкт користувача у відповідь
    res.status(200).json(user);
  } catch (err) {
    // Обробляє помилку, якщо виникла при отриманні даних користувача
    res.status(404).json({ message: err.message });
  }
};

/**
 * Отримує список друзів користувача за його ідентифікатором.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object[]} - Масив друзів користувача.
 */
export const getUserFriends = async (req, res) => {
  try {
    // Отримує ідентифікатор користувача з параметрів запиту
    const { id } = req.params;
    // Знаходить користувача за його ідентифікатором
    const user = await User.findById(id);

    // Отримує друзів користувача
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // Форматує дані друзів для відправлення у відповідь
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, userLocation, picturePath }) => {
        return { _id, firstName, lastName, occupation, userLocation, picturePath };
      }
    );
    // Повертає масив друзів у відповідь
    res.status(200).json(formattedFriends);
  } catch (err) {
    // Обробляє помилку, якщо виникла при отриманні списку друзів користувача
    res.status(404).json({ message: err.message });
  }
};

/**
 * Додає або видаляє користувача зі списку друзів іншого користувача.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object[]} - Оновлений список друзів користувача.
 */
export const addRemoveFriend = async (req, res) => {
  try {
    // Отримує ідентифікатор користувача та його друга з параметрів запиту
    const { id, friendId } = req.params;
    // Знаходить користувача та його друга за їх ідентифікаторами
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      // Якщо друг уже є в списку друзів, видаляє його зі списку
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // Якщо друга немає в списку друзів, додає його до списку
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    // Зберігає зміни у базі даних
    await user.save();
    await friend.save();

    // Отримує оновлений список друзів користувача
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // Форматує дані друзів для відправлення у відповідь
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, userLocation, picturePath }) => {
        return { _id, firstName, lastName, occupation, userLocation, picturePath };
      }
    );

    // Повертає оновлений список друзів у відповідь
    res.status(200).json(formattedFriends);
  } catch (err) {
    // Обробляє помилку, якщо виникла при додаванні або видаленні друга
    res.status(404).json({ message: err.message });
  }
};
