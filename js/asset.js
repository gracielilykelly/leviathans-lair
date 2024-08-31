class Asset {
  constructor() {
    this.xCord = 0;
    this.yCord = 0;
    this.travelSpeed = 0;
    this.angle = 0;
    this.size = 0;
  }

  // create enemy/boulder asset
  configureEnemyBoulderAsset(s, a, speed) {
    this.size = s;
    this.angle = a;
    this.travelSpeed = speed;
  }

  // create pickup asset
  configurePickupAsset(x, y, s, speed) {
    this.xCord = x;
    this.yCord = y;
    this.travelSpeed = speed;
    this.size = s;
  }

  // getters
  getXCord() {
    return this.xCord;
  }

  getYCord() {
    return this.yCord;
  }

  getSize() {
    return this.size;
  }

  getAngle() {
    return this.angle;
  }

  // setters
  setXCord(x) {
    this.xCord = x;
  }

  setYCord(y) {
    this.yCord = y;
  }

  setHorizontalDirection(travelLeft) {
    /* Sets direction asset should travel in (left/right)
     params: travelLeft (Boolean): set to true if asset 
     should travel left or false if it should travel right
     */
    if (travelLeft) {
      this.xCord -= this.travelSpeed;
    } else {
      this.xCord += this.travelSpeed;
    }
  }

  setVerticalDirection(travelUp) {
    /* Sets direction asset should travel in (up/down)
     params: travelUp (Boolean): set to true if asset 
     should travel up or false if it should travel down
     */
    if (travelUp) {
      this.yCord -= this.travelSpeed;
    } else {
      this.yCord += this.travelSpeed;
    }
  }

  setSpawnLocation() {
    /* Sets the cordinates of the asset off 
     screen at random.
     */

    // randomly choose a spawn location
    const spawnTop = floor(random(0, 2)) > 0;
    const spawnLeft = floor(random(0, 2)) > 0;

    //spawn the asset top/bottom offscreen
    if (spawnTop) {
      this.setYCord(-this.size);
    } else {
      this.setYCord(height + this.size);
    }

    // spawn the asset left/right offscreen
    if (spawnLeft) {
      this.setXCord(-this.size);
    } else {
      this.setXCord(width + this.size);
    }
  }

  setSpawnLocationForSubmarine(submarine) {
    /*Sets the cordinates of the asset in relation to
     the submarine's location
     params: submarine (Submarine) - the submarine of which
     to get the co-ordinates of.
     */

    // get the areas where asset can be spawned
    const topMin = height / 15 + this.size;
    const leftMin = this.size;
    const bottomMin = height - this.size;
    const rightMin = width - this.size;
    const topMax = submarine.getYCord() - this.size;
    const leftMax = submarine.getXCord() - this.size;
    const bottomMax = submarine.getYCord() + this.size;
    const rightMax = submarine.getXCord() + this.size;

    // randomly choose a spawn location
    const spawnTop = floor(random(0, 2)) > 0;
    const spawnLeft = floor(random(0, 2)) > 0;

    // set the co-ordinates
    if (spawnTop && spawnLeft) {
      // spawn top left
      this.setXCord(random(leftMin, leftMax));
      this.setYCord(random(topMin, topMax));
    } else if (spawnTop && !spawnLeft) {
      // spawn top right
      this.setXCord(random(rightMax, rightMin));
      this.setYCord(random(topMin, topMax));
    } else if (!spawnTop && spawnLeft) {
      // spawn bottom left
      this.setXCord(random(this.size, leftMax));
      this.setYCord(random(bottomMax, bottomMin));
    } else {
      // spawn bottom right
      this.setXCord(random(rightMax, rightMin));
      this.setYCord(random(bottomMax, bottomMin));
    }
  }

  // methods
  isBeyondAnyBoundary() {
    // Checks if asset is beyond any of the boundaries
    return (
      this.isBeyondBoundary("TOP") ||
      this.isBeyondBoundary("LEFT") ||
      this.isBeyondBoundary("BOTTOM") ||
      this.isBeyondBoundary("RIGHT")
    );
  }

  isBeyondBoundary(location) {
    /* Checks if asset is beyond specific boundary
     params: location (String) - the boundary of which to
     check (choices are TOP, LEFT, BOTTOM and RIGHT)
     */
    if (location === "TOP") {
      return this.yCord < height / 15 + this.size / 2;
    } else if (location === "LEFT") {
      return this.xCord < this.size / 2;
    } else if (location === "BOTTOM") {
      return this.yCord > height - this.size / 2;
    } else if (location === "RIGHT") {
      return this.xCord > width - this.size / 2;
    }
    return false;
  }

  isColliding(submarine) {
    /* Checks if asset is colliding with submarine
     params: submarine (Submarine) - the submarine of which
     to get the co-ordinates of.
     */
    const distance = dist(
      this.xCord,
      this.yCord,
      submarine.getXCord(),
      submarine.getYCord()
    );
    return distance < this.size / 2 + 10;
  }

  move(keepWithinBoundary) {
    /* Moves the asset around the area
     params: keepWithinBoundary (boolean) - whether or 
     not the asset should bounce back or move to opposite side
     (e.g beyond top appears at bottom)
     */

    if (keepWithinBoundary) {
      // keep the asset within the box
      if (this.isBeyondAnyBoundary()) {
        // go in other direction
        this.travelSpeed = -this.travelSpeed;
        if (this.isBeyondBoundary("LEFT")) {
          this.setXCord(this.size / 2 + 5);
        } else if (this.isBeyondBoundary("RIGHT")) {
          this.setXCord(width - this.size / 2 - 5);
        } else if (this.isBeyondBoundary("TOP")) {
          this.setYCord(height / 15 + this.size / 2 + 5);
        } else if (this.isBeyondBoundary("BOTTOM")) {
          this.setYCord(height - this.size / 2 - 5);
        }
      }
    } else if (!keepWithinBoundary) {
      // let it back to game boundary on opposite side
      if (this.xCord < -this.size / 2) {
        this.setXCord(width + this.size / 2);
      } else if (this.xCord > width + this.size / 2) {
        this.setXCord(-this.size / 2);
      } else if (this.yCord < -this.size / 2) {
        this.setYCord(height + this.size / 2);
      } else if (this.yCord > height + this.size / 2) {
        this.setYCord(0);
      }
    }

    // update cordinates
    this.setXCord((this.xCord += cos(this.angle) * this.travelSpeed));
    this.setYCord((this.yCord += sin(this.angle) * this.travelSpeed));
  }

  moveTowardsSubmarine(submarine, speedIncrease) {
    /* Moves asset towards the submarine by a certain speed
     params:
     submarine (Submarine) - Submarine to move towards
     speedIncrease () - how much faster should asset move
     */

    // move the asset if it is not touching the submarine
    if (
      dist(
        this.xCord + this.size / 2,
        this.yCord + this.size / 2,
        submarine.getXCord(),
        submarine.getYCord()
      ) > this.travelSpeed
    ) {
      // set the course that is should move
      const rotateDeg = atan2(
        submarine.getYCord() - this.yCord,
        submarine.getXCord() - this.xCord
      );
      this.setXCord(
        cos(rotateDeg) * (this.travelSpeed * speedIncrease) + this.xCord
      );
      this.setYCord(
        sin(rotateDeg) * (this.travelSpeed * speedIncrease) + this.yCord
      );
    }
  }
}


