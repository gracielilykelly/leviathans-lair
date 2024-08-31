let x = 50;
let y = 50;
let diameter = 50;
let movingRight = true;
let iconFont;
let wordFont;
let game;
let playerName;
let difficultyLevel;

function preload() {
  iconFont = loadFont("fonts/fa-solid.ttf");
  wordFont = loadFont("fonts/joystix-monospace.otf");
}

function createGame() {
  game = new Game(difficultyLevel, name);
}

let nameField;
function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  playerName = prompt(
    "Welcome to Leviathan's Lair!\nPlease enter your name (max 10 chars)",
    "BOB"
  );
  difficultyLevel = prompt(
    "Enter difficulty level (NOVICE, NORMAL, EXPERT)",
    "NORMAL"
  );
  textFont(wordFont);
  createGame();
}

function windowResized() {
  width = window.innerWidth;
  height = window.innerHeight;
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function endGamesRun() {
  // set the highest score
  game.getPlayer().setHighScore();
  // display info to player
  const startOver = confirm(
    "Total Games Played: " +
      game.getPlayer().getGameAttempts() +
      "\n\n" +
      "Highest Score: " +
      game.getPlayer().highestScore() +
      "\n" +
      "Lowest Score:  " +
      game.getPlayer().lowestScore() +
      "\n" +
      "Average Score: " +
      game.getPlayer().averageScore() +
      "\n\nStart Over?"
  );

  // restart the game if they want to play again
  if (startOver) {
    createGame();
  } else {
    remove();
    document.getElementById("thanks").style.display = "flex";
  }
}

function gameOver() {
  // Ends the game and shows info to the player
  // add score to player's scores
  game.getPlayer().addScoretoList(game.getPlayer().getCurrentScore());

  // if the player still has games left to play ask if they want to continue to next game
  if (
    game.getPlayer().getGameAttempts() < game.getPlayer().getNumberOfGames()
  ) {
    // check if player wants to play again
    const playAgain = confirm(
      "Game Over!\n\nYou scored " +
        game.getPlayer().getCurrentScore() +
        ".\n\nKeep Playing?"
    );

    if (playAgain) {
      // reset the game to be played again
      game.reset();
    } else {
      // end the games
      endGamesRun();
    }
  } else {
    // the player has no more games left in the tournament
    endGamesRun();
  }
}

// handle key events
function keyPressed() {
  if (keyCode == UP_ARROW) {
    // move the submarine up
    game.getSubmarine().setTravelSpeed(2.5);
    game.getSubmarine().setIsBoosting(true);
  } else if (keyCode == DOWN_ARROW) {
    // move the submarine down
    game.getSubmarine().setTravelSpeed(-2.5);
  } else if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
    // rotate the submarine
    game.getSubmarine().setRotation(keyCode);
  } else if (keyCode == 32) {
    //32 is SPACE KEY
    // shoot a missile
    game.getSubmarine().setIsAllowedFireMissile();
    game
      .getSubmarine()
      .getMissileShooter()
      .shootSingle(
        game.getProjectiles(),
        game.getAvailableProjectileIndexes(1)[0],
        game.getSubmarine().getXCord(),
        game.getSubmarine().getYCord(),
        game.getSubmarine().getRotation()
      );
  } else if (key == "s" || key == "S") {
    // activate shield
    game.getSubmarine().activateShield();
  } else if (key == "b" || key == "B") {
    // shoot bomb
    if (game.getSubmarine().getHasBomb()) {
      game
        .getSubmarine()
        .getBombShooter()
        .shootMultiple(
          game.getProjectiles(),
          game.getAvailableProjectileIndexes(14),
          game.getSubmarine().getXCord(),
          game.getSubmarine().getYCord()
        );
    }
    // remove the bomb from submarine inventory
    game.getSubmarine().setHasBomb(false);
  } else if (key == "p" || key == "P") {
    // (un)pause the game
    game.setRunGame(!game.getRunGame());
  } else if (key == "e" || key == "E") {
    // display option to exit the game

    // pause the game
    game.setRunGame(false);
    let exitGame = getConfirmationFromUser("Are you sure you want to quit?");
    if (exitGame == 0) {
      exit();
    } else {
      // continue the game
      game.setRunGame(true);
    }
  } else if (key == "i" || key == "I") {
    // display game controls
    alert(
      "Controls: \n" +
        "\u2191 \u2193 = Move Submarine\n" +
        "\u2192 \u2190 = Rotate Submarine\n" +
        "[Spacebar] = Shoot Projectile\n" +
        "[B] = Shoot Bombs\n" +
        "[S] = Activate Shield\n" +
        "[P] = Pause Game\n" +
        "[I] = See Controls"
    );
  }
}

function keyReleased() {
  // stop moving submarine
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    if (keyCode == UP_ARROW) {
      game.getSubmarine().setIsBoosting(false);
    }
    game.getSubmarine().setTravelSpeedToZero();
  }
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
    textFont(wordFont, 80);
    textAlign(CENTER);
    text("PAUSED", width / 2 - 40, height / 2 - 50, 80);
    textSize(20);
    text("Press p to continue", width / 2 - 190, height / 2 + 20, 380);
  }
}
