var express = require('express');
var router = express.Router();
var subjects = require('./subjects');
var dat = require('./dat');
var bbs = require('./bbs');
var read = require('./read');
var conf = require('config');

router.use('/bbs.cgi', bbs);
router.use('/read.cgi/*', read);

module.exports = router;
