const ENEMY_CHOICES = ["JELLYFISH", "PIRANHA", "PUFFERFISH", "SHARK"];
const PICKUP_CHOICES = ["HEART", "BOMB", "DIAMOND", "SHIELD"];
const DIFFICULTY_LEVELS = ["EASY", "NORMAL", "HARDCORE"];

class Game {
  constructor(chosenDifficulty, playerName) {
    this.boulderMinSize = 50;
    this.boulderMaxSize = 100;
    this.player = new Player(playerName);
    this.runGame = false;
    this.bossAdded = false;
    this.bossDefeated = false;
    this.pickupsToInclude = [];
    this.enemiesToInclude = [];
    this.submarine = new Submarine();
    this.scoreboard = null;
    this.boulders = [];
    this.projectiles = [];
    this.pickups = [];
    this.enemies = [];
    this.lastReplacementType = null;
    this.enemySpawnHistory = new Map();
    this.numberOfBoulders = 0;
    this.numberOfEnemies = 0;
    this.pickupDropPercentage;
    this._setDifficultyLevel(chosenDifficulty);
    this._setPropsBasedOnDifficulty(this.difficulty);
    this.initializeAssets();
  }

  _setDifficultyLevel(difficultyLevel) {
    // set default if none provided
    if (
      !difficultyLevel ||
      !DIFFICULTY_LEVELS.includes(difficultyLevel.toUpperCase())
    ) {
      this.difficulty = DIFFICULTY_LEVELS[1];
    } else {
      this.difficulty = difficultyLevel.toUpperCase();
    }
  }

  _setPropsBasedOnDifficulty(difficultyLevel) {
    // creates game based on a chosen difficulty

    // depending on the difficulty set certain attributes
    if (difficultyLevel === "EASY") {
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
    } else if (difficultyLevel === "HARDCORE") {
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
      () => new Boulder(),
    );
    this.pickups = Array.from(
      { length: this.numberOfBoulders },
      () => new Pickup(),
    );
    this.projectiles = Array.from({ length: 150 }, () => new Projectile());

    this.enemies = [];
    for (let i = 0; i < this.numberOfEnemies; i++) {
      this.enemies[i] = new Enemy(
        this.enemiesToInclude[floor(random(0, this.enemiesToInclude.length))],
      );
      this.enemies[i].getAsset().setSpawnLocationForSubmarine(this.submarine);
    }

    this.setRunGame(true);
  }

  // getters
  getRunGame() {
    return this.runGame;
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
    if (this.difficulty == "HARDCORE") {
      // create fast and small boulders
      this.boulders[index] = new Boulder(10);
    } else {
      this.boulders[index] = new Boulder(
        floor(random(this.boulderMinSize, this.boulderMaxSize)),
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
          this.submarine.getSize(),
        )
      ) {
        this.submarine.handleHit();
      }

      //check if hitting a boulder
      for (let j = 0; j < this.boulders.length; j++) {
        const hitBoulder = this.projectiles[i].isHitting(
          this.boulders[j].getAsset().getXCord(),
          this.boulders[j].getAsset().getYCord(),
          this.boulders[j].getAsset().getSize(),
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
            ],
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
        const hitEnemy = this.projectiles[i].isHitting(
          this.enemies[k].getAsset().getXCord(),
          this.enemies[k].getAsset().getYCord(),
          this.enemies[k].getAsset().getSize(),
        );

        if (hitEnemy) {
          const enemy = this.enemies[k];

          // Consume the projectile immediately so this hit cannot be applied to
          // another enemy (or to a replacement enemy) during the same frame.
          this.projectiles[i] = new Projectile();
          enemy.loseLife();

          if (enemy.getLives() <= 0) {
            this.player.increaseCurrentScore(enemy.getScoreAmount());
            if (enemy.getType() == "LEVIATHAN") {
              this.enemies.splice(k, 1);
              this.setBossDefeated(true);
              this.setBossAdded(false);
            } else {
              const replacementTypes = this.enemiesToInclude.filter(
                (type) =>
                  type !== enemy.getType() && type !== this.lastReplacementType,
              );
              const availableTypes = replacementTypes.length
                ? replacementTypes
                : this.enemiesToInclude.filter(
                    (type) => type !== enemy.getType(),
                  );
              const replacementType =
                availableTypes[floor(random(0, availableTypes.length))];
              const replacement = new Enemy(replacementType);
              replacement
                .getAsset()
                .setSpawnLocation(this.enemySpawnHistory.get(replacementType));
              this.enemySpawnHistory.set(replacementType, {
                x: replacement.getAsset().getXCord(),
                y: replacement.getAsset().getYCord(),
              });
              this.lastReplacementType = replacementType;
              this.enemies[k] = replacement;
            }
          }

          break;
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
              enemy.getAsset().getYCord(),
            );
        }
      }

