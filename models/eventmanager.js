"use strict"
var mongoose = require('mongoose');
const EventEmitter = require('events').EventEmitter;

var em = new EventEmitter();

var events = new Array();
events.length = 0;
module.exports = {
	em: em,
	events: events
};
