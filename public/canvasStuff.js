function init() {
  draw();
}

let randomX = Math.floor(500*Math.random() + 100);
let randomY = Math.floor(500*Math.random() + 100);

const draw = () => {
  // tell the context to start drawing
  context.beginPath();
  context.fillStyle = `rgb(255,0,0)`;
  // arguments 1 and 2 are the radius of the circle
  // argument 3 is the radius of the circle
  // argument 4 where to start drawing the circle in radians
  // argument 5 is where to stop drawing the circle in radians
  context.arc(randomX, randomY, 10, 0, Math.PI*2);
  // fill the circle
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = `rgb(0,255,0)`;
  // this will put border around the circle
  context.stroke();
  // recursively draw circles for every second the browser is on. 
  requestAnimationFrame(draw);
}