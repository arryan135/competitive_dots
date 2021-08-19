let socket = io();

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
});

socket.on('tickTock', (data) => {
  player.locX = data.playerX,
  player.locY = data.playerY
});

socket.on("orbSwitch", data => {
  orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on("updateLeaderBoard", data => {
  document.querySelector(".leader-board").innerHTML = "";
  data.forEach(({name, score}) => {
    document.querySelector(".leader-board").innerHTML += `
      <li class="leaderboard-player">${name} - ${score}</li>
    `
  });
});

socket.on("updateIndividualScore", score => {
  document.querySelector(".player-score").innerHTML = `${score}`;
});

socket.on("playerDeath", data => {
  document.querySelector("#game-message").innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`;
  // target the message something other than black 
  $("#game-message").css({
    "background-color": "#00e6e6",
    "opacity": 1
  });
  $("#game-message").show();
  $("#game-message").fade(5000);
});