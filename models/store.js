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
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  pix: String,
  review: String,
  veggie: Boolean,
  petFriendly: Boolean,
  kids: Boolean,
  accessibility: Boolean,
  promotions: [String],
  rating: [{
    userId: String,
    commentary: String,
    ratingValue: Number,
    answer: { type: String, default: "" },
  }],
});

module.exports = mongoose.model("Store", StoreSchema);
