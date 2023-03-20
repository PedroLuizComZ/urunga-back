var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	email: String,
	password: String,
	city: { type: String, default: "outro" },
	type: { type: String, default: "client" },
});

module.exports = mongoose.model('Users', userSchema);