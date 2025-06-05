const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { validateSignup, validateLogin } = require("./middlewares/validations");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// Importing routers
const itemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");

// Importing middlewares and controllers
const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/errors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(requestLogger);

// Public routes
app.post("/signup", validateSignup, createUser);
app.post("/signin", validateLogin, login);

// Protected routes
app.use("/users", usersRouter);
app.use(
  "/items",
  (req, res, next) => {
    if (req.method === "GET") {
      return next();
    }
    return auth(req, res, next);
  },

  itemsRouter
);

app.use(errorLogger);

app.use((err, req, res, next) => {
  console.error(err);

  // Access request information
  console.log("Error occurred on:", req.method, req.url);
  console.log("Request body:", req.body);
  console.log("Query parameters:", req.query);

  // If response hasn't been sent yet, handle the error
  if (!res.headersSent) {
    return res.status(500).send({ message: "An error occurred on the server" });
  }
  // If headers were already sent, delegate to Express default error handler
  return next(err);
});

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// 404 middleware for unhandled routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
