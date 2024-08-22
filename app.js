let x = 50;
let y = 50;
let diameter = 50;
let movingRight = true;
let iconFont;
let wordFont;

function preload() {
  iconFont = loadFont("fonts/fa-solid.ttf");
  wordFont = loadFont("fonts/arcade-classic.ttf");
}

function setup() {
  createCanvas(800, 600);
  textFont(wordFont);
}

function draw() {
  textFont(wordFont, 80);
  text("PAUSED", width / 2, height / 2 - 40, 80);
  textSize(30);
  text("Press p to continue", width / 2, height / 2 + 10, 30);
}
