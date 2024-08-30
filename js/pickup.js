class Pickup {

  constructor(){
    this.type = "";
    this.icon = "";
    this.size = 0;
    this.speed = 0;
    this.show = false;
    this.allow = false;
    this.fillColor = 0;
    this.asset = undefined;
  }

  // default pickup
//   public Pickup() {
//     asset = new Asset(0, 0, 0, 0);
//     size = 0;
//     type = "HEART";
//     size = 20;
//     allow = false;
//   }

//   // pickup with specific co-ordinates and type
//   public Pickup(float boulderXCord, float boulderYCord, String pickupType) {
//     type = pickupType;
//     size = 20;
//     allow = false;
//     show = false;
//     speed = 3;
//     asset = new Asset(boulderXCord, boulderYCord, size, speed);
//     setPickupColorandIcon();
//   }

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
    if (this.type.equals("HEART")) {
      this.fillColor = color(252, 66, 123);
      this.icon = "\uf004";
    } else if (this.type.equals("SHIELD")) {
      this.fillColor = color(46, 204, 113);
      this.icon = "\uf712";
    } else if (this.type.equals("DIAMOND")) {
      this.fillColor = color(255, 184, 28);
      this.icon = "\uf3a5";
    } else if (type.equals("BOMB")) {
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
      textFont(this.iconFont, this.size);
      textAlign(CENTER, CENTER);
      noStroke();
      fill(this.fillColor);
      text(this.icon, this.asset.getXCord(), this.asset.getYCord());
    }
  }
}
