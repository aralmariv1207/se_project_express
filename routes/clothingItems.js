const router = require("express").Router();

const { validateItem, validateItemId } = require("../middlewares/validations");
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  getItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

// GET all clothing items
router.get("/", getItems);

// GET single clothing item by ID
router.get("/:itemId", validateItemId, getItem);

// POST - Create a new clothing item
router.post("/", auth, validateItem, createItem);

// DELETE a clothing item by ID
router.delete("/:itemId", auth, validateItemId, deleteItem);

// PUT - Add a like to a clothing item
router.put("/:itemId/likes", auth, validateItemId, addLike);

// DELETE - Remove a like from a clothing item
router.delete("/:itemId/likes", auth, validateItemId, removeLike);

module.exports = router;
