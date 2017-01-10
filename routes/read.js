"use strict";
var express = require('express');
var router = express.Router();
var jconv = require('jconv');
var sprintf = require("sprintf-js").sprintf,
	vsprintf = require("sprintf-js").vsprintf;
var dateFormat = require('dateformat');

var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

var Board = require('../models/board.js');
var Thread = require('../models/thread.js');
var Res = require('../models/res.js');

router.get('/', (req, res, next) => {
	let boardname = req.originalUrl.split('/')[3],
		key = req.originalUrl.split('/')[4],
		promises = [],
		setting = {},
		thread = {},
		week = '日月火水木金土',
		rs = [];
	console.log(boardname, key)
	Thread.findOne({
		key: key
	}).then((t) => {
		thread = t;
		if (typeof thread.content !== 'undefined') {
			for (let i = 0; i < thread.content.length; i++) {
				promises.push(Res.findById(thread.content[i], (err, r) => {
					let dayOfWeek = week.charAt(dateFormat(r.date, 'N')),
						dateFormatted = dateFormat(r.date, 'yyyy/mm/dd(') + dayOfWeek + dateFormat(r.date, ') hh:MM:ss L');
					r.date = dateFormatted;
					rs.push(r)
				}));
			}
		}
	}).then(() => {
		return Promise.all(promises);
	}).then(() => {
		if (rs.length == 0) {
			return 0;
		}
		if (rs.length > 1) {
			rs = rs.sort((a, b) => {
				return a.num - b.num;
			});
		}
		return Board.findOne({
			name: boardname
		});
	}).then((board) => {
		setting = board.setting;
	}).then(() => {
		console.log('res:', setting);
		res.render('read', {
			setting: setting,
			thread: thread,
			res: rs
		});
	});
});

module.exports = router;
