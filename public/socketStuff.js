let socket = io.connect("/");

socket.on("init", data => {
  orbs = data.orbs;
});