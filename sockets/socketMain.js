const io = require("../servers").io;
const Orb = require("./classes/Orb");
let orbs = [];

initGame();

// begin at the start of every game
function initGame(){
  for (let i = 0; i < 500; i++){
    orbs.push(new Orb());
  }
}

module.exports = io;