const io = require("../servers").io;
const Orb = require("./classes/Orb");
const Player = require("./classes/Player");
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");
const checkForOrbCollisions = require("./checkCollisions").checkForOrbCollisions;
const checkForPlayerCollisions = require("./checkCollisions").checkForPlayerCollisions;

let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  // as plyer gets big, we need to zoom out
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000
}

initGame();

// Issue a message ro EVERY connected socket 30 fps
setInterval(() => {
  // console.log('tock');
  if(players.length > 0) {
    // tell where the players need to be placed
    io.to('game').emit('tock', {
      players
    });
  }
}, 33);

io.sockets.on("connect",  socket => {
  let player = {};
  player.tickSent = false;

  socket.on("init", data => {
    socket.join("game")

    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(data.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);

    // issue message to this client with its loc 30 FPS
    setInterval(() => {
      if (player.tickSent){
        // tell where the camera needs to clamp for the user
        socket.emit('tickTock', {
          playerX: player.playerData.locX,
          playerY: player.playerData.locY,
        });
        player.tickSent = false;
      }
    }, 33); // 1/30th of a second

    socket.emit("initReturn", {orbs});
    players.push(playerData);
  });

  // server sent over a tick so we know what direction we want the player to move to
  socket.on("tick", data => {
    player.tickSent = true;
    if (data.xVector && data.yVector){
      speed = player.playerConfig.speed;
      // update the playerconfig object with the new direction in data
      // at the same time create a local variable for this callback for readability
      xV = player.playerConfig.xVector = data.xVector;
      yV = player.playerConfig.yVector = data.yVector;
    
      // move the player along the line of the mouse direction
      if ((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
          player.playerData.locY -= speed * yV;
      } else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
          player.playerData.locX += speed * xV;
      } else{
          player.playerData.locX += speed * xV;
          player.playerData.locY -= speed * yV;
      }
      player.tickSent = true; 
      
      // Orb Collison
      let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);
      capturedOrb.then(data => {
        // runs if resolve runs, a collison happened 

        const orbData = {
          orbIndex: data,
          newOrb: orbs[data]
        }
        io.emit("updateIndividualScore", player.playerData.score);
        // every socket needs to know that the leaderboard has changed
        io.sockets.emit("updateLeaderBoard", getLeaderBoard()); 
        // emit to all sockets the orb that needs to be replaced
        io.sockets.emit("orbSwitch", orbData);
      }). catch(() => {
        // runs if reject runs, no coliision happened
        
      });

      // Player Collison
      let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId);
      playerDeath.then(data => {
        io.sockets.emit("updateLeaderBoard", getLeaderBoard()); 
      }).catch(() => {

      })
    } 
  });
});

function getLeaderBoard(){
  // sort players in desc order
  players.sort((a, b) => b.score - a.score);
  let leaderBoard = players.map(curPlayer => ({
    name: curPlayer.name,
    score: curPlayer.score
  }));

  return leaderBoard;
}

// begin at the start of every game
function initGame(){
  for (let i = 0; i < settings.defaultOrbs; i++){
    orbs.push(new Orb(settings));
  }
}

module.exports = io;