      // add leviathan enemy if score reaches 1000 and is difficulty other than easy
      if (
        this.player.getCurrentScore() >= 1000 &&
        this.difficulty !== "EASY" &&
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
}

class Scoreboard {
  constructor() {
    this.heightDim = 92;
    this.widthDim = width;
  }

  getHeightDim() {
    return this.heightDim;
  }

  render(player, submarine) {
    this.widthDim = width;

    push();

    this.drawMainPanel();
    this.drawHullSection(submarine);
    this.drawScoreSection(player);
    this.drawEquipmentSection(submarine);
    this.drawControlsSection();
    this.drawBottomTrim();

    pop();
  }

  drawMainPanel() {
    const ctx = drawingContext;

    ctx.save();

    const panelGradient = ctx.createLinearGradient(0, 0, 0, this.heightDim);

    panelGradient.addColorStop(0, "rgba(27, 51, 67, 0.98)");
    panelGradient.addColorStop(0.5, "rgba(10, 27, 40, 0.98)");
    panelGradient.addColorStop(1, "rgba(4, 15, 25, 0.98)");

    ctx.fillStyle = panelGradient;
    ctx.fillRect(0, 0, this.widthDim, this.heightDim);

    ctx.restore();

    // Outer metal frame
    noFill();
    stroke(91, 135, 151);
    strokeWeight(3);
    rect(3, 3, this.widthDim - 6, this.heightDim - 6, 5);

    stroke(20, 226, 211, 80);
    strokeWeight(1);
    rect(8, 8, this.widthDim - 16, this.heightDim - 16, 3);

    // Internal panels
    fill(2, 18, 27, 170);
    stroke(68, 107, 119);
    strokeWeight(1);

    rect(18, 15, 270, 60, 5);
    rect(this.widthDim / 2 - 175, 15, 350, 60, 5);
    // Keep equipment and controls visually separate.
    rect(this.widthDim - 335, 15, 218, 60, 5);
    rect(this.widthDim - 108, 15, 90, 60, 5);
  }

  drawHullSection(submarine) {
    const x = 32;
    const y = 25;

    noStroke();
    fill(106, 195, 205);
    textFont(wordFont, 10);
    textAlign(LEFT, CENTER);
    text("HULL INTEGRITY", x, y);

    const maxLives = 3;
    const currentLives = submarine.getLives();

    const barX = x;
    const barY = y + 16;
    const segmentWidth = 75;
    const segmentHeight = 18;
    const gap = 6;

    for (let i = 0; i < maxLives; i++) {
      const segmentX = barX + i * (segmentWidth + gap);

      stroke(101, 134, 145);
      strokeWeight(1);

      if (i < currentLives) {
        if (currentLives === 1) {
          fill(241, 78, 78);
        } else if (currentLives === 2) {
          fill(244, 180, 68);
        } else {
          fill(42, 204, 154);
        }
      } else {
        fill(28, 48, 56);
      }

      rect(segmentX, barY, segmentWidth, segmentHeight, 3);

      if (i < currentLives) {
        noStroke();
        fill(255, 255, 255, 55);
        rect(segmentX + 3, barY + 3, segmentWidth - 6, 4, 2);
      }
    }
  }

