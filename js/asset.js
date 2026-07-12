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

  setSpawnLocation(previousLocation = null) {
    const horizontalInset = this.size / 2;
    const topInset = height / 15 + this.size / 2;
    const bottomInset = height - this.size / 2;
    const minimumDistance = Math.min(width, height) * 0.35;

    for (let attempt = 0; attempt < 12; attempt++) {
      const edge = floor(random(0, 4));

      if (edge === 0) {
        this.setXCord(random(horizontalInset, width - horizontalInset));
        this.setYCord(-this.size);
      } else if (edge === 1) {
        this.setXCord(width + this.size);
        this.setYCord(random(topInset, bottomInset));
      } else if (edge === 2) {
        this.setXCord(random(horizontalInset, width - horizontalInset));
        this.setYCord(height + this.size);
      } else {
        this.setXCord(-this.size);
        this.setYCord(random(topInset, bottomInset));
      }

      if (
        !previousLocation ||
        Math.hypot(
          this.xCord - previousLocation.x,
          this.yCord - previousLocation.y,
        ) >= minimumDistance
      ) {
        return;
      }
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
      submarine.getYCord(),
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
        submarine.getYCord(),
      ) > this.travelSpeed
    ) {
      // set the course that is should move
      const rotateDeg = atan2(
        submarine.getYCord() - this.yCord,
        submarine.getXCord() - this.xCord,
      );
      this.setXCord(
        cos(rotateDeg) * (this.travelSpeed * speedIncrease) + this.xCord,
      );
      this.setYCord(
        sin(rotateDeg) * (this.travelSpeed * speedIncrease) + this.yCord,
      );
    }
  }
}

class Boulder {
  constructor() {
    // Prevent nearly invisible tiny rocks
    this.size = Math.floor(Math.random() * 70) + 35;

    this.angle = Math.random() * TWO_PI;
    this.travelSpeed = Math.random() * 0.7 + 0.1;

    // Separate visual rotation
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.006, 0.006);

    // Stable random values so the rock does not change shape each frame
    this.shapeSeed = random(10000);
    this.craterSeed = random(10000);

    this.asset = new Asset();

