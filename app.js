const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const mainRouter = require("./routes/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use("/", mainRouter);

// 404 middleware for unhandled routes
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
