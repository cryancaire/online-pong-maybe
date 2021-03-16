var socketio = io();
var gameArea = document.getElementById('gameArea');
var ball = document.getElementById('__ball');
var ballMomentum = Number(1);
var playerScore = sessionStorage.getItem('myScore') || 0;

socketio.on('connection', () => {
    socketio.emit('connection', socket);
});

socketio.on('playerList', function(list){
    let userListText = document.getElementById('userList');
    userListText.innerText = `Users`;
    $('.playerClass').remove();
    list.forEach((element, index) => {
        let userOnList = document.createElement('div');
        userOnList.classList.add('playerList');
        userOnList.innerHTML = `${element.id} - <span id="playerScore__${element.id}">${element.score}</span>`;
        userListText.append(userOnList);
        
    });
  });

socketio.on('doMove', (info) => {
    var paddleOffsetHeight = document.getElementById('__theirPaddle').offsetHeight;
    var gameAreaOffsetHeight = document.getElementById('gameArea').offsetHeight;
    if (info.mouseY > 0 && info.mouseY < (gameAreaOffsetHeight - paddleOffsetHeight)) {
        document.getElementById('__theirPaddle').style.top = (info.mouseY + 8) + 'px';
    }
});

gameArea.addEventListener('mousemove', e => {
    //playerScore++;
    //document.getElementById(`playerScore__${socketio.id}`).innerText = playerScore;
    var paddleOffsetHeight = document.getElementById('__yourPaddle').offsetHeight;
    var gameAreaOffsetHeight = document.getElementById('gameArea').offsetHeight;
    if (e.offsetY > 0 && e.offsetY < (gameAreaOffsetHeight - paddleOffsetHeight)) {
        document.getElementById('__yourPaddle').style.top = e.offsetY + 'px';
    }
    
    socketio.emit('mouseMove', {
       id: socketio.id,
       mouseX: e.offsetX,
       mouseY: e.offsetY,
       score: playerScore,
    });
});

setInterval(() => {
    sessionStorage.setItem('myScore', playerScore);
}), 1000;

let startDir = Math.floor((Math.random()*100) + 1);
    if (startDir >= 50) {
        ballMomentum = 1;
    } else {
        ballMomentum = -1;
    }
    
let moveBall = setInterval(() => {
    var gameAreaOffsetWidth = document.getElementById('gameArea').clientWidth;
    let leftNum = ball.getClientRects()[0].left;
    let rightNum = ball.getClientRects()[0].right;
    let topNum = ball.getClientRects()[0].top;
    //console.log(leftNum)
    //dont have this figured out yet, but will likely be moving to
    //backend index.js for better syncing
    
    if (leftNum > 0 && leftNum < (gameAreaOffsetWidth - 10)){
        if (ballMomentum > 0) {
            ball.style.left = ((leftNum) + (ballMomentum)) + 'px';
        } else {
            ball.style.right = ((rightNum) - (ballMomentum)) + 'px';
        }
    }

    socketio.emit('ballMove', {
        id: socketio.id,
        ballX: leftNum,
        ballY: topNum
     });
}, 10);


socketio.on('doMoveBall', (info) => {
    ball.style.left = info.ballX;
    ball.style.top = info.ballY;
});