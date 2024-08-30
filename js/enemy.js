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
    this.actionTimer;
    this.fillColor;
    this.configureEnemy(enemyType);
  }

  // default enemy
  //   piranha() {
  //     setSize(20);
  //     setCanHaveWeapons(false);
  //     setType("PIRANHA");
  //     shooter = new Shooter(canHaveWeapons);
  //   }

  // enemy with a certain type
  //   enemyOfType(enemyType) {
  //     this.type = enemyType;
  //     this.actionTimer = floor(random(200, 3500));
  //     this.lives = 1;
  //     this.size = 40;
  //     this.weaponType = "";
  //     this.canHaveWeapons = false;
  //     this.travelSpeed = .8;
  //     this.travellingUp = false;
  //     this.travellingLeft = true;
  //     this.allowedAction = false;
  //     this.scanHaveWeapons = false;
  //     this.configureEnemy(this.type);
  //     this.asset = new Asset(this.size, this.angle, this.travelSpeed);
  //     this.shooter = new Shooter(this.allowedAction, this.weaponType);
  //   }

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
      this.setProjectileCount(5);
    } else if (enemyType === "SHARK") {
      this.setTravelSpeed(0.3);
      this.setLives(3);
      this.setFillColor(color(37, 204, 247));
      this.setIcon("\uf72c");
      this.setSize(80);
      this.setScoreAmount(100);
    } else if (enemyType === "PUFFERFISH") {
      this.setActionTimer(floor(random(200, 1500)));
      this.setTravelSpeed(0.25);
      this.setAngle(random(0, TWO_PI));
      this.setFillColor(color(248, 239, 186));
      this.setIcon("\uf5a4");
      this.setScoreAmount(30);
    } else if (enemyType === "PIRANHA") {
      this.setLives(1);
      this.setSize(25);
      this.setFillColor(color(154, 236, 219));
      this.setIcon("\uf578");
      this.setActionTimer(floor(random(50, 200)));
      this.setTravellingLeft(floor(random(0, 2)) > 0);
      this.setScoreAmount(25);
    } else if (enemyType === "LEVIATHAN") {
      this.setLives(10);
      this.setSize(200);
      this.setFillColor(color(179, 55, 113));
      this.setIcon("\uf6d5");
      this.setActionTimer(100);
      this.setTravellingLeft(floor(random(0, 2)) > 0);
      this.setCanHaveWeapons(true);
      this.setWeaponType("FIRE");
      this.setScoreAmount(1000);
      this.setProjectileCount(6);
    }
    this.asset = new Asset(this.size, this.angle, this.travelSpeed);
    console.log(this.size, this.angle, this.travelSpeed);
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
    return frameCount % actionTimer == 0;
  }

  getActionCanBeTaken(timer) {
    return frameCount % timer == 0;
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
      this.sallowedAction = false;
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
      this.size = 75;
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
    if (this.getActionCanBeTaken(timer)) {
      this.allowedAction = !this.allowedAction;
    }

    this.asset.move(true);
  }

  updatePiranha() {
    // change direction of piranha
    if (this.getActionCanBeTaken()) {
      travellingUp = !travellingUp;
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
    stroke(47, 53, 66);
    strokeWeight(3);
    let i = 0;
    while (i < this.lives) {
      fill(46, 213, 115);
      rect(
        this.asset.getXCord() + 10 * i,
        this.asset.getYCord() - (this.size / 2 + 15),
        10,
        10
      );
      i++;
    }
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
