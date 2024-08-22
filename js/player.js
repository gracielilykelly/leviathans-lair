class Player {
  constructor(playerName) {
    this.name = this._setPlayerName(playerName);
  }

  _setPlayerName(playerName) {
    // Clean the username and set it
    if (playerName.length > 10) {
      return playerName.substring(0, 10);
    } else {
      return playerName.toUpperCase();
    }
  }
}
