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
      let isEnemy = true;

      for (let i = 0; i < indexes.length; i++) {
        if (this.weaponType === "BOLT") {
          a = 15 * i;
        } else if (this.weaponType === "FIRE") {
          xCord = 200;
          yCord = 270 + 30 * (i + 1);
        } else if (this.weaponType == "BOMB") {
          a = 15 * (i + 1);
          isEnemy = false;
        }
        // shoot missiles in direction chosen
        projectiles[indexes[i]] = new Projectile();
        projectiles[indexes[i]].asEnemyAndBombProjectile(
          xCord,
          yCord,
          a,
          this.weaponType
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
  }

  // submarine bullet
  asSubmarineBullet(x, y, dir) {
    this.xCord = x;
    this.yCord = y;
    this.direction = dir;
    this.alive = true;
    this.fired = false;
    this.weaponType = "";
    this.travelSpeed = 3;
    this.setIsEnemy("BULLET");
    this.setProjectileSize();
  }

  // enemy and bomb projectile
  asEnemyAndBombProjectile(x, y, dir, weapon) {
    this.xCord = x;
    this.yCord = y;
    this.direction = dir;
    this.travelSpeed = 3;
    this.fired = false;
    this.alive = true;
    this.weaponType = weapon;
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

  isEnemy() {
    return this.isEnemy;
  }

  fired() {
    return this.fired;
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
    } else if (weapon === "BOLT" || weapon === "BOMB") {
      this.size = 15;
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
      yPos
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
    return this.false;
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
      this.xCord += cos(this.direction) * this.travelSpeed;
      this.yCord += sin(this.direction) * this.travelSpeed;
    }
  }

  render() {
    // displays the projectile
    if (this.alive && this.fired) {
      // render enemy projectiles
      textFont(iconFont, this.size);
      if (this.weaponType === "BOLT") {
        fill(214, 162, 232);
        text("\uf0e7", this.xCord, this.yCord);
      } else if (this.weaponType === "FIRE") {
        fill(255, 63, 52);
        text("\uf06d", this.xCord, this.yCord);
      } else if (this.weaponType === "BOMB") {
        fill(253, 114, 114);
        text("\uf1e2", this.xCord, this.yCord);
      } else {
        // render submarine projectile
        fill(255);

        ellipse(this.xCord, this.yCord, this.size, this.size);
      }
    }
  }
}

