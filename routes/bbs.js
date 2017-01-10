"use strict";
var express = require('express');
var router = express.Router();
var jconv = require('jconv');
var sprintf = require("sprintf-js").sprintf,
	vsprintf = require("sprintf-js").vsprintf;
var crypto = require("crypto");

var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

var Board = require('../models/board.js');
var Thread = require('../models/thread.js');
var Res = require('../models/res.js');
var addpost = require('../models/addpost');
var sync = require('../sync');

var events = require('../models/eventmanager').events;

var eventManager = require('../models/eventmanager').em;

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
	let sha512 = crypto.createHash('sha512'),
		boardname = req.body.bbs,
		key = req.body.key,
		name = jconv.decode(req.body.FROM, 'Shift_JIS'),
		mail = jconv.decode(req.body.mail, 'Shift_JIS'),
		content = jconv.decode(req.body.MESSAGE, 'Shift_JIS'),
		title = req.body.subject,
		date = new Date(),
		now = Math.floor(date.getTime() / 1000),
		nid = 'aiueo';

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
	console.log('boardname:', boardname);
	if (title != undefined && key == undefined) {
		let eid, json, data;

		addpost.addNewThread(boardname, title, now, {
			name: name,
			mail: mail,
			content: content,
			date: date,
			id: nid
		}).then((r) => {
			console.log(now);
			json = {
				thread: r.thread,
				key: now,
				res: r.res
			};
			sha512.update(JSON.stringify(json), 'UTF-8');
			console.log(events);
			eid = sha512.digest('hex');
			events.push(eid);
			data = JSON.stringify({
				event: 'new_thread',
				data: json,
				eid: eid
			});
			sync.newEventRegister(data);
		}).then(() => {
			responceBBS('success');
		});
	} else if (title == undefined && key != undefined) {
		let eid, json, data;
		addpost.addNewRes(boardname, key, {
			name: name,
			mail: mail,
			content: content,
			date: date,
			id: nid
		}).then((r) => {
			json = {
					boardname: boardname,
					thread: r.key,
					res: r.res
				};
			let str = JSON.stringify(json);
			sha512.update(str, 'UTF-8');
			let eid = sha512.digest('hex');
			data = JSON.stringify({
				event: 'new_res',
				data: json,
				eid: eid
			});
			sync.newEventRegister(data);
			console.log('eid:', eid);
		}).then(() => {
			responceBBS('success');
		})
	}
});
module.exports = router;
