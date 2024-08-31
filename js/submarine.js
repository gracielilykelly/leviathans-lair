class Submarine {
  constructor() {
    this.xCord = width / 2;
    this.yCord = height / 2;
    this.rotation = -HALF_PI;
    // allows the ship to rotate a quarter circle at a time
    this.rotationSpeed = QUARTER_PI;
    this.travelSpeed = 0; // TODO: set travel speed
    this.lives = 3;
    this.maxLives = 3;
    this.size = 30;
    this.invincibilityTimer = 0;
    this.subColor = (64, 224, 208);
    this.invincible = false;
    (this.hasShield = false),
      (this.shieldActive = false),
      (this.isBoosting = false),
      (this.hasBomb = false),
      (this.missileShooter = new Shooter(this.travelSpeed == 0));
    this.bombShooter = new Shooter(this.travelSpeed == 0, "BOMB");

    this.setColor(this.subColor);
  }

  // getters
  getXCord() {
    return this.xCord;
  }

  getYCord() {
    return this.yCord;
  }

  getRotation() {
    return this.rotation;
  }

  getRotationSpeed() {
    return this.rotationSpeed;
  }

  getLives() {
    return this.lives;
  }

  getMaxLives() {
    return this.maxLives;
  }

  getMissileShooter() {
    return this.missileShooter;
  }

  getBombShooter() {
    return this.bombShooter;
  }

  getInvincibilityTimer() {
    return this.invincibilityTimer;
  }

  isInvincible() {
    return this.invincible;
  }

  getSize() {
    return this.size;
  }

  getHasShield() {
    return this.hasShield;
  }

  getShieldActive() {
    return this.shieldActive;
  }

  getHasBomb() {
    return this.hasBomb;
  }

  // setters
  setXCord(x) {
    this.xCord = x;
  }

  setYCord(y) {
    this.yCord = y;
  }

  setLives(l) {
    this.lives = l;
  }

  setSize(s) {
    this.size = s;
  }

  setShieldActive(isActive) {
    this.shieldActive = isActive;
  }

  setRotationSpeed(speed) {
    this.rotationSpeed = speed;
  }

  setMaxLives(l) {
    this.maxLives = l;
  }

  setTravelSpeed(speed) {
    this.travelSpeed = speed;
  }

  setTravelSpeedToZero() {
    this.travelSpeed = 0;
  }

  setRotation(keyCodePressed) {
    /* Sets the roation of the submarine
     params:
     keyCodePressed (int) - the key pressed by user
     */
    if (keyCodePressed == LEFT_ARROW) {
      // rotate left
      this.rotation -= this.rotationSpeed;
    } else if (keyCodePressed == RIGHT_ARROW) {
      // rotate right
      this.rotation += this.rotationSpeed;
    }
  }

  setHasBomb(doesHave) {
    this.hasBomb = doesHave;
  }

  setHasShield(doesHave) {
    this.hasShield = doesHave;
  }

  activateShield() {
    if (this.hasShield) {
      this.shieldActive = true;
    }
  }

  setIsAllowedFireMissile() {
    // allow to shoot missile when not moving
    this.missileShooter.setAllowFire(this.travelSpeed == 0);
  }

  deactivateShield() {
    this.shieldActive = false;
    this.hasShield = false;
  }

  reduceLives() {
    this.lives -= 1;
  }

  addLives(addAmount) {
    // only allow lives up to maximum
    if (this.lives < this.maxLives) {
      console.log("ADDING LIVES")
      this.lives += addAmount;
    }
  }

  setColor(chosenColor) {
    this.subColor = chosenColor;
  }

  setInvincibility(isInvincible) {
    this.invincible = isInvincible;
  }

  setInvincibilityTimer() {
    // set a timer of 500
    this.invincibilityTimer = 500;
  }

  reduceInvincibilityTimer(howMuch) {
    // reduces the timer by passed in amount
    this.invincibilityTimer -= howMuch;
  }

  setIsBoosting(boosting) {
    this.isBoosting = boosting;
  }

  // methods
  update(scoreboardHeight) {
    //updates the submarine
    if (this.shieldActive) {
      // set shield active attributes
      this.setColor((255, 0, 255));
      this.setInvincibility(true);
    }

    // keep ship within boundaries of game
    if (this.xCord <= this.size) {
      this.setXCord(this.size + 5);
    } else if (this.xCord >= width - this.size) {
      this.setXCord(width - (this.size + 5));
    } else if (this.yCord <= scoreboardHeight + this.size) {
      this.setYCord(scoreboardHeight + (this.size + 5));
    } else if (this.yCord >= height - this.size) {
      this.setYCord(height - (this.size + 5));
    }
    // update the co-ordinates using the angle of the ship
    else {
      this.setXCord(this.xCord + cos(this.rotation) * this.travelSpeed);
      this.setYCord(this.yCord + sin(this.rotation) * this.travelSpeed);
    }
  }

  render() {
    // display the submarine
    translate(this.getXCord(), this.getYCord());
    rotate(this.getRotation());
    noStroke();
    noFill();

    if (this.shieldActive) {
      this.setColor((46, 204, 113));
    } else if (this.invincible) {
      this.setColor((231, 76, 60));
    } else {
      this.setColor((64, 224, 208));
    }

    // rotate the rocket icon
    rotate(radians(45.0));

    // draw rocket icon
    fill(this.subColor);
    textFont(iconFont, 35);
    textAlign(CENTER, CENTER);
    text("\uf135", -20, 0, 35);

    if (this.isBoosting) {
      // draw boost flame
      textSize(20);
      fill(249, 127, 81);
      rotate(radians(225.0));
      text("\uf7e4", -5, -32, 10);
    }
  }

  handleHit() {
    // handles when the submarine has been hit

    // check if invincibility has cooled down
    if (this.invincibilityTimer == 0) {
      this.setInvincibility(false);

      // set a new timer of invincibility
      this.setInvincibilityTimer();

      // do not allow hit if shield active
      if (this.shieldActive) {
        this.deactivateShield();
      } else {
        // lose a life
        this.reduceLives();
        this.setInvincibility(true);
      }
    }
  }
}
