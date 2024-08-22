let x = 50;
let y = 50;
let diameter = 50;
let movingRight = true;
let iconFont;
let wordFont;
let game;

function preload() {
  iconFont = loadFont("fonts/fa-solid.ttf");
  wordFont = loadFont("fonts/arcade-classic.ttf");
}

function createGame() {
  game = new Game("NOVICE", "Grace");
}

function setup() {
  createCanvas(800, 600);
  textFont(wordFont);
  createGame();
}

function draw() {
  // run the game if user has not paused it
  if (game.getRunGame()) {
    // if the player has run out of lives end the game
    if (game.getSubmarine().getLives() <= 0) {
      // increase number of games played
      game.getPlayer().increaseGameAttempts();        
      gameOver();
    } else {
      background(24, 44, 97);
      game.run();
    }
  } else {
    // display a pause screen
    fill(0);
    rect(0, 0, width, height);
    fill(255);
    textFont(textFont, 80);
    text("PAUSED", width/2, height/2 - 40, 80);
    textSize(30);
    text("Press p to continue", width/2, height/2 + 10, 30);
  }
}
