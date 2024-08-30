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
