var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var PORT = process.env.PORT || 3000;
var Board = require('./lib/Board');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var board = new Board();

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

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('join-room', function(data) {
        console.log(data.username + " connected")
        board.addPlayer(data.username, socket);
    });
    socket.on('register', function(data) {

    });
    socket.on('play-servant', function(data) {
        board.playServant(socket, data.servant);
        if (board.confirmedPlayerOneTurn && board.confirmedPlayerTwoTurn) {
            board.activateBattle();
        }
    });
    socket.on('init-game', function() {
        console.log(board);
        board.initGame();
        socket.emit('init-game', JSON.stringify(board));
    })
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

server.listen(PORT, function() {
    console.log('starting server on port ' + PORT);
});