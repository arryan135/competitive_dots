const io = require("../servers").io;
const Orb = require("./classes/Orb");
const Player = require("./classes/Player");
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");

let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  // as plyer gets big, we need to zoom out
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500
}

initGame();

// issue message to every connected socket 30 FPS
setInterval(() => {
  io.to("game").emit("tock", {
    players
  });
}, 33); // 1/30th of a second

io.sockets.on("connect",  socket => {
  socket.on("init", data => {
    socket.join("game")

    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(data.playerName, settings);
    let player = new Player(socket.id, playerConfig, playerData);

    socket.emit("initReturn", {orbs});
    players.push(playerData);
  });
});

// begin at the start of every game
function initGame(){
  for (let i = 0; i < settings.defaultOrbs; i++){
    orbs.push(new Orb(settings));
  }
}

module.exports = io;