// Boulder
class Boulder {
  constructor() {
    this.size = Math.floor(Math.random() * 100);
    this.angle = Math.floor(Math.random() * TWO_PI);
    this.travelSpeed = Math.random() * 0.7 + 0.1;
    this.asset = new Asset();
    this.asset.configureEnemyBoulderAsset(
      this.size,
      this.angle,
      this.travelSpeed
    );
  }

  // getters
  getSize() {
    return this.size;
  }

  getTravelSpeed() {
    return this.travelSpeed;
  }

  getAngle() {
    return this.angle;
  }

  getAsset() {
    return this.asset;
  }

  // setters
  setSize(s) {
    this.size = s;
  }

  setTravelSpeed(speed) {
    this.travelSpeed = speed;
  }

  setAngle(a) {
    this.angle = a;
  }

  // methods
  render() {
    // displays the boulder
    stroke(87, 96, 111);
    strokeWeight(4);
    fill(206, 214, 224);
    ellipse(this.asset.getXCord(), this.asset.getYCord(), this.size, this.size);
  }
}



// Enemy
class Enemy {
  constructor(enemyType) {
    this.travelSpeed = 0;
    this.angle = 0;
    this.size = 0;
    this.type = enemyType;
    this.weaponType;
    this.scoreAmount;
    this.icon;
    this.projectileCount;
    this.travellingUp;
    this.travellingLeft;
    this.allowedAction;
    this.canHaveWeapons;
    this.actionTimer = Math.floor(Math.random() * 3500 + 250);
    this.fillColor;
    this.configureEnemy(enemyType);
  }

