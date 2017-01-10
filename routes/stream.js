"use strict";
var express = require('express');
var router = express.Router();
var jconv = require('jconv');
var sprintf = require("sprintf-js").sprintf,
	vsprintf = require("sprintf-js").vsprintf

var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

var Board = require('../models/board');
var Thread = require('../models/thread');
var Res = require('../models/res');

var em = require('../models/eventmanager').em;

router.get('/', (req, res, next) => {
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
		'X-Accel-Buffering': 'no' // disable nginx proxy buffering
	})
	console.log('[streaming]');

	em.on('events', (json) => {
		console.log('streamjson:',json);
		res.write("data: " + json + "\n\n");
	});
});

module.exports = router;
