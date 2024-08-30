class Shooter {
  constructor() {
    this.allowFire = false;
    this.weaponType;
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
      console.log("ALLOWED TO FIRE, CREATING PROJECTILE....");
      projectiles[index] = new Projectile(xCord, yCord, angle);
      console.log(projectiles[index])
      projectiles[index].asSubmarineBullet(xCord, yCord, angle);
            console.log(projectiles[index]);
      projectiles[index].toggleIsFired();
            console.log(projectiles[index]);
      projectiles[index].setIsEnemy(false);
    }
  }

  shootMultiple(projectiles, indexes, xCord, yCord) {
    // load and shoot multiple projectiles

    if (this.allowFire) {
      let a = 0;
      let isEnemy = true;

      for (let i = 0; i < indexes.length; i++) {
        if (this.weaponType.equals("BOLT")) {
          a = 15 * i;
        } else if (this.weaponType.equals("FIRE")) {
          xCord = 200;
          yCord = 270 + 30 * (i + 1);
        } else if (this.weaponType == "BOMB") {
          a = 15 * (i + 1);
          isEnemy = false;
        }
        // shoot missiles in direction chosen
        projectiles[indexes[i]] = new Projectile(
          xCord,
          yCord,
          a,
          this.weaponType
        );
        projectiles[indexes[i]].toggleIsFired();
        projectiles[indexes[i]].setIsEnemy(isEnemy);
      }
    }
  }
}
