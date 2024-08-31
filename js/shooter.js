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
        console.log("WEAPON TYPE", this.weaponType);
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
