import { expect } from "chai";
import { register, login } from "../controllers/auth.js";
import User from "../models/User.js";

describe("Authentication", () => {
  describe("Registration", () => {
    it("should register a new user", async () => {
      const req = {
        body: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          password: "password123",
          picturePath: "",
          friends: [],
          userLocation: "",
          occupation: "",
        },
        file: { location: "test" },
      };
      const res = {
        status: (status) => ({
          json: (data) => {
            expect(status).to.equal(201);
            expect(data).to.have.property("_id");
          },
        }),
      };

      await register(req, res);
    });
  });

  describe("Login", () => {
    it("should login an existing user", async () => {
      const existingUser = new User({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        picturePath: "test",
        friends: [],
        userLocation: "",
        occupation: "",
      });
      await existingUser.save();

      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: (status) => ({
          json: (data) => {
            expect(status).to.equal(200);
            expect(data).to.have.property("token");
            expect(data).to.have.property("user");
          },
        }),
      };

      await login(req, res);
    });
  });
});
