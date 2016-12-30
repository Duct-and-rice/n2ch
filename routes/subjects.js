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

var Board = require('../models/board.js');
var Thread = require('../models/thread.js');

router.get('/', (req, res, next) => {

	res.header({
		'Content-Type': 'text/plain; charset=Shift_JIS'
	});
	let boardname = req.originalUrl.split('/')[1];

	let promises = [],
		subjects = [],str;
	Board.findOne({
		'name': boardname
	}).then((data) => {
		let str = '';
		promises = [];
		if (typeof data.subjects !== 'undefined') {
			for (let i = 0; i < data.subjects.length; i++) {
				promises.push(Thread.findById(
					data.subjects[i], (err, subject) => {
						subjects.push(subject);
					}
				));
			}
		}
	}).then(() => {
		return Promise.all(promises)
	}).then(() => {
		console.log('sub',subjects);
		if (subjects.length == 0) {
			res.end();
			return 0;
		}
		if (subjects.length > 1) {
			subjects = subjects.sort((a, b) => {
				return b.lastUpdated - a.lastUpdated;
			});
		}
		for (let i = 0; i < subjects.length; i++) {
			if (subjects[i] != undefined) {
				str = sprintf('%010d.dat<>%s\t(%d)\n', subjects[i].key, subjects[i].title, subjects[i].content.length);
			}
			console.log(str);
			res.write(jconv.encode(str, 'Shift_JIS'));
		}
	}).then(() => {
		res.end();
	});
})

module.exports = router;
