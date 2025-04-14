const router = require("express").Router();
const authRouter = require("./auth");

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use("/", authRouter);

module.exports = router;