    this.asset.configureEnemyBoulderAsset(
      this.size,
      this.angle,
      this.travelSpeed,
    );
  }

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

  setSize(s) {
    this.size = s;
  }

  setTravelSpeed(speed) {
    this.travelSpeed = speed;
  }

  setAngle(a) {
    this.angle = a;
  }

  render() {
    const x = this.asset.getXCord();
    const y = this.asset.getYCord();

    this.rotation += this.rotationSpeed;

    push();

    translate(x, y);
    rotate(this.rotation);

    this.drawShadow();
    this.drawRockBody();
    this.drawRockHighlights();
    this.drawCraters();
    this.drawCracks();

    pop();
  }

  drawShadow() {
    noStroke();
    fill(0, 4, 12, 100);

    ellipse(
      this.size * 0.08,
      this.size * 0.12,
      this.size * 1.04,
      this.size * 0.93,
    );
  }

  drawRockBody() {
    randomSeed(this.shapeSeed);

    drawingContext.shadowColor = "rgba(0, 0, 0, 0.45)";

    fill(90, 105, 112);
    stroke(40, 52, 58);
    strokeWeight(Math.max(2, this.size * 0.035));

    beginShape();

    const points = 14;

    for (let i = 0; i < points; i++) {
      const pointAngle = map(i, 0, points, 0, TWO_PI);

      const radiusVariation = random(0.78, 1.03);
      const radius = this.size * 0.5 * radiusVariation;

      const pointX = cos(pointAngle) * radius;
      const pointY = sin(pointAngle) * radius;

      curveVertex(pointX, pointY);
    }

    // Repeat the first few points so curveVertex closes cleanly
    randomSeed(this.shapeSeed);

    for (let i = 0; i < 3; i++) {
      const pointAngle = map(i, 0, points, 0, TWO_PI);

      const radiusVariation = random(0.78, 1.03);
      const radius = this.size * 0.5 * radiusVariation;

      curveVertex(cos(pointAngle) * radius, sin(pointAngle) * radius);
    }

    endShape(CLOSE);
  }

  drawRockHighlights() {
    noStroke();

    // Broad upper-left highlight
    fill(165, 179, 180, 70);

    beginShape();

    vertex(-this.size * 0.31, -this.size * 0.19);
    vertex(-this.size * 0.12, -this.size * 0.37);
    vertex(this.size * 0.12, -this.size * 0.32);
    vertex(this.size * 0.2, -this.size * 0.18);
    vertex(-this.size * 0.05, -this.size * 0.11);

    endShape(CLOSE);

    // Dark lower face
    fill(28, 41, 48, 85);

    beginShape();

    vertex(-this.size * 0.35, this.size * 0.08);
    vertex(-this.size * 0.11, this.size * 0.3);
    vertex(this.size * 0.21, this.size * 0.28);
    vertex(this.size * 0.36, this.size * 0.04);
    vertex(this.size * 0.12, this.size * 0.15);

    endShape(CLOSE);
  }

  drawCraters() {
    randomSeed(this.craterSeed);

    const craterCount = Math.max(2, Math.floor(this.size / 25));

    for (let i = 0; i < craterCount; i++) {
      const craterX = random(-this.size * 0.24, this.size * 0.24);

      const craterY = random(-this.size * 0.22, this.size * 0.24);

      const craterSize = random(this.size * 0.09, this.size * 0.2);

      // Crater shadow
      noStroke();
      fill(30, 43, 49, 145);

      ellipse(craterX, craterY, craterSize, craterSize * 0.72);

      // Crater lower rim
      fill(155, 168, 168, 50);

      arc(
        craterX,
        craterY + craterSize * 0.04,
        craterSize,
        craterSize * 0.72,
        0,
        PI,
      );

      // Inner pit
      fill(42, 56, 62, 120);

      ellipse(
        craterX,
        craterY - craterSize * 0.02,
        craterSize * 0.62,
        craterSize * 0.4,
      );
    }
  }

  drawCracks() {
    randomSeed(this.shapeSeed + 500);

    noFill();
    stroke(35, 47, 52, 150);
    strokeWeight(Math.max(1, this.size * 0.018));

    const crackCount = this.size > 65 ? 3 : 2;

    for (let i = 0; i < crackCount; i++) {
      const startX = random(-this.size * 0.2, this.size * 0.2);

      const startY = random(-this.size * 0.2, this.size * 0.16);

      beginShape();

      vertex(startX, startY);

      let crackX = startX;
      let crackY = startY;

      for (let j = 0; j < 3; j++) {
        crackX += random(-this.size * 0.08, this.size * 0.08);
        crackY += random(this.size * 0.04, this.size * 0.1);

        vertex(crackX, crackY);
      }

      endShape();
    }
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
    this.facingRight = true;
    this.previousXCord = 0;
    this.maxLives;
    this.bossActive;
    this.bossIntroTimer;
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
      this.bossActive = false;
      this.bossIntroTimer = 0;
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
    this.maxLives = this.lives;
    this.asset = new Asset(this.size, this.angle, this.travelSpeed);
    this.asset.configureEnemyBoulderAsset(
      this.size,
      this.angle,
      this.travelSpeed,
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

  getAsset() {
    return this.asset;
  }

  getProjectileCount() {
    return this.projectileCount;
  }

  getActionCanBeTaken() {
    return frameCount % this.actionTimer == 0;
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

  getLifeValues() {
    return {
      current: Math.max(0, this.lives),
      maximum: Math.max(1, this.maxLives),
    };
  }

  // setters
  loseLife() {
    // only allow boss to lose life when active
    if (this.type === "LEVIATHAN" && !this.bossActive) {
      return;
    }

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
      if (!this.bossActive) {
        this.bossIntroTimer++;

        if (this.bossIntroTimer >= 60) {
          this.bossActive = true;
        }
      }

      this.travellingLeft = true;
      this.shooter.setAllowFire(this.bossActive);
    } else {
      this.asset.setXCord((x += 1 * this.travelSpeed));
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
    const oldX = this.asset.getXCord();

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

    const newX = this.asset.getXCord();
    const horizontalMovement = newX - oldX;

    // Avoid flipping when movement is effectively vertical.
    if (this.type !== "LEVIATHAN" && abs(horizontalMovement) > 0.01) {
      this.facingRight = horizontalMovement > 0;
    }

    // The sea dragon always faces right.
    if (this.type === "LEVIATHAN") {
      this.facingRight = true;
    }

    this.previousXCord = newX;
  }

  drawEnemyHealthBar() {
    const lifeValues = this.getLifeValues();

    // Do not draw a bar for one-hit enemies.
    if (lifeValues.maximum <= 1) {
      return;
    }

    const x = this.asset.getXCord();
    const y = this.asset.getYCord();

    const lifeRatio = constrain(lifeValues.current / lifeValues.maximum, 0, 1);

    const barWidth = Math.max(36, this.size * 0.85);
    const barHeight = 6;

    const barX = x - barWidth / 2;
    const barY = y - Math.max(30, this.size * 0.65);

    push();

    rectMode(CORNER);
    noStroke();

    // Frame
    fill(5, 12, 18, 220);
    rect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 3);

    // Empty bar
    fill(90, 24, 28);
    rect(barX, barY, barWidth, barHeight, 2);

    // Remaining lives
    if (lifeRatio > 0.6) {
      fill(40, 220, 115);
    } else if (lifeRatio > 0.3) {
      fill(245, 175, 35);
    } else {
      fill(245, 55, 50);
    }

    rect(barX, barY, barWidth * lifeRatio, barHeight, 2);

    pop();
  }

  drawBossHealthBar() {
    const currentLives = Math.max(0, this.lives);
    const maximumLives = Math.max(1, this.maxLives);
    const lifeRatio = constrain(currentLives / maximumLives, 0, 1);

    // Animate the bar appearing.
    const introProgress = constrain(this.bossIntroTimer / 45, 0, 1);

    const fullBarWidth = Math.min(width * 0.58, 620);
    const barWidth = fullBarWidth * introProgress;
    const barHeight = 18;

    const barX = width / 2 - barWidth / 2;
    const barY = height - 58;

    push();

    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    textFont("sans-serif");

    // Dark underwater panel
    noStroke();
    fill(2, 22, 32, 220);

    rect(barX - 12, barY - 34, barWidth + 24, barHeight + 47, 8);

    // Boss title
    fill(170, 240, 245, 255);
    textStyle(BOLD);
    textSize(18);

    text("THE LEVIATHAN", width / 2, barY - 20);
    fill(90, 190, 205);

    // Empty health bar
    stroke(90, 190, 205);
    strokeWeight(2);
    fill(3, 35, 45);

    rect(barX, barY, barWidth, barHeight, 5);

    // Remaining health
    noStroke();
    fill(20, 165, 175);

    rect(barX, barY, barWidth * lifeRatio, barHeight, 5);

    // Brighter upper-water highlight
    fill(115, 235, 225, 130);

    rect(barX + 2, barY + 2, Math.max(0, barWidth * lifeRatio - 4), 4, 3);

    // Damage colour near death
    if (lifeRatio < 0.3) {
      fill(235, 80, 55, 150);

      rect(barX, barY, barWidth * lifeRatio, barHeight, 5);
    }

    pop();
  }

  render() {
    const x = this.asset.getXCord();
    const y = this.asset.getYCord();

    push();

    translate(x, y);

    if (this.type !== "LEVIATHAN" && !this.facingRight) {
      scale(-1, 1);
    }

    const enemyType = String(this.type).toUpperCase();

    if (enemyType === "SHARK") {
      this.drawShark();
    } else if (enemyType === "PUFFERFISH") {
      this.drawPufferfish();
    } else if (enemyType === "JELLYFISH") {
      this.drawJellyfish();
    } else if (enemyType === "PIRANHA") {
      this.drawFish();
    } else if (enemyType === "LEVIATHAN") {
      this.drawLeviathan();
    } else {
      this.drawFish();
    }

    pop();

    pop();

    const showBossBar =
      enemyType === "LEVIATHAN" &&
      this.lives > 0 &&
      this.asset.getXCord() >= 100;

    if (showBossBar) {
      this.drawBossHealthBar();
    } else if (enemyType !== "LEVIATHAN") {
      this.drawEnemyHealthBar();
    }
  }

  drawShark() {
    const attackLunge = this.allowedAction ? sin(frameCount * 0.4) * 2 : 0;

    translate(attackLunge, 0);

    const s = this.size / 70;
    const swim = sin(frameCount * 0.12) * 0.08;

    push();

    rotate(swim);
    scale(s);

    // Shadow
    noStroke();
    fill(0, 10, 22, 90);
    ellipse(2, 5, 78, 31);

    // Tail
    stroke(10, 42, 57);
    strokeWeight(3);
    fill(35, 111, 137);

    beginShape();
    vertex(-34, 0);
    vertex(-55, -20);
    vertex(-49, 0);
    vertex(-55, 20);
    endShape(CLOSE);

    // Main body
    const bodyGradient = drawingContext.createLinearGradient(0, -20, 0, 20);

    bodyGradient.addColorStop(0, "#91c8d5");
    bodyGradient.addColorStop(0.45, "#357d99");
    bodyGradient.addColorStop(1, "#123d57");

    drawingContext.fillStyle = bodyGradient;

    stroke(9, 43, 60);
    strokeWeight(3);

    beginShape();
    vertex(-38, 0);
    bezierVertex(-25, -19, 14, -21, 39, -6);
    bezierVertex(48, 0, 41, 8, 28, 13);
    bezierVertex(2, 22, -25, 17, -38, 0);
    endShape(CLOSE);

    // Dorsal fin
    fill(34, 99, 124);

    beginShape();
    vertex(-8, -16);
    vertex(4, -38);
    vertex(14, -15);
    endShape(CLOSE);

    // Side fin
    fill(29, 83, 106);

    beginShape();
    vertex(0, 8);
    vertex(-10, 28);
    vertex(17, 12);
    endShape(CLOSE);

    // White belly
    noStroke();
    fill(196, 224, 225, 160);

    beginShape();
    vertex(-25, 7);
    bezierVertex(-5, 18, 23, 14, 38, 4);
    bezierVertex(28, 20, -5, 25, -25, 7);
    endShape(CLOSE);

    // Gill lines
    stroke(18, 59, 73, 150);
    strokeWeight(2);

    line(18, -5, 13, 7);
    line(23, -4, 18, 8);

    // Eye
    noStroke();
    fill(235);
    circle(29, -7, 7);

    fill(5, 12, 17);
    circle(30, -7, 3.5);

    if (this.allowedAction) {
      // Open mouth
      stroke(5, 18, 24);
      strokeWeight(2.5);
      fill(35, 4, 10);

      beginShape();

      vertex(29, 1);
      vertex(48, 0);
      vertex(42, 14);
      vertex(30, 10);

      endShape(CLOSE);

      // Upper teeth
      noStroke();
      fill(248, 244, 220);

      triangle(31, 2, 35, 2, 33, 8);
      triangle(36, 1, 40, 1, 38, 8);
      triangle(41, 1, 45, 1, 43, 7);

      // Lower teeth
      triangle(31, 10, 35, 10, 33, 5);
      triangle(36, 12, 40, 12, 38, 6);
      triangle(41, 12, 44, 11, 42, 6);

      // Red inner mouth
      fill(150, 28, 40);
      ellipse(38, 8, 9, 4);

      // Angry eyebrow
      stroke(5, 18, 24);
      strokeWeight(3);

      line(24, -12, 34, -9);
    } else {
      // Closed resting mouth
      noFill();
      stroke(5, 18, 24);
      strokeWeight(2);

      arc(35, 4, 18, 10, 0.15, PI - 0.15);

      // Small visible teeth
      noStroke();
      fill(245);

      triangle(31, 6, 34, 11, 36, 6);
      triangle(37, 6, 40, 10, 42, 5);
    }

    pop();
  }

  drawPufferfish() {
    const angry = this.allowedAction;

    const s = this.size / 62;

    const pulseSpeed = angry ? 0.16 : 0.08;
    const pulseAmount = angry ? 0.045 : 0.07;

    const pulse = 1 + sin(frameCount * pulseSpeed) * pulseAmount;

    // Small shake while angry
    const shakeX = angry ? sin(frameCount * 0.75) * 1.5 : 0;

    const shakeY = angry ? cos(frameCount * 0.68) * 1.2 : 0;

    push();

    translate(shakeX, shakeY);
    scale(s * pulse);

    const bodyColour = angry ? color(238, 68, 76) : color(214, 198, 91);

    const darkColour = angry ? color(111, 21, 38) : color(79, 79, 44);

    const spikeColour = angry ? color(255, 96, 77) : color(196, 183, 82);

    if (angry) {
      drawingContext.shadowColor = "rgba(255, 55, 55, 0.85)";

      noStroke();
      fill(255, 45, 55, 25);

      circle(0, 0, 76 + sin(frameCount * 0.14) * 5);
    }

    const spikeCount = angry ? 22 : 18;

    stroke(darkColour);
    strokeWeight(angry ? 3.5 : 2.5);
    fill(spikeColour);

    for (let i = 0; i < spikeCount; i++) {
      const angle = map(i, 0, spikeCount, 0, TWO_PI);

      const innerRadius = 24;

      const outerRadius =
        (angry ? 39 : 33) + sin(frameCount * 0.07 + i) * (angry ? 2.5 : 1.5);

      const spread = angry ? 0.065 : 0.085;

      triangle(
        cos(angle - spread) * innerRadius,
        sin(angle - spread) * innerRadius,

        cos(angle) * outerRadius,
        sin(angle) * outerRadius,

        cos(angle + spread) * innerRadius,
        sin(angle + spread) * innerRadius,
      );
    }

    const tailWag = sin(frameCount * (angry ? 0.3 : 0.16)) * (angry ? 5 : 3);

    stroke(darkColour);
    strokeWeight(2.5);
    fill(spikeColour);

    beginShape();

    vertex(-23, 0);
    vertex(-43, -14 + tailWag);
    vertex(-38, 0);
    vertex(-43, 14 + tailWag);

    endShape(CLOSE);

    drawingContext.shadowColor = angry
      ? "rgba(255, 55, 55, 0.65)"
      : "rgba(223, 204, 94, 0.35)";

    stroke(darkColour);
    strokeWeight(3);
    fill(bodyColour);

    circle(0, 0, 53);

    // Belly
    noStroke();

    if (angry) {
      fill(255, 133, 113, 115);
    } else {
      fill(242, 226, 151, 170);
    }

    arc(3, 4, 46, 42, 0, PI);

    fill(red(darkColour), green(darkColour), blue(darkColour), 130);

    circle(-12, -11, 6);
    circle(3, -16, 5);
    circle(-8, 8, 5);
    circle(12, 8, 4);
    circle(14, -6, 5);

    fill(245);
    stroke(darkColour);
    strokeWeight(2);

    ellipse(14, -8, 13, 11);
    ellipse(-1, -8, 13, 11);

    noStroke();
    fill(20, 10, 15);

    const pupilOffset = angry ? 2 : 1;

    circle(16 + pupilOffset, -7, 5);
    circle(1 + pupilOffset, -7, 5);

    // Angry eyebrows
    if (angry) {
      stroke(70, 10, 20);
      strokeWeight(4);

      line(-7, -17, 5, -12);
      line(9, -12, 22, -17);
    }

    if (angry) {
      // Open snarling mouth
      fill(54, 8, 18);
      stroke(91, 12, 25);
      strokeWeight(2);

      arc(10, 7, 25, 18, 0, PI, CHORD);

      // Teeth
      noStroke();
      fill(250, 244, 218);

      triangle(2, 8, 7, 8, 4.5, 14);
      triangle(9, 8, 14, 8, 11.5, 14);
      triangle(16, 8, 21, 8, 18.5, 14);
    } else {
      noStroke();
      fill(60, 50, 35);

      ellipse(24, 4, 9, 7);
    }

    stroke(darkColour);
    strokeWeight(2);
    fill(spikeColour);

    ellipse(-4, 16, 15, angry ? 10 : 8);

    pop();
  }

  drawJellyfish() {
    const s = this.size / 65;
    const pulse = 1 + sin(frameCount * 0.09) * 0.08;

    push();

    scale(s * pulse, s / pulse);

    const jellyColour = this.fillColor || color(150, 108, 220);

    drawingContext.shadowColor = `rgba(${red(jellyColour)}, ${green(jellyColour)}, ${blue(jellyColour)}, 0.8)`;

    stroke(
      red(jellyColour) * 0.7,
      green(jellyColour) * 0.7,
      blue(jellyColour) * 0.7,
    );

    strokeWeight(2);
    fill(red(jellyColour), green(jellyColour), blue(jellyColour), 185);

    beginShape();

    vertex(-27, 3);
    bezierVertex(-25, -24, 25, -24, 27, 3);
    bezierVertex(20, 14, 12, 9, 6, 14);
    bezierVertex(0, 8, -7, 14, -13, 9);
    bezierVertex(-19, 14, -24, 10, -27, 3);

    endShape(CLOSE);


    noStroke();
    fill(255, 255, 255, 55);

    arc(-5, -3, 31, 24, PI, TWO_PI);


    stroke(255, 255, 255, 55);
    strokeWeight(2);

    line(-11, -9, -8, 5);
    line(0, -12, 0, 7);
    line(11, -9, 8, 5);


    noFill();
    stroke(red(jellyColour), green(jellyColour), blue(jellyColour), 180);

    strokeWeight(3);

    const tentacleXs = [-18, -9, 0, 9, 18];

    for (let i = 0; i < tentacleXs.length; i++) {
      const tentacleX = tentacleXs[i];
      const movement = sin(frameCount * 0.08 + i) * 7;

      bezier(
        tentacleX,
        9,
        tentacleX + movement,
        22,
        tentacleX - movement,
        33,
        tentacleX + movement * 0.5,
        46,
      );
    }


    noStroke();
    fill(20, 16, 35, 170);

    circle(-9, -1, 4);
    circle(9, -1, 4);

    noFill();
    stroke(20, 16, 35, 140);
    strokeWeight(1.5);
    arc(0, 3, 11, 7, 0, PI);

    pop();
  }

  drawFish() {
    const s = this.size / 55;
    const tailMovement = sin(frameCount * 0.18) * 5;

    push();

    scale(s);

    // Tail
    stroke(12, 48, 69);
    strokeWeight(2);
    fill(63, 172, 197);

    beginShape();
    vertex(-26, 0);
    vertex(-43, -14 + tailMovement);
    vertex(-38, 0);
    vertex(-43, 14 + tailMovement);
    endShape(CLOSE);

    // Body
    const fishGradient = drawingContext.createLinearGradient(0, -15, 0, 15);

    fishGradient.addColorStop(0, "#9cf5f2");
    fishGradient.addColorStop(0.5, "#35b7cc");
    fishGradient.addColorStop(1, "#12617d");

    drawingContext.fillStyle = fishGradient;

    stroke(10, 53, 71);
    strokeWeight(2);

    ellipse(0, 0, 58, 31);

    fill(55, 179, 200);

    beginShape();
    vertex(24, -9);
    vertex(34, 0);
    vertex(24, 9);
    endShape(CLOSE);


    fill(49, 144, 169);

    beginShape();
    vertex(-5, -14);
    vertex(4, -27);
    vertex(13, -13);
    endShape(CLOSE);

    fill(38, 124, 153);

    beginShape();
    vertex(-3, 6);
    vertex(-10, 20);
    vertex(12, 9);
    endShape(CLOSE);


    noFill();
    stroke(210, 255, 255, 70);
    strokeWeight(1);

    arc(-12, -2, 11, 9, -HALF_PI, HALF_PI);
    arc(0, -2, 11, 9, -HALF_PI, HALF_PI);
    arc(12, -2, 11, 9, -HALF_PI, HALF_PI);

    arc(-6, 6, 11, 9, -HALF_PI, HALF_PI);
    arc(6, 6, 11, 9, -HALF_PI, HALF_PI);

    noStroke();
    fill(250);
    circle(21, -5, 8);

    fill(5, 17, 24);
    circle(22, -5, 4);

    noFill();
    stroke(9, 37, 47);
    strokeWeight(1.5);
    arc(30, 4, 9, 6, 0.1, PI - 0.1);

    pop();
  }

  drawLeviathan() {
    const s = this.size / 200;

    const breathe = 1 + sin(frameCount * 0.035) * 0.025;

    const swim = sin(frameCount * 0.028) * 0.035;

    push();

    rotate(swim);
    scale(s * breathe);

    drawingContext.shadowColor = "rgba(22, 215, 178, 0.55)";

    noStroke();
    fill(15, 134, 125, 30);

    ellipse(0, 2, 195, 115);

    noFill();
    stroke(16, 67, 76);
    strokeWeight(31);

    const tailWave = sin(frameCount * 0.045) * 19;

    bezier(-47, 5, -87, -12 + tailWave, -111, 28 - tailWave, -143, 4);

    stroke(29, 121, 119);
    strokeWeight(23);

    bezier(-47, 2, -87, -15 + tailWave, -111, 24 - tailWave, -143, 1);

    stroke(10, 56, 65);
    strokeWeight(4);
    fill(22, 128, 130);

    beginShape();

    vertex(-137, 2);
    vertex(-163, -25 + tailWave * 0.3);
    vertex(-156, 0);
    vertex(-165, 27 + tailWave * 0.3);

    endShape(CLOSE);

    const bodyGradient = drawingContext.createLinearGradient(0, -55, 0, 55);

    bodyGradient.addColorStop(0, "#58ddd0");
    bodyGradient.addColorStop(0.28, "#188d91");
    bodyGradient.addColorStop(0.65, "#075064");
    bodyGradient.addColorStop(1, "#03283f");

    drawingContext.fillStyle = bodyGradient;

    stroke(3, 37, 52);
    strokeWeight(5);

    beginShape();

    vertex(-66, -1);

    bezierVertex(-43, -50, 26, -58, 69, -28);

    bezierVertex(101, -7, 101, 22, 68, 39);

    bezierVertex(21, 62, -42, 43, -66, -1);

    endShape(CLOSE);

    noStroke();
    fill(126, 221, 194, 105);

    beginShape();

    vertex(-42, 15);

    bezierVertex(-9, 37, 46, 39, 78, 14);

    bezierVertex(60, 48, -15, 63, -42, 15);

    endShape(CLOSE);

    stroke(10, 82, 86, 95);
    strokeWeight(2);

    for (let i = 0; i < 6; i++) {
      const plateX = -25 + i * 18;

      line(plateX, 19, plateX + 4, 39);
    }

    stroke(5, 48, 59);
    strokeWeight(3);
    fill(43, 194, 168);

    for (let i = 0; i < 7; i++) {
      const spineX = -45 + i * 18;

      const spineHeight = 24 + sin(i * 0.9) * 8;

      triangle(spineX - 8, -33, spineX, -33 - spineHeight, spineX + 8, -33);
    }

    stroke(3, 31, 43);
    strokeWeight(4);
    fill(15, 101, 105);

    beginShape();

    vertex(44, -25);
    vertex(79, -34);
    vertex(108, -18);
    vertex(123, -5);
    vertex(111, 8);
    vertex(76, 14);
    vertex(47, 5);

    endShape(CLOSE);

    // Long upper snout
    fill(20, 119, 117);

    beginShape();

    vertex(82, -19);
    vertex(125, -14);
    vertex(142, -3);
    vertex(121, 4);
    vertex(88, 0);

    endShape(CLOSE);

    fill(4, 44, 54);

    beginShape();

    vertex(84, 1);
    vertex(140, 1);
    vertex(123, 16);
    vertex(83, 13);

    endShape(CLOSE);

    fill(24, 4, 14);
    noStroke();

    beginShape();

    vertex(92, 1);
    vertex(137, 1);
    vertex(121, 10);
    vertex(91, 10);

    endShape(CLOSE);

    fill(244, 239, 207);

    for (let i = 0; i < 6; i++) {
      const toothX = 94 + i * 7;

      triangle(toothX, 1, toothX + 5, 1, toothX + 2.5, 8);
    }

    stroke(7, 51, 59);
    strokeWeight(3);
    fill(75, 212, 185);

    beginShape();

    vertex(67, -28);
    vertex(57, -57);
    vertex(79, -31);

    endShape(CLOSE);

    beginShape();

    vertex(84, -27);
    vertex(86, -53);
    vertex(96, -23);

    endShape(CLOSE);

    noFill();
    stroke(87, 227, 202, 150);
    strokeWeight(2.5);

    const whiskerWave = sin(frameCount * 0.06) * 8;

    bezier(104, 4, 130, 18, 137, 26 + whiskerWave, 162, 21);

    bezier(100, 7, 124, 27, 129, 42 - whiskerWave, 153, 42);

    drawingContext.shadowColor = "rgba(255, 214, 60, 1)";

    noStroke();
    fill(255, 210, 54);

    ellipse(96, -13, 14, 9);

    fill(20, 8, 9);
    ellipse(99, -13, 3, 8);

    fill(255, 248, 195);
    circle(93, -15, 3);

    stroke(5, 46, 59);
    strokeWeight(3);
    fill(13, 91, 105);

    beginShape();

    vertex(3, 22);
    vertex(-18, 65);
    vertex(34, 38);

    endShape(CLOSE);

    noFill();
    stroke(137, 244, 213, 45);
    strokeWeight(2);

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 5; column++) {
        const scaleX = -31 + column * 19 + row * 7;

        const scaleY = -13 + row * 15;

        arc(scaleX, scaleY, 18, 13, 0, PI);
      }
    }

    // The Leviathan's shooter is enabled once it reaches
    // its attack position.
    if (this.shooter && this.shooter.getAllowFire()) {
      const chargePulse = 8 + sin(frameCount * 0.25) * 3;

      drawingContext.shadowColor = "rgba(255, 80, 20, 1)";

      noStroke();
      fill(255, 72, 20, 100);

      circle(138, 1, chargePulse * 2.1);

      fill(255, 179, 37, 210);
      circle(138, 1, chargePulse);

      fill(255, 248, 190);
      circle(138, 1, chargePulse * 0.4);
    }

    pop();
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
    return this.size;
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
    if (!this.allow || !this.show) {
      return;
    }

    const x = this.asset.getXCord();
    const y = this.asset.getYCord();

    const pulse = 1 + sin(frameCount * 0.09 + x * 0.01) * 0.1;

    push();

    translate(x, y);
    scale(pulse);

    noFill();

    stroke(
      red(this.fillColor),
      green(this.fillColor),
      blue(this.fillColor),
      35,
    );

    strokeWeight(2);

    circle(0, 0, 46 + sin(frameCount * 0.08) * 6);

    stroke(
      red(this.fillColor),
      green(this.fillColor),
      blue(this.fillColor),
      80,
    );

    strokeWeight(1);
    circle(0, 0, 37);

    drawingContext.shadowColor =
      "rgba(" +
      red(this.fillColor) +
      "," +
      green(this.fillColor) +
      "," +
      blue(this.fillColor) +
      ",0.9)";

    stroke(red(this.fillColor), green(this.fillColor), blue(this.fillColor));

    strokeWeight(2);
    fill(4, 25, 40, 225);

    circle(0, 0, 34);

    noStroke();
    fill(255, 255, 255, 28);
    arc(-2, -2, 27, 27, PI, TWO_PI);

    drawingContext.shadowColor =
      "rgba(" +
      red(this.fillColor) +
      "," +
      green(this.fillColor) +
      "," +
      blue(this.fillColor) +
      ",1)";

    textFont(iconFont, this.size);
    textAlign(CENTER, CENTER);
    fill(this.fillColor);
    text(this.icon, 0, 1);

    fill(255, 255, 255, 70);
    text(this.icon, -1, 0);

    pop();
  }


}
