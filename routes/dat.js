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


//名前<>メール欄<>日付、ID<>本文<>スレタイトル(1行目のみ存在する)\n
router.get('/:dat', (req, res, next) => {
	res.header({
		'Content-Type': 'text/plain; charset=Shift_JIS'
	});
	let boardname = req.originalUrl.split('/')[1];
	let key = req.params.dat.split('\.dat')[0];
	let promises = [];
	let threads = [];

	Thread.findOne({
		'key': key,
		'board': boardname
	}).then((thread) => {
		console.log('dat', key, thread);

		if (thread == null) {
			res.status(404).end();
			return 0;
		}
		for (let i = 0; i < thread.content.length; i++) {
			promises.push(Res.findById(thread.content[i], (err, r) => {
				threads.push(r);
			}));
		}
	}).then(() => {
		return Promise.all(promises);
	}).then(() => {
		let str = '';
		threads = threads.sort((a, b) => {
			return a.num - b.num;
		});
		console.log(threads);
		for (let i = 0; i < threads.length; i++) {
			let r = threads[i],
				c = r.content.split('\n').join('<br>');
			str += sprintf('%s<>%s<>%s ID:%s<> %s <>', r.name, r.mail, r.date, r.id, c);
			str += '\n';
		}
		console.log(str);
		res.write(jconv.encode(str, 'Shift_JIS'));
		res.end();
	});
});

module.exports = router;