  configureEnemy(enemyType) {
    // configure props based on type of enemy
    if (enemyType === "JELLYFISH") {
      this.setTravelSpeed(0.3);
      this.setLives(2);
      this.setSize(30);
      this.setCanHaveWeapons(true);
      this.setFillColor(color(214, 162, 232));
      this.setIcon("\uf6e2");
      this.setWeaponType("BOLT");
      this.setScoreAmount(50);
      this.setAllowedAction(true);
      this.setProjectileCount(10);
    } else if (enemyType === "SHARK") {
      this.setTravelSpeed(0.3);
      this.setLives(3);
      this.setFillColor(color(241, 242, 246));
      this.setIcon("\uf72c");
      this.setSize(80);
      this.setScoreAmount(100);
    } else if (enemyType === "PUFFERFISH") {
      this.setLives(1);
      this.setActionTimer(Math.floor(Math.random() * 1500 + 200));
      this.setTravelSpeed(0.25);
      this.setAngle(random(0, TWO_PI));
      this.setFillColor(color(248, 239, 186));
      this.setIcon("\uf5a4");
      this.setScoreAmount(30);
      this.setSize(50);
    } else if (enemyType === "PIRANHA") {
      this.setLives(1);
      this.setSize(25);
      this.setTravelSpeed(0.5);
      this.setFillColor(color(154, 236, 219));
      this.setIcon("\uf578");
      this.setActionTimer(Math.floor(Math.random() * 200 + 50));
      this.setTravellingLeft(Math.floor(Math.random() * 2) > 0);
      this.setScoreAmount(25);
    } else if (enemyType === "LEVIATHAN") {
      this.setLives(10);
      this.setSize(200);
      this.setTravelSpeed(0.5);
      this.setFillColor(color(179, 55, 113));
      this.setIcon("\uf6d5");
      this.setActionTimer(100);
      this.setTravellingLeft(Math.floor(Math.random() * 2) > 0);
      this.setCanHaveWeapons(true);
      this.setWeaponType("FIRE");
      this.setScoreAmount(1000);
      this.setProjectileCount(10);
    }
    this.asset = new Asset(this.size, this.angle, this.travelSpeed);
    this.asset.configureEnemyBoulderAsset(
      this.size,
      this.angle,
      this.travelSpeed
    );
    this.shooter = new Shooter(this.allowedAction, this.weaponType);
  }

  // getters
  getType() {
    return this.type;
  }

  getLives() {
    return this.lives;
  }

  getTravelSpeed() {
    return this.travelSpeed;
  }

  getScoreAmount() {
    return this.scoreAmount;
  }

  getAllowedAction() {
    return this.allowedAction;
  }

  getAsset() {
    return this.asset;
  }

  getProjectileCount() {
    return this.projectileCount;
  }

  getActionCanBeTaken() {
    return frameCount % this.actionTimer == 0;
  }

  getActionTimer() {
    return this.actionTimer;
  }

  getCanHaveWeapons() {
    return this.canHaveWeapons;
  }

  getWeaponType() {
    return this.weaponType;
  }

  getShooter() {
    return this.shooter;
  }

  // setters
  loseLife() {
    this.lives--;
  }

  setLives(livesAmount) {
    this.lives = livesAmount;
  }

  setScoreAmount(amount) {
    this.scoreAmount = amount;
  }

  setAllowedAction(allowed) {
    this.allowedAction = allowed;
  }

  setTravelSpeed(speed) {
    this.travelSpeed = speed;
  }

  setActionTimer(timer) {
    this.actionTimer = timer;
  }

  setTravellingLeft(isLeft) {
    this.travellingLeft = isLeft;
  }

  setWeaponType(weapon) {
    this.weaponType = weapon;
  }

  setType(t) {
    this.type = t;
  }

  setAngle(a) {
    this.angle = a;
  }

  setIcon(i) {
    this.icon = i;
  }

  setSize(s) {
    this.size = s;
  }

  setProjectileCount(count) {
    this.projectileCount = count;
  }

  setFillColor(c) {
    this.fillColor = c;
  }

  setCanHaveWeapons(canHave) {
    this.canHaveWeapons = canHave;
  }

  setSpawnLocation() {
    // set spawn location for the leviathan
    this.asset.setXCord(-200);
    this.asset.setYCord(height / 2);
  }

  // methods
  updateLeviathan() {
    let x = this.asset.getXCord();
    if (x >= 100) {
      this.travellingLeft = true;
      this.shooter.setAllowFire(true);
    } else {
      // move until reaches certain xCord
      this.asset.setXCord((x += 1 * this.travelSpeed));
      // don't allow to shoot until certain xCord
      this.shooter.setAllowFire(false);
    }
  }

  updateJellyFish() {
    // update the direction the jellyfish is travelling
    if (this.getActionCanBeTaken()) {
      this.travellingUp = !this.travellingUp;
      this.travellingLeft = !this.travellingLeft;
    }

    //update the co-ordinates of the jellyfish
    this.asset.setVerticalDirection(this.travellingUp);
    this.asset.setHorizontalDirection(this.travellingUp);
    this.asset.move(true);
  }

