"use strict";
var express = require('express');
var router = express.Router();
var subjects = require('./subjects');
var dat = require('./dat');
var stream = require('./stream');
var conf = require('config');

var Board = require('../models/board.js');
var Thread = require('../models/thread.js');

router.use('/subject.txt', subjects);
router.use('/dat', dat);
router.use('/stream', stream);
router.get('/', (req, res, next) => {
	res.header('Content-Type', 'text/html; charset=utf-8');
	let boardname = req.originalUrl.split('/')[1],
		promises = [],
		setting = {},
		threads = [];
	Board.findOne({
		name: boardname
	}).then((board) => {
		setting = board.setting;
		promises = [];
		if (typeof board.subjects !== 'undefined') {
			for (let i = 0; i < board.subjects.length; i++) {
				console.log(board.subjects[i]);
				promises.push(Thread.findById(board.subjects[i], (err, thread) => {
					threads.push(thread);
				}));
			}
		}
	}).then(() => {
		console.log('t:' + threads);
		return Promise.all(promises);
	}).then(() => {
		if (threads.length == 0) {
			return 0;
		}
		if (threads.length > 1) {
			threads = threads.sort((a, b) => {
				return b.lastUpdated - a.lastUpdated;
			});
		}
	}).then(() => {
		console.log('s:', setting);
		res.render('board', {
			setting: setting,
			threads: threads,
			boardname: boardname
		});
	});
});

module.exports = router;
