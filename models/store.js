var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StoreSchema = new Schema({
	name: String,
	logo: String,
	description: String,
	email: String,
	promotions: [String],
});

module.exports = mongoose.model('Store', StoreSchema);