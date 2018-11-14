var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var PORT = process.env.PORT || 3000;
var Board = require('./lib/Board');
var socketIO = require('socket.io');
var ejs = require('ejs');
var fs = require('fs');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var board = new Board();
var rooms = ["default"];
var gameCollection = new function() {
    this.totalGameCount = 0,
    this.gameList = [];
};
// view engine setup
app.set('port', PORT);
app.set('views', [path.join(__dirname, 'views'),
                  path.join(__dirname, 'views/partials')]);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index', {user: {username: 'Mav'}});
});

app.post('/updateOpponentHand', function(req, res) {
    console.log('request: ' + req.socketId);
    let opp = board.getOpponentPlayer(req.socketId);
    // delete later
    console.log(opp);
    opp.hand = [1, 2, 3, 4, 5, 6];
    console.log(opp.hand)
    res.render('opponentHand', { hand: opp.hand });
});

io.on('connection', function(socket) {
    console.log('a user connected');

    /***** Room events *****/
    socket.on('createGameInstance', function(data) {
        var gameRoom = {};
        var gameId = (Math.random()+1).toString(36).slice(2, 18);
        gameRoom.id = gameId;
        gameRoom.board = new Board();
        gameRoom.board.addPlayer('Mav', socket.id);
        gameRoom.board.initGame();
        gameCollection.gameList.push(gameRoom);
        socket.gameId = gameId;
    });

    socket.on('join-room', function(data) {
        console.log(data.username + " connected")
        if (rooms.indexOf(data.room) === -1) {
            socket.room = data.room;
            socket.username = data.username;
            socket.join(data.room);
            socket.emit("success");
        }
        board.addPlayer(data.username, socket);
    });
    socket.on('register', function(data) {

    });

    /***** Board events *****/
    socket.on('play-servant', function(data) {
        let player = board.getPlayer(socket.id);
        if (player.hand.includes(data.servantId)) {
            console.log('played servant id: ' + data.servantId);
        } else {
            console.log('player does not have this card');
        }
    });
    socket.on('init-game', function() {
        board.initGame();
        socket.emit('init-game', JSON.stringify(board));
    });

    /***** Hand events  *****/
    socket.on('update-hand', function() {
        var compiledHand = ejs.compile(fs.readFileSync(__dirname + '/views/partials/hand.ejs', 'utf8'));
        var obj =  findGameRoom(socket.gameId);
        var html = compiledHand({ hand: obj.board.getPlayerHand(socket.id) });
        socket.emit('updated-hand', html);
    });
    socket.on('update-opponent-hand', function() {
        var compiledHand = ejs.compile(fs.readFileSync(__dirname + '/views/partials/opponentHand.ejs', 'utf8'));
        var html = compiledHand({ hand: findGameRoom(socket.gameId).board.getOpponentHand(socket.id) });
        socket.emit('updated-opponent-hand', html);
    });

    socket.on('disconnect', function() {
        // really inefficient 
        for (var i = 0; i < gameCollection.gameList.length; i++) {
            if (gameCollection.gameList[i].id === socket.gameId) {
                gameCollection.gameList[i].board.removePlayer(socket.id);
                if (gameCollection.gameList[i].board.players.length == 0) {
                    gameCollection.gameList.splice(i, 1);
                    return;
                } else {
                    return;
                }
            }
        }
    });
});

function findGameRoom(id) {
    for (var i = 0; i < gameCollection.gameList.length; i++) {
        if (gameCollection.gameList[i].id === id) return gameCollection.gameList[i];
    }
}
server.listen(PORT, '0.0.0.0', function() {
    console.log('starting server on port ' + PORT);
});