const router = require("express").Router();
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const {
  getItems,
  createItem,
  getItem,
  addLike,
  removeLike,
} = require("../controllers/clothingitems");

// GET all clothing items
router.get("/", getItems);

// GET single clothing item by ID
router.get("/:itemId", getItem);

// POST - Create a new clothing item
router.post("/", createItem);
router.put("/:itemId/likes", addLike);
router.delete("/:itemId/likes", removeLike);

module.exports = router;
