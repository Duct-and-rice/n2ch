"use strict"
var config = require('config');
var http = require('http');
var EventSource = require('eventsource');
var Event = require('./models/event');
var Board = require('./models/board').events;
var Thread = require('./models/thread');

var addpost = require('./models/addpost');
var events = require('./models/eventmanager').events;
var em = require('./models/eventmanager').em;
var es = {};
var pub = {};

function is(type, obj) {
	var clas = Object.prototype.toString.call(obj).slice(8, -1);
	return obj !== undefined && obj !== null && clas === type;
}

for (let board of config.boardname) {
	for (let syncurl of config.boards[board].sync) {

		es[board] = new EventSource(syncurl + board + '/stream');
		console.log(es, syncurl + board + '/stream');
		es[board].addEventListener('message', function(event) {
			let json = event.data;
			console.log('jsonparse:', json, json.toString()!=='[object Object]');
			if (json.toString()!=='[object Object]') {
				json = JSON.parse(json);
			}
			let data = json.data;
			if (json.event == 'new_thread' && board === data.thread.board) {
				console.log(event.data, data.thread.board, board);
				let e;
				pub.newEventRegister(json).then((r) => {
					console.log('ev:', events);
					if (!r) {
						return new Promise((r) => {
							r(0)
						});
					};
					return addpost.addNewThread(data.thread.board, data.thread.title, data.key, {
						name: data.res.name,
						mail: data.res.mail,
						content: data.res.content,
						date: data.res.date
					});
				}).then((r) => {
					console.log('resolve:', r);
					console.log(event.data);
				});
			} else if (json.event == 'new_res' && data.boardname == board) {
				Thread.findOne({
					key: data.thread
				}).then((thread) => {
					console.log(event.data, thread.key, data.thread, data.boardname, board);
					return pub.newEventRegister(json)
				}).then((r) => {
					console.log(data);
					return addpost.addNewRes(data.boardname, data.thread, {
						name: data.res.name,
						mail: data.res.mail,
						content: data.res.content,
						date: data.res.date,
						id: data.res.id
					});
				}).then((r) => {
					console.log('resolve:', r);
					console.log(event.data);
				});
			}
		});
	}
}


pub.newEventRegister = (json) => {
	console.log('json:', json);
	let e, data = json.data;
	return Event.find({
		eid: json.eid
	}).then((c) => {
		console.log('events:', events, c);
		if (c.length != 0 || events.indexOf(json.eid) >= 0) {
			console.log('doubled:', c, events.indexOf(json.eid));
			return new Promise((resolve) => {
				resolve(false)
			});
		} else {
			if (typeof json.eid !== 'undefined') {
				events.push(json.eid);
			}
			console.log(events, em);
			console.log('e:',json);
			em.emit('events', json);
			console.log(es);
		};
		e = new Event(json);
		return e.save();
	});
}

module.exports = pub;
