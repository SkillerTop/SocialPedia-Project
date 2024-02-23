import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization"); // отримання токену з заголовку Authorization

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) { // перевірка формату токену
      token = token.slice(7, token.length).trimLeft(); // видалення префіксу "Bearer " з токену
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET); // перевірка та декодування токену за допомогою секретного ключа
    req.user = verified;
    next(); // перехід до наступного middleware або маршруту
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
