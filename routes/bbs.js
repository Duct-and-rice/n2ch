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
require('../ecl.js');


const RESPONCE = {
	success: {
		title: '書きこみました。OK',
		tag: '<!-- 2ch_X:true -->'
	},
	error: {
		title: 'ＥＲＲＯＲ',
		tag: '<!-- 2ch_X:error -->'
	},
	laputa: {
		title: 'お茶でも飲みましょう。Laputa Error',
		tag: '<!-- 2ch_X:error -->'
	},
	cookie: {
		title: '書き込み確認',
		tag: '<!-- 2ch_X:cookie -->'
	},
}

router.post('/', function(req, res, next) {
	let boardname = req.body.bbs,
		key = req.body.key,
		name = UnescapeSJIS(req.body.FROM),
		mail = UnescapeSJIS(req.body.mail),
		content = UnescapeSJIS(req.body.MESSAGE),
		title = req.body.subject,
		date = new Date(),
		now = Math.floor(date.getTime() / 1000),
		id = 'a';
	console.log(key);

	const responceBBS = (code) => {
		res.render('bbs_responce', RESPONCE[code], (err, html) => {
			console.log(html);
			res.write(jconv.encode(html, 'Shift_JIS'));
		});
		res.end();
	};
	//now = 0;

	res.header('Content-Type', 'text/html; charset=shift_jis');
	let r;
	if (title != undefined && key == undefined) {
		let thread;
		Thread.find({
			key: now,
			board: boardname
		}).then((doubledThread) => {
			console.log(doubledThread);

			if (doubledThread.length !== 0) {
				responceBBS('laputa');
				return 0;
			}

			title = UnescapeSJIS(req.body.subject);

			thread = new Thread();
			r = new Res({
				name: name,
				mail: mail,
				date: date,
				id: date,
				content: content,
				thread: now,
				num: 1
			});

			return r.save();
		}).then(function() {

			thread = new Thread({
				title: title,
				key: now,
				res: 1,
				content: [r._id],
				board: boardname,
				lastUpdated: date
			});
			return thread.save();

		}).then(function() {

			return Board.update({
					name: boardname
				}, {
					$push: {
						subjects: thread._id
					}
				},
				function(err) {
					console.log(thread._id);
					if (err) throw err;
				}
			);
		}).then(() => {
			responceBBS('success');
		});


	} else if (title == undefined && key != undefined) {
		key = parseInt(key);
		Thread.find({
			key: key
		}).then((thread) => {
			console.log(0);
			return Thread.update({
					key: key
				}, {
					num: thread.num + 1
				},
				function(err) {
					console.log(1);
					if (err) throw err;
				}
			);
		}).then(() => {
			console.log(2);
			return Thread.findOne({
				key: key
			});
			console.log(res);
		}).then((thread) => {
			console.log(3);
			let num = 1;
			if (thread.content != null) {
				num = thread.content.length + 1;
			}
			r = new Res({
				name: name,
				mail: mail,
				date: date,
				id: date,
				content: content,
				thread: key,
				num: num
			});
			return r.save();
		}).then(() => {
			console.log(r._id);
			return Thread.update({
				key: key
			}, {
				$push: {
					content: r._id
				},
				lastUpdated: date
			});
		}).then(() => {
			responceBBS('success');
		});
	}
});
module.exports = router;
