/**
 * The file to start a server
 *
 */

var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

var app = express();

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var route = require('./router/revision.server.routes');
var userRouter = require('./router/users');
var phoneRouter = require('./router/interface');
//var indexRouter = require('./router/index');

app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());

//app.use('/', indexRouter);
app.use('/servers', route);
app.use('/users', userRouter);
app.use('/phones', phoneRouter);

app.listen(3000, function() {
    console.log('Revision app listening on port 3000!')
});

module.exports = app;