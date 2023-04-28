const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  name: String,
  logo: String,
  description: String,
  email: String,
  category: String,
  city: String,
  google: String,
  instagram: String,
  promotions: [String],
});

module.exports = mongoose.model("Store", StoreSchema);
