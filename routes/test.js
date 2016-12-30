var express = require('express');
var router = express.Router();
var subjects = require('./subjects');
var dat = require('./dat');
var bbs = require('./bbs');
var conf = require('config');

/* GET home page. */
router.use('/bbs.cgi', bbs);
router.use('/dat', dat);

module.exports = router;
