"use strict"
var mongoose = require('mongoose');
var Board = require('./board');
var Thread = require('./thread');
var Res = require('./res');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;

var EventSchema = new Schema({
	type: String,
	eid: String,
	content: Mixed
});

module.exports = mongoose.model('Event', EventSchema);

