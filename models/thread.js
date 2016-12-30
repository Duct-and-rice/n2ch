var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ThreadSchema = new Schema({
	title: String,
	key: Number,
	res: Number,
	content: [{type: ObjectId, ref: 'Res'}],
	board: String,
	lastUpdated:Date
});

module.exports = mongoose.model('Thread', ThreadSchema);
