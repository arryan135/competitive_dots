class Orb {
  constructor(){
    // what color the orb should be
    this.color = this.getRandomColor();
    // where the orb is on the screen
    this.locX = Math.floor(Math.random() * 500);
    this.locY = Math.floor(Math.random() * 500);
    // how big will the orb be
    this.radius = 5;
  }
  getRandomColor() {
    const r = Math.floor((Math.random() * 200) + 50);
    const g = Math.floor((Math.random() * 200) + 50);
    const b = Math.floor((Math.random() * 200) + 50);
    return `rgb(${r},${g},${b})`;
  }
}

module.exports = Orb;