"use strict";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
if (process.env.PORT == 3001) {
	const port = config.port;
}
var index = require('./routes/index');
var test = require('./routes/test');
var board = require('./routes/board');
var subjects = require('./routes/subjects');
var admin = require('./routes/admin');

var Board = require('./models/board');
var Event = require('./models/event');

var mongoose = require('./models.js');
var sync = require('./sync');

var app = express();

var events = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// 工事中
//app.use('/admin', admin);
app.use('/test', test);
for (let n of config.boardname) {
	app.use('/' + n, board);
	Board.findOne({
		name: n
	}).then((board) => {
		if (board == void 0) {
			let b = new Board({
				name: n,
				subjects: []
			});
			b.save();
		}
		board.setting = config.boards[n];
		console.log(config.boards[n].title);
		return board.save();
	});
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log(err);

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

//app.listen(port);
module.exports = app;
