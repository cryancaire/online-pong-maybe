const express = require('express');
const socketio = require('socket.io');
const app = express();

app.use(express.static(__dirname + '/public'));

let players = [];

const port = process.env.PORT || 1234;

const server = app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

const io = socketio(server);

io.on('connection', socket => {
    console.log(`Player Connected!`, socket.id);
    players.push({
        id: socket.id,
        mouseX: null,
        mouseY: null,
        score: 0
    });
    io.emit('playerList', players);
    socket.on('disconnect', () => {
        removePlayerFromList(players, socket.id);
        io.emit('playerList', players);
        console.log(`${socket.id} disconnected!`);
    });

    socket.on('mouseMove', (info) => {
        //console.log(info)
        socket.broadcast.emit('doMove', info);
    });

    socket.on('ballMove', (info) => {
        //console.log(info)
        socket.broadcast.emit('doMoveBall', info);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let removePlayerFromList = (playersList, playerId) => {
    players = [];
    playersList.forEach(el => {
        if (el.id !== playerId) {
            players.push(el)
        }
    });
}