class Pickup {
  constructor(xCord, yCord, pickupType) {
    this.type = pickupType;
    this.icon = "";
    this.size = 20;
    this.speed = 0;
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
