"use strict"
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

var pub = {};
pub.addNewThread = (boardname, title, now, r) => {
	var res = new Res(),
		thread = {},
		setting;

	return Board.findOne({
		name: boardname
	}).then((board) => {
		setting = board.setting;
		if (r.name == '') {
			r.name = setting.anonymous_name;
		}
	}).then(() => {
		console.log(r, now);
		return Thread.findOne({
			key: now,
			board: boardname
		})
	}).then((doubledThread) => {
		if (typeof doubledThread === 'undefined') {
			console.log('doubled', doubledThread);
			responceBBS('laputa');
			return 0;
		}
	}).then(() => {
		res = new Res({
			name: UnescapeSJIS(r.name),
			mail: UnescapeSJIS(r.mail),
			date: r.date,
			id: r.id,
			content: UnescapeSJIS(r.content),
			thread: now,
			num: 1
		});
		console.log('r:', res);

		return res.save();
	}).then(function() {
		console.log('t1:', UnescapeSJIS(title));
		thread = new Thread({
			title: UnescapeSJIS(title),
			key: now,
			res: 1,
			content: [res._id],
			board: boardname,
			lastUpdated: r.date
		});
		console.log('t:', thread);
		return thread.save();

	}).then(() => {
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
		)
	}).then(() => {
		return new Promise((resolve) => {
			resolve({
				thread: thread,
				res: r,
			});
		});
	});
}

pub.addNewRes = (boardname, key, r) => {
	var res = {},
		key = parseInt(key),
		setting = {};
	return Board.findOne({
		name: boardname
	}).then((board) => {
		setting = board.setting;
		if (r.name == '') {
			r.name = setting.anonymous_name;
		}
	}).then(() => {
		return Thread.findOne({
			key: key,
			board: boardname
		})
	}).then((thread) => {
		console.log(0, thread.num , setting);
		if (thread.num > setting.bbs_finish_num) {
			return 0;
		}
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
		res = new Res({
			name: UnescapeSJIS(r.name),
			mail: UnescapeSJIS(r.mail),
			date: r.date,
			id: r.id,
			content: UnescapeSJIS(r.content),
			thread: key,
			num: num
		});
		return res.save();
	}).then(() => {
		console.log(res._id);
		return Thread.update({
				key: key
			}, {
				$push: {
					content: res._id
				},
				lastUpdated: r.date
			},
			function(err) {
				console.log(res._id);
				if (err) throw err;
			}

		);

	}).then(() => {
		console.log(key, res);
		return new Promise((resolve) => {
			resolve({
				key: key,
				res: res
			});
		})
	});

}
module.exports = pub;
