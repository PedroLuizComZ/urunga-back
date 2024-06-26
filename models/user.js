var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	email: { type: String, unique: true },
	password: String,
	checkoutSessionId: String,
	city: { type: String, default: "outro" },
	type: { type: String, default: "client" },
	gender: { type: String, default: "outro" },
	isAdmin: { type: Boolean, default: false },
	birthdate: { type: String, default: `${new Date()}` },
});

module.exports = mongoose.model('Users', userSchema);