const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");

const ClothingItem = require("../models/clothingItem");

// GET /items

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

// POST /items

const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
    });
};

// GET /items/:itemId

const getItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

// DELETE /items/:itemId

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      console.log(`item with ID ${itemId} not found.`);
      return next(new NotFoundError("Item not found."));
    }

    if (!item.owner.equals(req.user._id)) {
      console.log(`User ${req.user._id} is not the owner of item ${itemId}.`);
      return next(
        new ForbiddenError("You do not have permission to delete this item.")
      );
    }

    await item.deleteOne();

    console.log(`Item ${itemId} successfully deleted by user ${req.user._id}.`);
    return res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      console.error(
        `CastError for item ID ${req.params.itemId}: ${err.message}`
      );
      return next(new BadRequestError("Invalid item ID"));
    }
    console.error(`Error deleting item ${req.params.itemId}: ${err.message}`);
    return next(err);
  }
};

const addLike = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const removeLike = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  getItem,
  addLike,
  removeLike,
  deleteItem,
};
