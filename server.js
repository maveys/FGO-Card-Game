const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.Server(app);

var logger = require('morgan');
var io = require('./lib/Socket').initialize(server);

// view engine setup
app.set('port', PORT);
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/partials')]);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('index'));

server.listen(PORT, '0.0.0.0', function() {
    console.log('starting server on port ' + PORT);
});