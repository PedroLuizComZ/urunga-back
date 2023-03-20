var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var checkinSchema = new Schema({
  userId: String,
  storeId: String,
  checkinAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Checkin", checkinSchema);
