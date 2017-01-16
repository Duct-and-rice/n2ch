"use strict";
var conf = require('config');
var Board = require('./models/board');
var Thread = require('./models/thread');
var Res = require('./models/res');
var port = conf.dbport;
var name = conf.dbname;

// if (process.env.PORT == 3001) {
// 	port = 3002;
// }
console.log(port);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:' + port + '/' + name);
// if (false) {
// 	let c = 0;
// 	Board.count({}, function(err, count) {
// 		c = count;
// 		console.log(c);
// 		if (c === 0) {
// 			const testBoard = new Board({
// 				name: 'board',
// 				subjects: [new Thread({
// 					title: 'ああああ',
// 					key: 0,
// 					res: 1,
// 					content: [new Res({
// 						name: 'nanashi',
// 						mail: 'sage',
// 						date: '2016/12/22(木) 09:00:51.79',
// 						id: 'bG63f0fQ0',
// 						content: "ああああ<br>いい",
// 					})]
// 				}), new Thread({
// 					title: 'いいいい',
// 					key: 1,
// 					res: 2,
// 					content: [new Res({
// 						name: 'nanashi',
// 						mail: 'sage',
// 						date: '2016/12/22(木) 09:00:51.79',
// 						id: 'bG63f0fQ0',
// 						content: "ああああ<br>いい",
// 					}), new Res({
// 						name: 'nanashi',
// 						mail: '',
// 						date: '2016/12/22(木) 09:00:51.79',
// 						id: 'admin',
// 						content: 'ぐぐ'
// 					})]
// 				})]
// 			});
//
// 			testBoard.save();
// 		}
// 	});
// }

module.exports = {
	mongoose: mongoose
};
