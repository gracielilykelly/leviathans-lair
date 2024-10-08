const ENEMY_CHOICES = ["JELLYFISH", "PIRANHA", "PUFFERFISH", "SHARK"];
const PICKUP_CHOICES = ["HEART", "BOMB", "DIAMOND", "SHIELD"];
const DIFFICULTY_LEVELS = ["NOVICE", "NORMAL", "EXPERT"];

class Game {
  constructor(chosenDifficulty, playerName) {
    this.lives = 3;
    this.boulderMinSize = 50;
    this.boulderMaxSize = 100;
    this.player = new Player(playerName);
    this.runGame;
    this.bossAdded = false;
    this.bossDefeated = false;
    this.pickupsToInclude = [];
    this.enemiesToInclude = [];
    this.submarine = new Submarine();
    this.scoreboard;
    this.boulders = [];
    this.projectiles = [];
    this.pickups = [];
    this.enemies = [];
    this.numberOfBoulders = 0;
    this.numberOfEnemies = 0;
    this.pickupDropPercentage;
    this._setDifficultyLevel(chosenDifficulty);
    this._setPropsBasedOnDifficulty(this.difficulty);
    this.initializeAssets();
  }

  _setDifficultyLevel(difficultyLevel) {
    // set default if none provided
    if (!difficultyLevel || !DIFFICULTY_LEVELS.includes(difficultyLevel.toUpperCase())) {
      this.difficulty = DIFFICULTY_LEVELS[1];
    } else {
      this.difficulty = difficultyLevel.toUpperCase();
    }
  }

  _setPropsBasedOnDifficulty(difficultyLevel) {
    // creates game based on a chosen difficulty

    // depending on the difficulty set certain attributes
    if (difficultyLevel === "NOVICE") {
      this.setNumberOfBoulders(5);
      this.setNumberOfEnemies(3);
      this.setEnemiesToInclude(subset(ENEMY_CHOICES, 2, 1));
      this.setPickupsToInclude(PICKUP_CHOICES);
      this.setPickupDropPercentage(100);
    } else if (difficultyLevel === "NORMAL") {
      this.setNumberOfBoulders(10);
      this.setNumberOfEnemies(10);
      this.setEnemiesToInclude(ENEMY_CHOICES);
      this.setPickupsToInclude(PICKUP_CHOICES);
      this.setPickupDropPercentage(50);
    } else if (difficultyLevel === "EXPERT") {
      this.setNumberOfBoulders(15);
      this.setNumberOfEnemies(25);
      this.setEnemiesToInclude(ENEMY_CHOICES);
      this.setPickupsToInclude(subset(PICKUP_CHOICES, 2, 1));
      this.setPickupDropPercentage(10);
    }
  }

  initializeAssets() {
    this.scoreboard = new Scoreboard();
    this.submarine = new Submarine();

    // create assets
    this.boulders = Array.from(
      { length: this.numberOfBoulders },
      () => new Boulder()
    );
    this.pickups = Array.from(
      { length: this.numberOfBoulders },
      () => new Pickup()
    );
    this.projectiles = Array.from({ length: 150 }, () => new Projectile());

    // create enemies
    for (let i = 0; i < this.numberOfEnemies; i++) {
      this.enemies[i] = new Enemy(
        this.enemiesToInclude[floor(random(0, this.enemiesToInclude.length))]
      );
      this.enemies[i].getAsset().setSpawnLocationForSubmarine(this.submarine);
    }

    this.setRunGame(true);
  }

  // getters
  getRunGame() {
    return this.runGame;
  }

  getPickupDropPercentage() {
    return this.pickupDropPercentage;
  }

  getDifficulty() {
    return this.difficulty;
  }

  getPlayer() {
    return this.player;
  }

  getSubmarine() {
    return this.submarine;
  }

  getProjectiles() {
    return this.projectiles;
  }

  getAvailableProjectileIndexes(amount) {
    /* Get indexes of available projectiles from list of game's projectiles
     params:
     amount (int) - how many projectile indexes to get
     */
    let availableProjectileIndexes = [amount];
    let x = 0;
    let checkedIndex = 0;
    // loop through projectiles
    while (x < amount) {
      // if it has not been fired add the index to the list
      if (!this.projectiles[checkedIndex].getFired()) {
        availableProjectileIndexes[x] = checkedIndex;
        x++;
      }
      checkedIndex++;
    }
    return availableProjectileIndexes;
  }

