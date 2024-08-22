class Projectile {
  constructor(){
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

  // initial projectile
  Projectile() {
    alive = true;
    isEnemy = false;
  }

  // submarine bullet
  Projectile(x, y, dir) {
    xCord = x;
    yCord = y;
    direction = dir;
    alive = true;
    fired = false;
    weaponType = "";
    travelSpeed = 3;
    setIsEnemy(false);
    setProjectileSize();
  }

  // enemy and bomb projectile
  Projectile(x, y, dir, weapon) {
    xCord = x;
    yCord = y;
    direction = dir;
    travelSpeed = 3;
    fired = false;
    alive = true;
    weaponType = weapon;
    setIsEnemy(weapon);
    setProjectileSize(weapon);
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
    this.alive = !alive;
  }

toggleIsFired() {
    this.fired = !fired;
  }

   setProjectileSize(weapon) {
    /* Sets size based on weapon type pased
     params: weapon (String): type of weapon
     */
    if (weapon.equals("FIRE")) {
      this.size = 20;
    } else if (weapon.equals("BOLT") || weapon.equals("BOMB")) {
      this.size = 15;
    } else {
        this.size = 7;
    }
  }

   setIsEnemy(weapon) {
    this.isEnemy = weapon.equals("FIRE") || weapon.equals("BOLT");
  }

  //methods
    impactMade(xPos, yPos, s) {
    /* checks if projectile is colliding with something
     params:
     xPos (float): x co-ordinate of item to check against
     yPos (float): y co-ordinate of item to check against
     s (int): the size of the item to check against
     */
    this.distance = dist(this.xCord + size/2, this.yCord + size/2, xPos, yPos);
    if (this.distance < s/2 + size) {
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
    if (this.xCord < 0 || this.xCord > width ||this.yCord < 0 || this.yCord > height) {
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
      textFont(iconFont, size);
      if (this.weaponType.equals("BOLT")) {
        fill(214, 162, 232);
        text("\uf0e7", this.xCord, this.yCord);
      } else if (this.weaponType.equals("FIRE")) {
        fill(255, 63, 52);
        text("\uf06d", this.xCord, this.yCord);
      } else if (this.weaponType.equals("BOMB")) {
        fill(253, 114, 114);
        text("\uf1e2", this,xCord, this,yCord);
      } else {
        // render submarine projectile
        fill(255);
        ellipse(this,xCord, this.yCord, this.size, this.size);
      }
    }
  }
}
