const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
} = require("../utils/errors");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// POST /users

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.status(201).send(user)) // password will be hidden automatically due to select: false
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "User already exists" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// GET /users/me

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occured on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: "The password and email fields are required",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        res.status(401).send({ message: "Incorrect email or password" });
      } else {
        res.status(500).send({ message: "An error occurred on the server" });
      }
    });
};

// PATCH /users/me — update profile

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
