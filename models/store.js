const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Categories = "pizza" || "burger" || "drinks" || "meat" || "other";

const StoreSchema = new Schema({
  name: String,
  logo: String,
  description: String,
  email: String,
  category: String,
  promotions: [String],
});

module.exports = mongoose.model("Store", StoreSchema);
