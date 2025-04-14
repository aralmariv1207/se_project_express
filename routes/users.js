const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/", auth, getUsers);
router.get("/me", auth, getUser);
router.patch("/me", auth, updateUser);
router.post("/", createUser);

module.exports = router;