  drawScoreSection(player) {
    const centreX = this.widthDim / 2;

    noStroke();
    fill(78, 224, 220);
    textFont(wordFont, 10);
    textAlign(CENTER, CENTER);
    text("SCORE", centreX, 24);

    drawingContext.shadowBlur = 12;
    drawingContext.shadowColor = "rgba(255, 190, 60, 0.65)";

    fill(255, 191, 61);
    textFont(wordFont, 18);
    text(String(player.getCurrentScore()).padStart(6, "0"), centreX, 45);

    drawingContext.shadowBlur = 0;

    fill(128, 164, 174);
    textFont(wordFont, 10);

    text(player.getPlayerName(), centreX, 65);
  }

  drawEquipmentSection(submarine) {
    const startX = this.widthDim - 326;

    noStroke();
    fill(106, 195, 205);
    textFont(wordFont, 10);
    textAlign(LEFT, CENTER);
    text("EQUIPMENT", startX, 25);

    this.drawEquipmentButton(
      startX,
      39,
      "\uf712",
      "SHIELD",
      "[S]",
      submarine.getHasShield(),
      color(55, 224, 166),
    );

    this.drawEquipmentButton(
      startX + 104,
      39,
      "\uf1e2",
      "BOMB",
      "[B]",
      submarine.getHasBomb(),
      color(241, 92, 92),
    );
  }

  drawControlsSection() {
    const startX = this.widthDim - 98;

    noStroke();
    fill(106, 195, 205);
    textFont(wordFont, 10);
    textAlign(LEFT, CENTER);
    text("CONTROLS", startX, 25);

    fill(15, 37, 48);
    stroke(80, 115, 126);
    strokeWeight(1);
    rect(startX, 39, 70, 27, 4);

    noStroke();
    fill(119, 150, 160);
    textFont(wordFont, 7);
    textAlign(CENTER, CENTER);
    text("[I] HELP", startX + 35, 53);
  }

  drawEquipmentButton(x, y, icon, label, shortcut, active, activeColour) {
    strokeWeight(1);

    if (active) {
      drawingContext.shadowBlur = 11;
      drawingContext.shadowColor =
        "rgba(" +
        red(activeColour) +
        "," +
        green(activeColour) +
        "," +
        blue(activeColour) +
        ",0.6)";

      fill(11, 48, 52);
      stroke(activeColour);
    } else {
      drawingContext.shadowBlur = 0;
      fill(21, 37, 45);
      stroke(70, 91, 99);
    }

    rect(x, y - 3, 96, 33, 4);

    noStroke();

    if (active) {
      fill(activeColour);
    } else {
      fill(145, 171, 177);
    }

    textFont(iconFont, 18);
    textAlign(CENTER, CENTER);
    text(icon, x + 16, y + 13);

    // Give the equipment name and shortcut their own rows so both remain
    // readable within the compact header panel.
    textFont(wordFont, 8);
    textAlign(LEFT, CENTER);
    text(label, x + 31, y + 8);

    if (!active) {
      fill(105, 139, 148);
    }
    textFont(wordFont, 8);
    text(shortcut, x + 31, y + 20);

    drawingContext.shadowBlur = 0;
  }

  drawBottomTrim() {
    noStroke();

    fill(8, 10, 13);
    rect(0, this.heightDim - 7, this.widthDim, 7);

    // Yellow/black hazard stripe
    const stripeWidth = 24;

    for (let x = 0; x < this.widthDim; x += stripeWidth) {
      if ((x / stripeWidth) % 2 === 0) {
        fill(213, 154, 44);
      } else {
        fill(30, 34, 37);
      }

      quad(
        x,
        this.heightDim - 7,
        x + stripeWidth - 7,
        this.heightDim - 7,
        x + stripeWidth,
        this.heightDim,
        x + 7,
        this.heightDim,
      );
    }
  }
}

// Player
class Player {
  constructor(playerName) {
    this.currentScore = 0;
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
  getCurrentScore() {
    return this.currentScore;
  }

  getPlayerName() {
    return this.name;
  }

  increaseCurrentScore(score) {
    this.currentScore += score;
  }
}
