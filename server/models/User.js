import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "", // значення за замовчуванням для поля picturePath
    },
    friends: {
      type: Array,
      default: [], // значення за замовчуванням для поля friends
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true } // включення автоматичного створення полів timestamps: createdAt та updatedAt
);

const User = mongoose.model("User", UserSchema); // створення моделі користувача зі схемою
export default User;
