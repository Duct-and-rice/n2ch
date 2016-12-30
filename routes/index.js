"use strict";
var express = require('express');
var router = express.Router();
var config = require('config');

var Board = require('../models/board.js');

router.get('/', (req, res, next) => {
	let boards = [];
	Board.find({}).then((b) => {
		boards = b;
	}).then(() => {
		res.render('index', {
			title: 'n2ch',
			boards: boards,
			jumbotron: config.jumbotron,
		});
	});
});

module.exports = router;