  // setters
  setRunGame(gameShouldBeRun) {
    this.runGame = gameShouldBeRun;
  }

  setBossAdded(bossWasAdded) {
    this.bossAdded = bossWasAdded;
  }

  setNumberOfBoulders(num) {
    this.numberOfBoulders = num;
  }

  setNumberOfEnemies(num) {
    this.numberOfEnemies = num;
  }

  setEnemiesToInclude(includeArr) {
    this.enemiesToInclude = includeArr;
  }

  setPickupsToInclude(includeArr) {
    this.pickupsToInclude = includeArr;
  }

  setPickupDropPercentage(percentage) {
    this.pickupDropPercentage = percentage;
  }

  setBossDefeated(bossIsDefeated) {
    this.bossDefeated = bossIsDefeated;
  }

  // methods
  addBoulder(index) {
    /* Add boulder to list of boulders at certain index
     params:
     index (int) - where in boulders array to add boulder
     */
    if (this.difficulty == "EXPERT") {
      // create fast and small boulders
      this.boulders[index] = new Boulder(10);
    } else {
      this.boulders[index] = new Boulder(
        floor(random(this.boulderMinSize, this.boulderMaxSize))
      );
    }
    this.boulders[index]
      .getAsset()
      .setSpawnLocationForSubmarine(this.submarine);
  }

  handleProjectiles() {
    for (let i = 0; i < this.projectiles.length; i++) {
      //check if hitting the submarine
      if (
        this.projectiles[i].isHittingPlayer(
          this.submarine.getXCord(),
          this.submarine.getYCord(),
          this.submarine.getSize()
        )
      ) {
        this.submarine.handleHit();
      }

      //check if hitting a boulder
      for (let j = 0; j < this.boulders.length; j++) {
        const hitBoulder = this.projectiles[i].isHitting(
          this.boulders[j].getAsset().getXCord(),
          this.boulders[j].getAsset().getYCord(),
          this.boulders[j].getAsset().getSize()
        );

        if (hitBoulder) {
          // increase the player's score
          this.player.increaseCurrentScore(5);

          // add a pickup for the hit boulder
          this.pickups[j] = new Pickup(
            this.boulders[j].getAsset().getXCord(),
            this.boulders[j].getAsset().getYCord(),
            this.pickupsToInclude[
              floor(random(0, this.pickupsToInclude.length))
            ]
          );

          //calculate drop rate for pickup and dsiplay it
          if (floor(random(0, 101)) <= this.pickupDropPercentage) {
            this.pickups[j].displayPickup();
          }

          // remove current boulder and add a new boulder offscreen
          this.addBoulder(j);

          this.boulders[j].getAsset().setSpawnLocation();

          // replace the projectile with a new one
          this.projectiles[i] = new Projectile();
        }
      }

      for (let k = 0; k < this.enemies.length; k++) {
        //check if hitting an enemy
        let hitEnemy = this.projectiles[i].isHitting(
          this.enemies[k].getAsset().getXCord(),
          this.enemies[k].getAsset().getYCord(),
          this.enemies[k].getAsset().getSize()
        );

        if (hitEnemy) {
          this.enemies[k].loseLife();

          if (this.enemies[k].getLives() <= 0) {
            this.player.increaseCurrentScore(this.enemies[k].getScoreAmount());
            if (this.enemies[k].getType() == "LEVIATHAN") {
              // remove leviathan from list of enemies
              let levIndx = this.enemies.indexOf(
                (enemy) => enemy.getType() == "LEVIATHAN"
              );
              this.enemies.splice(levIndx, 1);
              this.setBossDefeated(true);
              this.setBossAdded(false);
            } else {
              // remove current enemy and add a new enemy
              this.enemies[k] = new Enemy(
                this.enemiesToInclude[
                  floor(random(0, this.enemiesToInclude.length))
                ]
              );
              this.enemies[k]
                .getAsset()
                .setSpawnLocationForSubmarine(this.submarine);
            }
          }
          this.projectiles[i] = new Projectile();
        }
      }

      //replenish projectile if out of bounds
      if (!this.projectiles[i].isInBounds()) {
        this.projectiles[i] = new Projectile();
      }

      this.projectiles[i].update();
      this.projectiles[i].render();
    }
  }

