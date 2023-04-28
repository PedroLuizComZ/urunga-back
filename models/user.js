var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	email: String,
	password: String,
	checkoutSessionId: String,
	city: { type: String, default: "outro" },
	type: { type: String, default: "client" },
	gender: { type: String, default: "outro" },
	birthdate: { type: String, default: `${new Date()}` },
});

module.exports = mongoose.model('Users', userSchema);