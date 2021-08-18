let socket = io.connect();

// fucntion called when the user clicks the start to play button
function init() {
  draw(); // drawing to the screen
  socket.emit("init", {
    playerName: player.name
  });
}

socket.on("initReturn", data => {
  orbs = data.orbs;
});