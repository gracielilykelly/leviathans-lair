class Shooter {
  constructor(allowFire, weaponType) {
    this.allowFire = allowFire;
    this.weaponType = weaponType;
  }

  // getters
  getWeaponType() {
    return this.weaponType;
  }

  getAllowFire() {
    return this.allowFire;
  }

  // setters
  setWeaponType(weapon) {
    this.weaponType = weapon;
  }

  setAllowFire(allowed) {
    this.allowFire = allowed;
  }

  // methods
  shootSingle(projectiles, index, xCord, yCord, angle) {
    // load and shoot single projectile
    if (this.allowFire) {
      projectiles[index] = new Projectile();
      projectiles[index].asSubmarineBullet(xCord, yCord, angle);
      projectiles[index].toggleIsFired();
    }
  }

  shootMultiple(projectiles, indexes, xCord, yCord) {
    // load and shoot multiple projectiles
    if (this.allowFire) {
      let a = 0;
      const volleyPhase = frameCount * 0.045;

      for (let i = 0; i < indexes.length; i++) {
        if (this.weaponType === "BOLT") {
          a = 15 * i;
        } else if (this.weaponType === "FIRE") {
          const spreadPosition =
            indexes.length > 1 ? i / (indexes.length - 1) - 0.5 : 0;
          a = spreadPosition * 1.35 + sin(volleyPhase + i * 0.7) * 0.1;
        } else if (this.weaponType == "BOMB") {
          a = 15 * (i + 1);
        }
        // shoot missiles in direction chosen
        projectiles[indexes[i]] = new Projectile();
        projectiles[indexes[i]].asEnemyAndBombProjectile(
          this.weaponType === "FIRE" ? xCord + 138 : xCord,
          this.weaponType === "FIRE"
            ? yCord + sin(volleyPhase + i * 1.4) * 9
            : yCord,
          a,
          this.weaponType,
          i,
          indexes.length,
        );
        projectiles[indexes[i]].toggleIsFired();
      }
    }
  }
}

// Projectile
class Projectile {
  constructor() {
    this.xCord = 0;
    this.yCord = 0;
    this.direction = 0;
    this.size = 0;
    this.travelSpeed = 0;
    this.fired = false;
    this.alive = true;
    this.isEnemy = false;
    this.weaponType = "";
    this.age = 0;
    this.waveAmplitude = 0;
    this.waveFrequency = 0;
    this.wavePhase = 0;
  }

  asSubmarineBullet(x, y, dir) {
    // Start at the submarine's front cannon
    this.xCord = x + cos(dir) * 43;
    this.yCord = y + sin(dir) * 43;

    this.direction = dir;
    this.alive = true;
    this.fired = false;
    this.weaponType = "LASER";

    // Faster than the old circular projectile
    this.travelSpeed = 9;
    this.size = 9;
  }

  // enemy and bomb projectile
  asEnemyAndBombProjectile(x, y, dir, weapon, patternIndex = 0, total = 1) {
    this.xCord = x;
    this.yCord = y;
    this.direction = dir;
    this.travelSpeed = 3;
    this.fired = false;
    this.alive = true;
    this.weaponType = weapon;
    if (weapon === "FIRE") {
      this.travelSpeed = random(2.4, 3.6);
      this.waveAmplitude = random(0.6, 1.5);
      this.waveFrequency = random(0.09, 0.16);
      this.wavePhase = (patternIndex / Math.max(1, total)) * TWO_PI;
    }
    this.setIsEnemy(weapon);
    this.setProjectileSize(weapon);
  }

  // getters
  getXCord() {
    return this.xCord;
  }

  getYCord() {
    return this.yCord;
  }

  getWeaponType() {
    return this.weaponType;
  }

  getFired() {
    return this.fired;
  }

  isInBounds() {
    return this.alive;
  }

  // setters
  toggleAlive() {
    this.alive = !this.alive;
  }

  toggleIsFired() {
    this.fired = !this.fired;
  }