  handlePickups() {
    let i = 0;
    // loop through all the pickups and update
    while (i < this.pickups.length) {
      this.pickups[i].render();
      this.pickups[i].move(this.submarine);

      // check if pickup is able to be interacted with
      if (this.pickups[i].getAllow() && this.pickups[i].getShow()) {
        if (this.pickups[i].getAsset().isColliding(this.submarine)) {
          if (this.pickups[i].getType() === "HEART") {
            // add a life
            this.submarine.addLives(1);
          } else if (this.pickups[i].getType() === "SHIELD") {
            // add a shield
            this.submarine.setHasShield(true);
          } else if (this.pickups[i].getType() === "DIAMOND") {
            // increase the score
            this.player.increaseCurrentScore(100);
          } else if (this.pickups[i].getType() === "BOMB") {
            // add a bomb
            this.submarine.setHasBomb(true);
          }
          // reset the pickup on collision
          this.pickups[i] = new Pickup();
        }
      }
      i++;
    }
  }

  handleSubmarine() {
    // if the submarine is invincible count down the timer
    if (this.submarine.getInvincibilityTimer() > 0) {
      this.submarine.reduceInvincibilityTimer(5);
    } else {
      this.submarine.setInvincibility(false);
    }

    this.submarine.update(this.scoreboard.getHeightDim());
    this.submarine.render();
  }

  handleBoulders() {
    let b = 0;
    while (b < this.boulders.length) {
      // check if boulder is hitting submarine
      if (this.boulders[b].getAsset().isColliding(this.submarine)) {
        this.submarine.handleHit();
      }

      this.boulders[b].getAsset().move(false);
      this.boulders[b].render();
      b++;
    }
  }

  handleEnemies() {
    for (let j = 0; j < this.enemies.length; j++) {
      let enemy = this.enemies[j];

      // check if enemy is hitting submarine
      if (enemy.getAsset().isColliding(this.submarine)) {
        this.submarine.handleHit();
      }

      if (enemy.getCanHaveWeapons()) {
        if (enemy.getActionCanBeTaken()) {
          enemy
            .getShooter()
            .shootMultiple(
              this.projectiles,
              this.getAvailableProjectileIndexes(enemy.getProjectileCount()),
              enemy.getAsset().getXCord(),
              enemy.getAsset().getYCord()
            );
        }
      }

      // add leviathan enemy if score reaches 1000 and is difficulty other than novice
      if (
        this.player.getCurrentScore() >= 1000 &&
        this.difficulty !== "NOVICE" &&
        !this.bossAdded &&
        !this.bossDefeated
      ) {
        // add leviathan to enemies and render it below other enemies
        this.enemies.push(new Enemy("LEVIATHAN"));
        this.enemies[this.enemies.length - 1].setSpawnLocation();
        this.setBossAdded(true);
      }

      this.enemies[j].update(this.submarine);
      this.enemies[j].render();
    }
  }

  run() {
    // run the game
    this.handleProjectiles();
    this.handleBoulders();
    this.handleEnemies();
    this.handlePickups();
    this.scoreboard.render(this.player, this.submarine);
    this.handleSubmarine();
  }

  reset() {
    // reset the game
    this.player.resetCurrentScore();
    this.setBossAdded(false);
    this.setBossDefeated(false);
    this.initializeAssets();
  }
}


// Scoreboard
class Scoreboard {
  constructor() {
    this.heightDim = height / 15;
    this.widthDim = width;
  }

  // getters
  getHeightDim() {
    return this.heightDim;
  }

  getWidthDim() {
    return this.widthDim;
  }

  // setters
  setHeightDim(h) {
    this.heightDim = h;
  }

  setWidthDim(w) {
    this.widthDim = w;
  }

