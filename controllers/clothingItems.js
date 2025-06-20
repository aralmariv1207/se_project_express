const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");
const ServerError = require("../errors/server-error");

const ClothingItem = require("../models/clothingItem");

// GET /items

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error("Error fetching items:", err);
      return next(new ServerError("An error occurred on the server"));
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
      return next(new ServerError("An error occurred on the server"));
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
      return next(new ServerError("An error occurred on the server"));
    });
};

// DELETE /items/:itemId

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return next(new NotFoundError("Item not found."));
    }

    if (!item.owner.equals(req.user._id)) {
      return next(
        new ForbiddenError("You do not have permission to delete this item.")
      );
    }

    await item.deleteOne();

    return res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(new ServerError("An error occurred on the server"));
  }
};

const addLike = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

const removeLike = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(new ServerError("An error occurred on the server"));
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
