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
    ((this.hasShield = false),
      (this.shieldActive = false),
      (this.isBoosting = false),
      (this.hasBomb = false),
      (this.missileShooter = new Shooter(this.travelSpeed == 0)));
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
    push();

    translate(this.getXCord(), this.getYCord());
    rotate(this.getRotation());

    // Damage invincibility flickers; an active shield stays fully visible.
    const damaged =
      this.invincible && !this.shieldActive && frameCount % 8 < 4;

    // Flicker while temporarily invincible after being hit
    if (damaged) {
      drawingContext.globalAlpha = 0.45;
    }

    if (this.isBoosting || this.travelSpeed !== 0) {
      drawingContext.shadowBlur = 18;
      drawingContext.shadowColor = "rgba(65, 220, 255, 0.9)";

      noStroke();
      const engineFlicker = sin(frameCount * 0.55) * 3;

      fill(51, 205, 255, 80);
      ellipse(-34, 0, 33 + engineFlicker, 15);


      fill(102, 240, 255, 150);
      ellipse(-31, 0, 21 + engineFlicker * 0.6, 9);

      fill(240, 255, 255, 220);
      ellipse(-28, 0, 10 + engineFlicker * 0.3, 4);

      drawingContext.shadowBlur = 0;
    }

    stroke(26, 49, 61);
    strokeWeight(4);
    line(-27, 0, -37, 0);

    push();

    translate(-39, 0);
    rotate(frameCount * 0.3);

    stroke(82, 133, 148);
    strokeWeight(3);

    line(-7, 0, 7, 0);
    line(0, -7, 0, 7);

    pop();

    stroke(21, 46, 59);
    strokeWeight(2);
    fill(31, 111, 135);

    beginShape();
    vertex(-14, -11);
    vertex(-26, -25);
    vertex(-4, -13);
    endShape(CLOSE);

    beginShape();
    vertex(-14, 11);
    vertex(-26, 25);
    vertex(-4, 13);
    endShape(CLOSE);


    fill(24, 83, 105);

    beginShape();
    vertex(-25, -7);
    vertex(-36, -17);
    vertex(-31, -3);
    endShape(CLOSE);

    const bodyGradient = drawingContext.createLinearGradient(0, -18, 0, 18);

    if (this.shieldActive) {
      bodyGradient.addColorStop(0, "#baffdf");
      bodyGradient.addColorStop(0.45, "#2ecc71");
      bodyGradient.addColorStop(1, "#087d46");
    } else if (this.invincible) {
      bodyGradient.addColorStop(0, "#ffd2c9");
      bodyGradient.addColorStop(0.45, "#e74c3c");
      bodyGradient.addColorStop(1, "#74281f");
    } else {
      bodyGradient.addColorStop(0, "#d4fbff");
      bodyGradient.addColorStop(0.35, "#46dce8");
      bodyGradient.addColorStop(0.7, "#1383a1");
      bodyGradient.addColorStop(1, "#0a405d");
    }

    drawingContext.shadowBlur = 14;
    drawingContext.shadowColor = "rgba(34, 210, 235, 0.35)";

    drawingContext.fillStyle = bodyGradient;

    stroke(5, 35, 51);
    strokeWeight(3);

    beginShape();

    vertex(-29, -13);
    bezierVertex(-10, -20, 18, -18, 34, -5);
    bezierVertex(40, 0, 34, 7, 24, 12);
    bezierVertex(4, 19, -16, 18, -29, 12);

    endShape(CLOSE);

    drawingContext.shadowBlur = 0;

    noStroke();
    fill(0, 20, 33, 65);

    beginShape();

    vertex(-25, 6);
    bezierVertex(-5, 15, 18, 13, 31, 5);
    bezierVertex(25, 16, -5, 21, -25, 11);

    endShape(CLOSE);

    stroke(7, 42, 55);
    strokeWeight(2);
    fill(33, 126, 147);

    rect(-8, -22, 21, 11, 5, 5, 0, 0);


    stroke(91, 188, 199);
    strokeWeight(3);

    line(2, -22, 2, -31);
    line(2, -31, 10, -31);

    const windows = [-11, 5, 20];

    for (const windowX of windows) {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = "rgba(255, 217, 90, 0.8)";

      stroke(23, 50, 60);
      strokeWeight(3);
      fill(255, 205, 74);

      circle(windowX, -2, 9);

      noStroke();
      fill(255, 255, 220, 150);
      circle(windowX - 1.5, -3.5, 2.5);

      drawingContext.shadowBlur = 0;
    }

    stroke(14, 75, 91, 130);
    strokeWeight(1);

    line(-18, -12, -18, 12);
    line(13, -14, 13, 13);

    noStroke();
    fill(204, 245, 245, 130);

    circle(-22, -7, 3);
    circle(-22, 7, 3);
    circle(27, -5, 3);
    circle(27, 5, 3);

    stroke(8, 34, 47);
    strokeWeight(5);
    line(30, 0, 43, 0);

    stroke(88, 224, 239);
    strokeWeight(2);
    line(32, 0, 44, 0);

    noStroke();
    fill(179, 250, 255);
    circle(44, 0, 5);

    if (this.shieldActive) {
      drawingContext.shadowBlur = 22;
      drawingContext.shadowColor = "rgba(65, 255, 176, 0.85)";

      noFill();
      stroke(75, 255, 177, 180);
      strokeWeight(3);
      ellipse(0, 0, 92, 64);

      stroke(176, 255, 221, 70);
      strokeWeight(1);
      ellipse(0, 0, 101, 71);

      drawingContext.shadowBlur = 0;
    }

    drawingContext.globalAlpha = 1;

    pop();
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
