import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router(); // створення об'єкту маршрутизатора

router.post("/login", login); // маршрут для обробки POST-запиту на вхід

export default router;
