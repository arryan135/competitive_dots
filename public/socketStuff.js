let socket = io.connect();

// function called when the user clicks the start to play button
function init() {
  draw(); // drawing to the screen
  socket.emit("init", {
    playerName: player.name
  });
}

socket.on("initReturn", data => {
  orbs = data.orbs;
  setInterval(() => {
    if (player.xVector){
      socket.emit("tick", {
        xVector: player.xVector,
        yVector: player.yVector
      });
    }
  }, 33);
});

socket.on("tock", data => {
  players = data.players
  // player.locX = data.playerX,
  // player.locY = data.playerY
});

socket.on('tickTock', (data) => {
  player.locX = data.playerX,
  player.locY = data.playerY
});

socket.on("orbSwitch", data => {
  orbs.splice(data.orbIndex, 1, data.newOrb);
});