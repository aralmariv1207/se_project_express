const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({});

module.exports = mongoose.Model("item", clothingItemSchema);
