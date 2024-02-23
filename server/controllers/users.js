import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params; // отримання id користувача з параметрів запиту
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params; // отримання id користувача з параметрів запиту
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params; // отримання id користувача та id друга з параметрів запиту
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) { // перевірка, чи є друг у списку друзів користувача
      user.friends = user.friends.filter((id) => id !== friendId); // видалення друга зі списку друзів користувача
      friend.friends = friend.friends.filter((id) => id !== id); // видалення користувача зі списку друзів друга
    } else {
      user.friends.push(friendId); // додавання друга до списку друзів користувача
      friend.friends.push(id); // додавання користувача до списку друзів друга
    }
    await user.save(); // збереження змін у користувача
    await friend.save(); // збереження змін у друга

    const friends = await Promise.all( // отримання оновленого списку друзів користувача
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
