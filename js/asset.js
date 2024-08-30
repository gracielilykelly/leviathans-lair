class Asset {
  constructor() {
    this.xCord = 0;
    this.yCord = 0;
    this.travelSpeed = 0;
    this.angle = 0;
    this.size = 0;
  }

  // create enemy/boulder asset
  //  Asset( s,  a,  speed) {
  //   size = s;
  //   angle = a;
  //   travelSpeed = speed;
  // }

  // // create pickup asset
  //  Asset( x,  y,  s,  speed) {
  //   xCord = x;
  //   yCord = y;
  //   travelSpeed = speed;
  //   size = s;
  // }

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
      this.xCord -= travelSpeed;
    } else {
      this.xCord += travelSpeed;
    }
  }

  setVerticalDirection(travelUp) {
    /* Sets direction asset should travel in (up/down)
     params: travelUp (Boolean): set to true if asset 
     should travel up or false if it should travel down
     */
    if (travelUp) {
      this.yCord -= travelSpeed;
    } else {
      this.yCord += travelSpeed;
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
      setYCord(-this.size);
    } else {
      setYCord(height + this.size);
    }

    // spawn the asset left/right offscreen
    if (spawnLeft) {
      setXCord(-this.size);
    } else {
      setXCord(width + this.size);
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
      setXCord(random(leftMin, leftMax));
      setYCord(random(topMin, topMax));
    } else if (spawnTop && !spawnLeft) {
      // spawn top right
      setXCord(random(rightMax, rightMin));
      setYCord(random(topMin, topMax));
    } else if (!spawnTop && spawnLeft) {
      // spawn bottom left
      setXCord(random(this.size, leftMax));
      setYCord(random(bottomMax, bottomMin));
    } else {
      // spawn bottom right
      setXCord(random(rightMax, rightMin));
      setYCord(random(bottomMax, bottomMin));
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
    if (location.equals("TOP")) {
      return this.yCord < height / 15 + this.size / 2;
    } else if (location.equals("LEFT")) {
      return this.xCord < this.size / 2;
    } else if (location.equals("BOTTOM")) {
      return this.yCord > height - this.size / 2;
    } else if (location.equals("RIGHT")) {
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
          setXCord(this.size / 2 + 5);
        } else if (this.isBeyondBoundary("RIGHT")) {
          setXCord(width - this.size / 2 - 5);
        } else if (this.isBeyondBoundary("TOP")) {
          setYCord(height / 15 + this.size / 2 + 5);
        } else if (this.isBeyondBoundary("BOTTOM")) {
          setYCord(height - this.size / 2 - 5);
        }
      }
    } else if (!keepWithinBoundary) {
      // let it  back o game boundary on opposite side
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
