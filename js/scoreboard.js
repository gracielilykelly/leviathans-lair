class Scoreboard {

  constructor(){
    this.heightDim = height / 15;
    this.widthDim = width;
  }

  // getters
  getHeightDim() {
    return this.heightDim;
  }

  getWidthDim() {
    return this.widthDim;
  }

  // setters
  setHeightDim(h) {
    this.heightDim = h;
  }

  setWidthDim(w) {
    this.widthDim = w;
  }

  // methods
  render(player, submarine) {
    /* Displays the scoreboard on the screen
     params:
     player (Player) - the player whose info you wish to display
     submarine (Submarine) - the submarine of which info you wish to show
     */
    fill(79, 79, 178);
    noStroke();
    rect(0, 0, this.widthDim, this.heightDim);
    textFont(wordFont, 30);
    fill(255, 184, 28);

    // display game count
    const currentGame = player.getGameAttempts() + 1;
    textAlign(LEFT, CENTER);
    text("Game " + currentGame + "/" + player.getNumberOfGames(), 30, 25);

    // display current score
    textAlign(CENTER, CENTER);
    text(player.getPlayerName() + ":" + player.getCurrentScore(), width/2, 25);

    // display hearts
    let i = 0;
    do {
      textFont(iconFont, 15);
      fill(252, 66, 123); 
      text("\uf004", this.widthDim - (80 - (i * 20)), this.heightDim/2);
      i++;
    } while (i < submarine.getLives());

    textFont(iconFont, 20);
    // display shield
    if (submarine.getHasShield() && !submarine.getShieldActive()) {
      fill(46, 204, 113);
    } else {
      // grey out the shield
      fill(189, 195, 199);
    }
    text("\uf712", width - 105, this.heightDim/2);

    // display bomb
    if (submarine.getHasBomb()) {
      fill(253, 114, 114);
    } else {
      fill(189, 195, 199);
    }
    text("\uf1e2", width - 130, this.heightDim/2);
  }
}
