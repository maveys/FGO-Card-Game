var socketio = require('socket.io');
var ejs = require('ejs');
var fs = require('fs');
var Board = require('./Board');

var io = null;
var gameCollection = new function() {
    this.totalGameCount = 0,
    this.gameList = [];
};

exports.io = function() {
    return io;
}

exports.initialize = function(app) {
    io = socketio(app);
    
    io.sockets.on('connection', function(socket) {
        socket.on('register', function(data) {
    
        });
    
        /***** Hand events  *****/
        socket.on('updateHand', function() {
            var compiledHand = ejs.compile(fs.readFileSync(__dirname + '/../views/partials/hand.ejs', 'utf8'));
            var obj =  findGameRoom(socket.gameId);
            var html = compiledHand({ hand: obj.board.getPlayerHand(socket.userId) });
            socket.emit('updated-hand', html);
        });
    
        socket.on('updateOpponentHand', function() {
            var compiledHand = ejs.compile(fs.readFileSync(__dirname + '/../views/partials/opponentHand.ejs', 'utf8'));
            var html = compiledHand({ hand: findGameRoom(socket.gameId).board.getOpponentHand(socket.userId) });
            socket.emit('updated-opponent-hand', html);
        });
    
        socket.on('disconnect', function() {
            // really inefficient, if we don't remove each empty game, store index of game in socket.gameIndex
            for (var i = 0; i < gameCollection.gameList.length; i++) {
                if (gameCollection.gameList[i].id === socket.gameId) {
                    gameCollection.gameList[i].board.removePlayer(socket.userId);
                    if (gameCollection.gameList[i].board.players.size == 0) {
                        gameCollection.gameList.splice(i, 1);
                    }
                    return;
                }
            }
        });
    
        /***** Game events *****/
        socket.on('joinRoom', function(data) {
            var index = gameRoomIndex(data.gameId);
    
            if (index === -1) {
                socket.emit('joinError', {error: "Room does not exist."});
                return;
            }
            socket.gameId = data.gameId;
            socket.username = data.username;
            socket.userId = 1;

            gameCollection.gameList[index].board.addPlayer('data.username', socket.userId);
            gameCollection.gameList[index].board.initGame();
            socket.join(data.gameId);
        
            io.sockets.in(data.gameId).emit('initGame');
        });
    
        socket.on('createGameInstance', function(data) {
            var gameRoom = {};
            var gameId = (Math.random()+1).toString(36).slice(2, 18);

            socket.gameId = gameId;
            socket.userId = 0;
            socket.join(gameId);

            gameRoom.id = gameId;
            gameRoom.board = new Board();
            gameRoom.board.addPlayer('Mav', socket.userId);
            gameCollection.gameList.push(gameRoom);
            socket.emit("roomCreated", {gameId: gameId});
        });
    
        socket.on('initGame', function() {
            var compiledField = ejs.compile(fs.readFileSync(__dirname + '/../views/partials/field.ejs', 'utf8'));
            var html = compiledField();
            socket.emit('initField', html);
        });
    
        socket.on('playServant', function(data) {
            // check if user has servant in hand
            var gameIndex = gameRoomIndex(socket.gameId);
            if (gameCollection.gameList[gameIndex].board.updatePlayer(socket.userId, data.servantId)) {
                socket.emit('placeServant', { success: true, servantId: data.servantId });
                socket.broadcast.to(socket.gameId).emit('opponentPlayedServant', { imgLink: 'cardBack' });
            } else {
                socket.emit('placeServant', { success: false, message: 'You cannot place this servant.' });
                console.log('player cannot place this card');
            }
        });

        socket.on('battle', function(data) {
            var gameIndex = gameRoomIndex(socket.gameId);
            gameCollection.gameList[gameIndex].activateBattle();
            socket.emit();
        });
    });
};

function findGameRoom(id) {
    for (var i = 0; i < gameCollection.gameList.length; i++) {
        if (gameCollection.gameList[i].id === id) return gameCollection.gameList[i];
    }
}

function gameRoomIndex(id) {
    for (var i = 0; i < gameCollection.gameList.length; i++) {
        if (gameCollection.gameList[i].id === id) return i;
    }
    return -1;
}