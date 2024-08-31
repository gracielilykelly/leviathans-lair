class Player {
  constructor(playerName) {
    this.currentScore = 0;
    this.scores = [];
    this.highScore = 0;
    this.gameAttempts = 0;
    this.numberOfGames = 0;
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

  // getters
  getScoresList() {
    return this.scores;
  }

  getGameAttempts() {
    return this.gameAttempts;
  }

  getHighScore() {
    return this.highScore;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  getPlayerName() {
    return this.name;
  }

  getNumberOfGames() {
    return this.numberOfGames;
  }

  // setters
  setPlayerName(playerName) {
    // Clean the username and set it
    if (playerName.length() > 10) {
      this.name = playerName.substring(0, 10);
    } else {
      this.name = playerName.toUpperCase();
    }
  }
  setHighScore() {
    let scoretoSet = 0;
    for (let i = 0; i < this.scores.length; i++) {
      if (this.scores[i] > this.highScore) {
        this.highScore = this.scores[i];
      }
    }
    this.highScore = scoretoSet;
  }

  increaseGameAttempts() {
    this.gameAttempts++;
  }

  resetCurrentScore() {
    this.currentScore = 0;
  }

  increaseCurrentScore(score) {
    this.currentScore += score;
  }

  addScoretoList(score) {
    const index = this.gameAttempts - 1;
    this.scores[index] = score;
  }

  highestScore() {
    // return the highest score in the scores array
    let highestScore = this.scores[0];
    for (let i = 1; i < this.gameAttempts; i++) {
      if (this.scores[i] > highestScore) {
        highestScore = this.scores[i];
      }
    }
    return highestScore;
  }

  lowestScore() {
    // return the lowest score in the scores array
    let lowestScore = this.scores[0];
    for (let i = 1; i < this.gameAttempts; i++) {
      if (this.scores[i] < lowestScore) {
        lowestScore = this.scores[i];
      }
    }
    return lowestScore;
  }

  averageScore() {
    // calculates and returns the average of all scores stored in array
    let total = 0;
    for (let i = 0; i < this.gameAttempts; i++) {
      total = total + this.scores[i];
    }
    return total / this.gameAttempts;
  }
}