  setProjectileSize(weapon) {
    /* Sets size based on weapon type pased
     params: weapon (String): type of weapon
     */
    if (weapon === "FIRE") {
      this.size = 20;
    } else if (weapon === "BOLT") {
      this.size = 15;
    } else if (weapon === "BOMB") {
      this.size = 20;
    } else {
      this.size = 7;
    }
  }

  setIsEnemy(weapon) {
    this.isEnemy = weapon === "FIRE" || weapon === "BOLT";
  }

  //methods
  impactMade(xPos, yPos, s) {
    /* checks if projectile is colliding with something
     params:
     xPos (float): x co-ordinate of item to check against
     yPos (float): y co-ordinate of item to check against
     s (int): the size of the item to check against
     */
    this.distance = dist(
      this.xCord + this.size / 2,
      this.yCord + this.size / 2,
      xPos,
      yPos,
    );
    if (this.distance < s / 2 + this.size) {
      return true;
    }
    return false;
  }

  isHitting(xPos, yPos, s) {
    // checks if projectile is hitting an asset (from submarine)
    if (!this.isEnemy && this.fired && this.alive) {
      return this.impactMade(xPos, yPos, s);
    }
    return false;
  }

  isHittingPlayer(xPos, yPos, s) {
    // checks if projectile is hitting the player (from enemy)
    if (this.isEnemy && this.fired && this.alive) {
      return this.impactMade(xPos, yPos, s);
    }
    return false;
  }

  update() {
    // updates the projectile
    if (
      this.xCord < 0 ||
      this.xCord > width ||
      this.yCord < 0 ||
      this.yCord > height
    ) {
      // kill projectile if off screen
      this.toggleAlive();
    } else {
      // update cordinates based on direction
      this.age += 1;
      const wave =
        this.weaponType === "FIRE"
          ? sin(this.age * this.waveFrequency + this.wavePhase) *
            this.waveAmplitude
          : 0;
      this.xCord +=
        cos(this.direction) * this.travelSpeed +
        cos(this.direction + HALF_PI) * wave;
      this.yCord +=
        sin(this.direction) * this.travelSpeed +
        sin(this.direction + HALF_PI) * wave;
    }
  }

  drawLaserDot() {
    noStroke();

    fill(0, 220, 255, 70);
    circle(this.xCord, this.yCord, this.size + 8);

    fill(0, 235, 255);
    circle(this.xCord, this.yCord, this.size);

    fill(255);
    circle(this.xCord, this.yCord, Math.max(2, this.size * 0.4));
  }

  render() {
    push();

    if (this.weaponType === "SUBMARINE") {
      this.drawLaserDot();
    } else if (this.weaponType === "FIRE") {
      this.drawFireball();
    } else if (this.weaponType === "BOMB") {
      this.drawBomb();
    } else if (this.weaponType === "BOLT") {
      noStroke();

      fill(160, 80, 255, 60);
      circle(this.xCord, this.yCord, this.size + 7);

      fill(175, 95, 255);
      circle(this.xCord, this.yCord, this.size);

      fill(255);
      circle(this.xCord, this.yCord, Math.max(2, this.size * 0.35));
    } else {
      noStroke();
      fill(255);
      circle(this.xCord, this.yCord, this.size);
    }

    pop();
  }

  drawBomb() {
    const pulse = 1 + sin(frameCount * 0.25) * 0.12;

    push();
    translate(this.xCord, this.yCord);

    noStroke();

    fill(255, 90, 35, 55);
    circle(0, 0, 17 * pulse);

    // Main projectile
    fill(255, 105, 40);
    circle(0, 0, 10);

    fill(255, 225, 145);
    circle(-1, -1, 4);

    pop();
  }

  drawFireball() {
    const flicker = sin(this.age * 0.7 + this.wavePhase) * 2;

    push();
    translate(this.xCord, this.yCord);

    noStroke();

    fill(255, 55, 10, 55);
    circle(0, 0, this.size + 12 + flicker);

    fill(255, 75, 10);
    circle(0, 0, this.size);

    fill(255, 180, 30);
    circle(2, 0, this.size * 0.62);

    fill(255, 245, 170);
    circle(4, 0, this.size * 0.25);

    pop();
  }
}
