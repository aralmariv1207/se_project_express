const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "GET users route" });
});

router.get("/:userId", (req, res) => {
  res.json({ message: "GET users by ID"});
});

router.post("/", (req, res) => {
  res.json({ message: "POST users"});
});

module.exports = router;
