var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResSchema = new Schema({
	name: String,
	mail: String,
	date: String,
	id: String,
	content: String,
	thread: Number,
	num:Number
});

module.exports = mongoose.model('Res', ResSchema);
