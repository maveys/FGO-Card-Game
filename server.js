var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var PORT = process.env.PORT || 3000;

var app = express();
var server = http.Server(app);

// view engine setup
app.set('port', PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index', {user: {username: 'Mav'}});
});

server.listen(PORT, function() {
    console.log('starting server on port ' + PORT);
});