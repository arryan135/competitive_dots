const draw = () => {

  // reset the translate done in the previous draw call
  context.setTransform(1, 0, 0, 1, 0, 0);

  // wipe out the entire canvas everytime draw is called
  context.clearRect(0, 0, canvas.width, canvas.height);

  // clamp the camera to the player 
  const camX = -player.locX + canvas.width/2;
  const camY = -player.locY + canvas.height/2;
  // allos us to move canvas around
  context.translate(camX, camY);

  // draw all the players
  players.forEach(player => {
    // tell the context to start drawing
    context.beginPath();
    context.fillStyle = player.color;
    // arguments 1 and 2 are the radius of the circle
    // argument 3 is the radius of the circle
    // argument 4 where to start drawing the circle in radians
    // argument 5 is where to stop drawing the circle in radians
    context.arc(player.locX, player.locY, player.radius, 0, Math.PI*2);
    // fill the circle
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = `rgb(0,255,0)`;
    // this will put border around the circle
    context.stroke();
  })

  // draw all the orbs
  orbs.forEach(orb => {
      context.beginPath();
      context.fillStyle = orb.color;
      context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
      context.fill();
  });

  // recursively draw circles for every second the browser is on. 
  requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', event => {
  const mousePosition = {
      x: event.clientX,
      y: event.clientY
  };
  // figuring out the angle of where the mouse is at
  const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
  // figuring out in which quadrant the ouse is at
  if (angleDeg >= 0 && angleDeg < 90){
      xVector = 1 - (angleDeg/90);
      yVector = -(angleDeg/90);
  } else if (angleDeg >= 90 && angleDeg <= 180){
      xVector = -(angleDeg-90)/90;
      yVector = -(1 - ((angleDeg-90)/90));
  } else if (angleDeg >= -180 && angleDeg < -90){
      xVector = (angleDeg+90)/90;
      yVector = (1 + ((angleDeg+90)/90));
  } else if (angleDeg < 0 && angleDeg >= -90){
      xVector = (angleDeg+90)/90;
      yVector = (1 - ((angleDeg+90)/90));
  }

  player.xVector = xVector;
  player.yVector = yVector; 
});