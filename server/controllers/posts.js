import Post from "../models/Post.js";
import User from "../models/User.js";

/** @module Post **/
/**
 * Створює новий пост.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object} - Створений пост.
 */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    // Знаходить користувача за його ідентифікатором
    const user = await User.findById(userId);
    // Створює новий пост з даними користувача та запиту
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userLocation: user.userLocation,
      description,
      userPicturePath: user.picturePath,
      picturePath: req.file.location,
      likes: {},
      comments: [],
    });
    // Зберігає новий пост у базі даних
    await newPost.save();

    // Отримує всі пости
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    // Обробляє помилку, якщо виникла при створенні посту
    res.status(409).json({ message: err.message });
  }
};

/**
 * Отримує всі пости зі стрічки новин.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object[]} - Масив всіх постів.
 */
export const getFeedPosts = async (req, res) => {
  try {
    // Отримує всі пости
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    // Обробляє помилку, якщо виникла при отриманні постів
    res.status(404).json({ message: err.message });
  }
};

/**
 * Отримує всі пости користувача.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object[]} - Масив постів користувача.
 */
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    // Отримує всі пости користувача за його ідентифікатором
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    // Обробляє помилку, якщо виникла при отриманні постів користувача
    res.status(404).json({ message: err.message });
  }
};

/**
 * Виконує дію лайку на пості.
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @returns {Object} - Оновлений пост зі зміненим станом лайків.
 */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    // Знаходить пост за його ідентифікатором
    const post = await Post.findById(id);
    // Перевіряє, чи відповідний користувач вже поставив лайк
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      // Якщо відповідний користувач вже поставив лайк, то видаляє його лайк
      post.likes.delete(userId);
    } else {
      // Якщо відповідний користувач ще не поставив лайк, то додає його лайк
      post.likes.set(userId, true);
    }

    // Оновлює пост з оновленим станом лайків
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    // Обробляє помилку, якщо виникла при виконанні дії лайку на пості
    res.status(404).json({ message: err.message });
  }
};
