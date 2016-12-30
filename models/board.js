var mongoose = require('mongoose');
var Thread = require('./thread');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;

var BoardSchema = new Schema({
	name: String,
	title:String,
	setting:Mixed,
	subjects: [{type: ObjectId, ref: 'Thread'}]
});

module.exports = mongoose.model('Board', BoardSchema);