  updateShark(submarine) {
    // only allowed to attack if not colliding with submarine
    if (this.asset.isColliding(submarine)) {
      this.allowedAction = false;
    }

    // allow shark to make attack
    if (this.getActionCanBeTaken()) {
      this.allowedAction = true;
    }

    // launch sneak attack
    if (this.allowedAction) {
      this.asset.moveTowardsSubmarine(submarine, 6.5);
    } else {
      this.asset.move(false);
    }
  }

  updatePufferFish() {
    let timer = this.actionTimer;

    // set to angry mode
    if (this.allowedAction) {
      this.size = 100;
      this.fillColor = color(253, 114, 114);
      this.icon = "\uf556";
      timer = this.actionTimer / 2;
    } else {
      // set to neutral mode
      this.size = 50;
      this.fillColor = color(248, 239, 186);
      this.icon = "\uf5a4";
    }

    // allow pufferfish to get bigger/smaller
    if (this.getActionCanBeTaken()) {
      this.allowedAction = !this.allowedAction;
    }

    this.asset.move(true);
  }

  updatePiranha() {
    // change direction of piranha
    if (this.getActionCanBeTaken()) {
      this.travellingUp = !this.travellingUp;
    }
    this.asset.setVerticalDirection(this.travellingUp);
    this.asset.move(false);
  }

  update(submarine) {
    if (this.type === "JELLYFISH") {
      this.updateJellyFish();
    } else if (this.type === "SHARK") {
      this.updateShark(submarine);
    } else if (this.type === "PUFFERFISH") {
      this.updatePufferFish();
    } else if (this.type === "PIRANHA") {
      this.updatePiranha();
    } else if (this.type === "LEVIATHAN") {
      this.updateLeviathan();
    }
  }

  drawHealthBar() {
    // draw a health bar
    stroke(46, 213, 115);
    strokeWeight(1);
    let i = 0;
    while (i < this.lives) {
      fill(46, 213, 115);
      rect(
        this.asset.getXCord() - 10 * i,
        this.asset.getYCord() - (this.size / 2 + 15),
        10,
        10
      );
      i++;
    }
    noStroke();
  }

  render() {
    // display the enemy
    this.drawHealthBar();
    textAlign(CENTER, CENTER);
    textFont(iconFont, this.size);
    fill(this.fillColor);
    text(this.icon, this.asset.getXCord(), this.asset.getYCord());
  }
}

// Pickup
class Pickup {
  constructor(xCord, yCord, pickupType) {
    this.type = pickupType;
    this.icon = "";
    this.size = 20;
    this.speed = 3;
    this.show = false;
    this.allow = false;
    this.fillColor = 0;
    this.asset = new Asset();
    this.asset.configurePickupAsset(xCord, yCord, this.size, this.speed);
    this.setPickupColorandIcon();
  }

  // getters
  getType() {
    return this.type;
  }

  getSize() {
    return this.ize;
  }

  getSpeed() {
    return this.speed;
  }

  getAllow() {
    return this.allow;
  }

  getShow() {
    return this.show;
  }

  getAsset() {
    return this.asset;
  }

  // setters
  setPickupColorandIcon() {
    if (this.type === "HEART") {
      this.fillColor = color(252, 66, 123);
      this.icon = "\uf004";
    } else if (this.type === "SHIELD") {
      this.fillColor = color(46, 204, 113);
      this.icon = "\uf712";
    } else if (this.type === "DIAMOND") {
      this.fillColor = color(255, 184, 28);
      this.icon = "\uf3a5";
    } else if (this.type === "BOMB") {
      this.fillColor = color(253, 114, 114);
      this.icon = "\uf1e2";
    }
  }

  setType(pickupType) {
    this.type = pickupType;
  }

  setSize(pickupSize) {
    this.size = pickupSize;
  }

  setSpeed(pickupSpeed) {
    this.speed = pickupSpeed;
  }

  displayPickup() {
    this.allow = true;
    this.show = true;
  }

  // methods
  move(submarine) {
    // move the pickup towards the submarine
    if (this.allow && this.show) {
      this.asset.moveTowardsSubmarine(submarine, 1.5);
    }
  }

  render() {
    // display the pickup
    if (this.allow && this.show) {
      textFont(iconFont, this.size);
      textAlign(CENTER, CENTER);
      noStroke();
      fill(this.fillColor);
      text(this.icon, this.asset.getXCord(), this.asset.getYCord());
    }
  }
}

