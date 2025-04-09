const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const ClothingItem = require("../models/clothingItems");

// GET /items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);

      res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// POST /items

const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  ClothingItem.create({ name, imageUrl, weather })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// GET /items/:itemId

const getItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = { getItems, createItem, getItem };