  // methods
  render(player, submarine) {
    /* Displays the scoreboard on the screen
     params:
     player (Player) - the player whose info you wish to display
     submarine (Submarine) - the submarine of which info you wish to show
     */
    fill(79, 79, 178);
    noStroke();
    rect(0, 0, this.widthDim, this.heightDim);
    textFont(wordFont, 30);
    fill(255, 184, 28);

    // display game count
    const currentGame = player.getGameAttempts() + 1;
    textAlign(LEFT, CENTER);
    text("Game " + currentGame + "/" + player.getNumberOfGames(), 30, 25);

    // display current score
    textAlign(CENTER, CENTER);
    text(
      player.getPlayerName() + ":" + player.getCurrentScore(),
      width / 2,
      25
    );

    // display hearts
    let i = 0;
    do {
      textFont(iconFont, 15);
      fill(252, 66, 123);
      text("\uf004", this.widthDim - (80 - i * 20), this.heightDim / 2);
      i++;
    } while (i < submarine.getLives());

    textFont(iconFont, 20);
    // display shield
    if (submarine.getHasShield() && !submarine.getShieldActive()) {
      fill(46, 204, 113);
    } else {
      // grey out the shield
      fill(189, 195, 199);
    }
    text("\uf712", width - 105, this.heightDim / 2);

    // display bomb
    if (submarine.getHasBomb()) {
      fill(253, 114, 114);
    } else {
      fill(189, 195, 199);
    }
    text("\uf1e2", width - 130, this.heightDim / 2);

    // display instructions
    fill(189, 195, 199);
    textFont(wordFont, 10);
    textAlign(LEFT, CENTER);
    text("Press [i] for controls ", width - 360, 30);
  }
}

// Player
class Player {
  constructor(playerName) {
    this.currentScore = 0;
    this.scores = [];
    this.highScore = 0;
    this.gameAttempts = 0;
    this.numberOfGames = 3;
    this.name = this._setPlayerName(playerName);
  }

  _setPlayerName(playerName) {
    // Clean the username and set it
    if (playerName.length <= 0) {
      // set default name
      playerName = "Bob";
    }
    if (playerName.length > 10) {
      return playerName.substring(0, 10);
    } else {
      return playerName.toUpperCase();
    }
  }

  // getters
  getScoresList() {
    return this.scores;
  }

  getGameAttempts() {
    return this.gameAttempts;
  }

  getHighScore() {
    return this.highScore;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  getPlayerName() {
    return this.name;
  }

  getNumberOfGames() {
    return this.numberOfGames;
  }

  // setters
  setPlayerName(playerName) {
    // Clean the username and set it
    if (playerName.length() > 10) {
      this.name = playerName.substring(0, 10);
    } else {
      this.name = playerName.toUpperCase();
    }
  }
  setHighScore() {
    let scoretoSet = 0;
    for (let i = 0; i < this.scores.length; i++) {
      if (this.scores[i] > this.highScore) {
        this.highScore = this.scores[i];
      }
    }
    this.highScore = scoretoSet;
  }

  increaseGameAttempts() {
    this.gameAttempts++;
  }

  resetCurrentScore() {
    this.currentScore = 0;
  }

  increaseCurrentScore(score) {
    this.currentScore += score;
  }

  addScoretoList(score) {
    const index = this.gameAttempts - 1;
    this.scores[index] = score;
  }

  highestScore() {
    // return the highest score in the scores array
    let highestScore = this.scores[0];
    for (let i = 1; i < this.gameAttempts; i++) {
      if (this.scores[i] > highestScore) {
        highestScore = this.scores[i];
      }
    }
    return highestScore;
  }

  lowestScore() {
    // return the lowest score in the scores array
    let lowestScore = this.scores[0];
    for (let i = 1; i < this.gameAttempts; i++) {
      if (this.scores[i] < lowestScore) {
        lowestScore = this.scores[i];
      }
    }
    return lowestScore;
  }

  averageScore() {
    // calculates and returns the average of all scores stored in array
    let total = 0;
    for (let i = 0; i < this.gameAttempts; i++) {
      total = total + this.scores[i];
    }
    return Math.floor(total / this.gameAttempts);
  }
}

