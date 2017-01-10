"use strict";
var express = require('express');
var router = express.Router();
var jconv = require('jconv');
var sprintf = require("sprintf-js").sprintf,
	vsprintf = require("sprintf-js").vsprintf;

var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

var Board = require('../models/board.js');
var Thread = require('../models/thread.js');
var Res = require('../models/res.js');

router.get('/', (req, res, next) => {
	res.render('admin', {
		title: 'n2ch',
	});
});

module.exports = router;
