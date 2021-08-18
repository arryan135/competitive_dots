const io = require("../servers").io;
const Orb = require("./classes/Orb");
const Player = require("./classes/Player");
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");

let orbs = [];
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

io.sockets.on("connect",  socket => {

  let playerConfig = new PlayerConfig(settings);
  let playerData = new PlayerData(null, settings);
  let player = new Player(socket.id, playerConfig, playerData);

  socket.emit("init", {orbs});
})

// begin at the start of every game
function initGame(){
  for (let i = 0; i < settings.defaultOrbs; i++){
    orbs.push(new Orb(settings));
  }
}

module.exports = io;