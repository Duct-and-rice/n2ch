"use strict";
var express = require('express');
var router = express.Router();
var subjects = require('./subjects');
var dat = require('./dat');
var conf = require('config');

var Board = require('../models/board.js');

router.use('/subject.txt', subjects);
router.use('/dat', dat);
router.get('/', (req, res, next) => {
	let boardname = req.originalUrl.split('/')[1];
	Board.findOne({
		name: boardname
	}).then((board) => {
		console.log(board.title);
		res.render('board', {
			setting: board.setting
		});
	});
});

module.exports = router;
