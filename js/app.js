let iconFont;
let wordFont;
let game;
let playerName;
let difficultyLevel;
let appState = "start";
let pausedFrame = null;
let latestHighScoreId = null;
let scoreboardClient = null;
const highScoreRequests = new Map();
const placementMedals = {
  1: { symbol: "🥇", label: "Gold medal" },
  2: { symbol: "🥈", label: "Silver medal" },
  3: { symbol: "🥉", label: "Bronze medal" },
};

function preload() {
  iconFont = loadFont("fonts/fa-solid.ttf");
  wordFont = loadFont("fonts/joystix-monospace.otf");
}

function createGame() {
  game = new Game(difficultyLevel, playerName);
}

function setup() {
  pixelDensity(1);
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent("game");
  textFont(wordFont);
  bindScreenControls();
  void renderHighScores();
}

function windowResized() {
  width = window.innerWidth;
  height = window.innerHeight;
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function setScreen(id) {
  for (const screen of document.querySelectorAll(".state-screen")) {
    screen.hidden = screen.id !== id;
  }
}

function getScoreboardDifficulty() {
  const selectedDifficulty = document.querySelector(
    'input[name="difficulty"]:checked',
  );
  return selectedDifficulty?.value || difficultyLevel || "NORMAL";
}

function getScoreboardClient() {
  if (scoreboardClient) return scoreboardClient;

  const config = window.SUPABASE_CONFIG;
  if (!config?.url || !config?.publishableKey || !window.supabase) return null;

  scoreboardClient = window.supabase.createClient(
    config.url,
    config.publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
  return scoreboardClient;
}

async function loadSharedHighScores(
  difficulty = getScoreboardDifficulty(),
  forceRefresh = false,
) {
  const client = getScoreboardClient();
  if (!client) throw new Error("Supabase scoreboard is not configured");
  if (!forceRefresh && highScoreRequests.has(difficulty)) {
    return highScoreRequests.get(difficulty);
  }

  const request = (async () => {
    const { data, error } = await client
      .from("high_scores")
      .select("id,name,score,difficulty,created_at")
      .eq("difficulty", difficulty)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(5);

    if (error) throw error;
    return data.map((entry) => ({ ...entry, score: Number(entry.score) }));
  })();

  highScoreRequests.set(difficulty, request);
  try {
    return await request;
  } finally {
    if (highScoreRequests.get(difficulty) === request) {
      highScoreRequests.delete(difficulty);
    }
  }
}

async function saveHighScore(player, score) {
  const entry = {
    name: player.getPlayerName(),
    score,
    difficulty: game.getDifficulty(),
  };
  const client = getScoreboardClient();
  if (!client) throw new Error("Supabase scoreboard is not configured");

  const { data, error } = await client
    .from("high_scores")
    .insert(entry)
    .select("id")
    .single();
  if (error) throw error;

  const scores = await loadSharedHighScores(entry.difficulty, true);
  const savedScore = scores.find((entry) => entry.id === data.id);
  const placement = savedScore
    ? new Set(
        scores
          .filter((entry) => entry.score > savedScore.score)
          .map((entry) => entry.score),
      ).size + 1
    : null;
  return {
    id: data.id,
    placement,
    scores,
  };
}

async function renderHighScores(providedScores) {
  const difficulty = getScoreboardDifficulty();
  let scores = providedScores;
  let unavailable = false;
  if (!scores) {
    renderScoreMessage("Loading scores...", "loading-score");
    try {
      scores = await loadSharedHighScores(difficulty);
    } catch (error) {
      console.warn("Shared scoreboard unavailable", error);
      scores = [];
      unavailable = true;
    }
  }

  if (difficulty !== getScoreboardDifficulty()) return;

  for (const list of document.querySelectorAll(".high-score-list")) {
    list.replaceChildren();

    if (scores.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "empty-score";
      emptyItem.textContent = unavailable
        ? "Scores temporarily unavailable"
        : "No scores recorded yet";
      list.append(emptyItem);
      continue;
    }

    let placement = 0;
    let previousScore = null;

    scores.forEach((entry) => {
      if (entry.score !== previousScore) placement += 1;
      previousScore = entry.score;

      const item = document.createElement("li");
      const captain = document.createElement("span");
      const score = document.createElement("strong");
      captain.textContent = `${placement}. ${entry.name}`;
      const medalDetails = placementMedals[placement];
      if (medalDetails) {
        const medal = document.createElement("span");
        medal.className = "score-medal";
        medal.textContent = medalDetails.symbol;
        medal.setAttribute("role", "img");
        medal.setAttribute("aria-label", medalDetails.label);
        captain.append(" ", medal);
      }
      if (entry.id && entry.id === latestHighScoreId) {
        item.classList.add("latest-high-score");
      }
      score.textContent = entry.score;
      item.append(captain, score);
      list.append(item);
    });
  }
}

function renderScoreMessage(message, className = "") {
  for (const list of document.querySelectorAll(".high-score-list")) {
    const item = document.createElement("li");
    item.className = `empty-score ${className}`.trim();
    item.textContent = message;
    list.replaceChildren(item);
  }
}

function celebrateTopScore() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const celebration = document.createElement("div");
  celebration.className = "confetti-celebration";
  celebration.setAttribute("aria-hidden", "true");
  const colours = ["#ffbf3d", "#63d7cf", "#e3fffa", "#e86f71", "#3aa6ad"];

  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement("i");
    piece.style.setProperty("--x", `${Math.random() * 100}vw`);
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    piece.style.setProperty("--delay", `${Math.random() * 0.7}s`);
    piece.style.setProperty("--duration", `${1.8 + Math.random() * 1.3}s`);
    piece.style.setProperty("--colour", colours[index % colours.length]);
    piece.style.setProperty("--spin", `${Math.random() * 720 + 360}deg`);
    celebration.append(piece);
  }

  document.body.append(celebration);
  window.setTimeout(() => celebration.remove(), 3900);
}

function startExpedition() {
  const form = document.getElementById("start-form");
  const formData = new FormData(form);
  playerName = String(formData.get("playerName") || "BOB").trim() || "BOB";
  difficultyLevel = String(formData.get("difficulty") || "NORMAL");
  createGame();
  appState = "playing";
  setScreen("");
}

async function gameOver() {
  if (appState !== "playing") return;

  appState = "thanks";
  const player = game.getPlayer();
  const finalScore = player.getCurrentScore();
  document.getElementById("final-score").textContent = finalScore;
  setScreen("thanks");
  renderScoreMessage("Saving score...", "loading-score");

  try {
    const highScoreResult = await saveHighScore(player, finalScore);
    latestHighScoreId = highScoreResult.placement
      ? highScoreResult.id
      : null;
    await renderHighScores(highScoreResult.scores);
    if (highScoreResult.placement === 1) celebrateTopScore();
  } catch (error) {
    latestHighScoreId = null;
    console.warn("Could not save score", error);
    await renderHighScores();
  }
}

function showDialog(isQuitDialog) {
  if (!game || appState !== "playing") return;
  pausedFrame = get();
  game.getSubmarine().setTravelSpeedToZero();
  game.getSubmarine().setIsBoosting(false);
  game.setRunGame(false);
  appState = "dialog";
  document.getElementById("dialog-title").textContent = isQuitDialog
    ? "Quit?"
    : "Controls";
  document.getElementById("controls-list").hidden = isQuitDialog;
  document.getElementById("quit-message").hidden = !isQuitDialog;
  document.getElementById("confirm-quit-button").hidden = !isQuitDialog;
  document.getElementById("confirm-quit-button").disabled = false;
  setScreen("dialog-screen");
}

function closeDialog() {
  setScreen("");
  appState = "playing";
  pausedFrame = null;
  game.setRunGame(true);
}

function resumePausedGame() {
  if (!game || game.getRunGame() || appState !== "playing") return;
  pausedFrame = null;
  document.getElementById("pause-resume-button").hidden = true;
  game.setRunGame(true);
}

function bindScreenControls() {
  document.getElementById("start-form").addEventListener("submit", (event) => {
    event.preventDefault();
    startExpedition();
  });
  for (const difficultyOption of document.querySelectorAll(
    'input[name="difficulty"]',
  )) {
    difficultyOption.addEventListener("change", () => {
      latestHighScoreId = null;
      void renderHighScores();
    });
  }
  document
    .getElementById("dialog-close-button")
    .addEventListener("click", closeDialog);
  document
    .getElementById("pause-resume-button")
    .addEventListener("click", resumePausedGame);
  document
    .getElementById("confirm-quit-button")
    .addEventListener("click", (event) => {
      // Only end the game once, even if the button is clicked repeatedly.
      if (
        appState !== "dialog" ||
        document.getElementById("quit-message").hidden
      ) {
        return;
      }
      event.currentTarget.disabled = true;
      appState = "playing";
      void gameOver();
    });
  document.getElementById("thanks-play-again").addEventListener("click", () => {
    appState = "start";
    latestHighScoreId = null;
    setScreen("start-screen");
  });
}

// handle key events
function keyPressed() {
  if (
    appState === "dialog" &&
    (key == "i" || key == "I") &&
    !document.getElementById("controls-list").hidden
  ) {
    closeDialog();
    return;
  }

  if (!game || appState !== "playing") return;

  if (key == "p" || key == "P") {
    if (game.getRunGame()) {
      pausedFrame = get();
      game.getSubmarine().setTravelSpeedToZero();
      game.getSubmarine().setIsBoosting(false);
      game.setRunGame(false);
      document.getElementById("pause-resume-button").hidden = false;
    } else {
      resumePausedGame();
    }
    return;
  }

  // Do not allow movement or weapons to change state while paused.
  if (!game.getRunGame()) return;

  if (keyCode == UP_ARROW) {
    // move the submarine up
    game.getSubmarine().setTravelSpeed(2.5);
    game.getSubmarine().setIsBoosting(true);
  } else if (keyCode == DOWN_ARROW) {
    // move the submarine down
    game.getSubmarine().setTravelSpeed(-2.5);
  } else if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
    // rotate the submarine
    game.getSubmarine().setRotation(keyCode);
  } else if (keyCode == 32) {
    //32 is SPACE KEY
    // shoot a missile
    game.getSubmarine().setIsAllowedFireMissile();
    game
      .getSubmarine()
      .getMissileShooter()
      .shootSingle(
        game.getProjectiles(),
        game.getAvailableProjectileIndexes(1)[0],
        game.getSubmarine().getXCord(),
        game.getSubmarine().getYCord(),
        game.getSubmarine().getRotation(),
      );
  } else if (key == "s" || key == "S") {
    // activate shield
    game.getSubmarine().activateShield();
  } else if (key == "b" || key == "B") {
    // shoot bomb
    if (game.getSubmarine().getHasBomb()) {
      game
        .getSubmarine()
        .getBombShooter()
        .shootMultiple(
          game.getProjectiles(),
          game.getAvailableProjectileIndexes(14),
          game.getSubmarine().getXCord(),
          game.getSubmarine().getYCord(),
        );
    }
    // remove the bomb from submarine inventory
    game.getSubmarine().setHasBomb(false);
  } else if (key == "e" || key == "E") {
    showDialog(true);
  } else if (key == "i" || key == "I") {
    showDialog(false);
  }
}

function keyReleased() {
  if (!game || appState !== "playing") return;
  // stop moving submarine
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    if (keyCode == UP_ARROW) {
      game.getSubmarine().setIsBoosting(false);
    }
    game.getSubmarine().setTravelSpeedToZero();
  }
}

let oceanParticles = [];
let oceanEffectsReady = false;

function initialiseOceanEffects() {
  oceanParticles = [];

  const particleAmount = 45;

  for (let i = 0; i < particleAmount; i++) {
    oceanParticles.push(createOceanParticle(true));
  }

  oceanEffectsReady = true;
}

function createOceanParticle(randomYPosition = false) {
  const isBubble = random() < 0.22;

  return {
    x: random(width),
    y: randomYPosition ? random(height) : height + random(20, 100),

    size: isBubble ? random(4, 14) : random(1, 4),

    speed: isBubble ? random(0.35, 1.1) : random(0.08, 0.35),

    drift: random(-0.25, 0.25),
    phase: random(TWO_PI),
    bubble: isBubble,
    opacity: isBubble ? random(35, 95) : random(30, 110),
  };
}

function drawOceanBackground() {
  if (!oceanEffectsReady) {
    initialiseOceanEffects();
  }

  drawOceanGradient();
  drawSurfaceGlow();
  drawLightRays();
  drawDistantCurrents();
  updateAndDrawOceanParticles();
}

function drawOceanGradient() {
  // Match the dark teal water used by the start and end screens.
  const topColour = color(7, 56, 74);
  const middleColour = color(3, 36, 52);
  const bottomColour = color(1, 13, 24);

  noFill();

  for (let y = 0; y < height; y += 8) {
    const progress = y / height;
    let lineColour;

    if (progress < 0.45) {
      lineColour = lerpColor(topColour, middleColour, progress / 0.45);
    } else {
      lineColour = lerpColor(
        middleColour,
        bottomColour,
        (progress - 0.45) / 0.55,
      );
    }

    stroke(lineColour);
    strokeWeight(9);
    line(0, y, width, y);
  }

  noStroke();
}

function drawSurfaceGlow() {
  const context = drawingContext;

  const glow = context.createLinearGradient(0, 0, 0, height * 0.42);

  glow.addColorStop(0, "rgba(119, 226, 226, 0.14)");
  glow.addColorStop(0.45, "rgba(29, 180, 178, 0.05)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.save();
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height * 0.42);
  context.restore();
}

function drawLightRays() {
  push();

  noStroke();
  blendMode(SCREEN);

  const rayMovement = sin(frameCount * 0.004) * 45;

  for (let i = 0; i < 5; i++) {
    const startX =
      (width / 4) * i - width * 0.1 + rayMovement * (i % 2 === 0 ? 1 : -1);

    const rayWidth = width * 0.09;

    fill(119, 226, 226, 8);

    triangle(startX, 0, startX + rayWidth, 0, startX + rayWidth * 3.5, height);

    fill(119, 226, 226, 4);

    triangle(
      startX + rayWidth * 0.4,
      0,
      startX + rayWidth * 1.4,
      0,
      startX + rayWidth * 2.5,
      height,
    );
  }

  blendMode(BLEND);
  pop();
}

function drawDistantCurrents() {
  push();

  noFill();
  strokeWeight(1);

  for (let i = 0; i < 7; i++) {
    const baseY = height * 0.2 + i * height * 0.12;
    const movement = frameCount * (0.08 + i * 0.01);

    stroke(114, 201, 202, 8);

    beginShape();

    for (let x = -100; x <= width + 100; x += 35) {
      const waveY = baseY + sin(x * 0.009 + movement * 0.02 + i) * 14;

      curveVertex(x, waveY);
    }

    endShape();
  }

  pop();
}

function updateAndDrawOceanParticles() {
  push();

  for (let particle of oceanParticles) {
    particle.y -= particle.speed;

    particle.x +=
      particle.drift + sin(frameCount * 0.015 + particle.phase) * 0.12;

    // Recycle particles after they reach the top
    if (
      particle.y < -particle.size - 10 ||
      particle.x < -30 ||
      particle.x > width + 30
    ) {
      const replacement = createOceanParticle(false);

      particle.x = replacement.x;
      particle.y = replacement.y;
      particle.size = replacement.size;
      particle.speed = replacement.speed;
      particle.drift = replacement.drift;
      particle.phase = replacement.phase;
      particle.bubble = replacement.bubble;
      particle.opacity = replacement.opacity;
    }

    if (particle.bubble) {
      // Bubble outline
      noFill();
      stroke(169, 237, 236, particle.opacity);
      strokeWeight(1.2);

      circle(particle.x, particle.y, particle.size);

      // Bubble highlight
      noStroke();
      fill(216, 251, 246, particle.opacity * 0.85);

      circle(
        particle.x - particle.size * 0.18,
        particle.y - particle.size * 0.18,
        Math.max(1.2, particle.size * 0.16),
      );
    } else {
      // Marine snow
      noStroke();
      fill(114, 201, 202, particle.opacity);

      circle(particle.x, particle.y, particle.size);
    }
  }

  pop();
}

function drawOceanForeground() {
  drawDepthFog();
  drawVignette();
}

function drawDepthFog() {
  const context = drawingContext;

  const fog = context.createLinearGradient(0, height * 0.58, 0, height);

  fog.addColorStop(0, "rgba(1, 13, 24, 0)");
  fog.addColorStop(1, "rgba(0, 7, 14, 0.3)");

  context.save();
  context.fillStyle = fog;
  context.fillRect(0, height * 0.58, width, height * 0.42);
  context.restore();
}

function drawVignette() {
  const context = drawingContext;

  const vignette = context.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.2,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.72,
  );

  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.65, "rgba(0, 10, 17, 0.04)");
  vignette.addColorStop(1, "rgba(0, 6, 12, 0.42)");

  context.save();
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function draw() {
  if (appState === "dialog" && pausedFrame) {
    image(pausedFrame, 0, 0, width, height);
    return;
  }

  if (!game || appState !== "playing") {
    drawOceanBackground();
    return;
  }

  if (game.getRunGame()) {
    if (game.getSubmarine().getLives() <= 0) {
      void gameOver();
    } else {
      drawOceanBackground();
      game.run();
      drawOceanForeground();
    }
  } else {
    if (pausedFrame) {
      image(pausedFrame, 0, 0, width, height);
    }

    push();

    noStroke();
    fill(1, 13, 24, 135);
    rect(0, 0, width, height);

    const panelWidth = Math.min(520, width - 40);
    const panelHeight = 215;
    const panelX = width / 2 - panelWidth / 2;
    const panelY = height / 2 - panelHeight / 2;

    drawingContext.shadowBlur = 28;
    drawingContext.shadowColor = "rgba(58, 166, 173, 0.35)";

    fill(2, 21, 33, 225);
    stroke(58, 166, 173, 210);
    strokeWeight(2);
    rect(panelX, panelY, panelWidth, panelHeight, 18);

    drawingContext.shadowBlur = 22;
    drawingContext.shadowColor = "rgba(104, 214, 219, 0.55)";

    noStroke();
    fill(227, 255, 250);
    textFont(wordFont);
    textAlign(CENTER, CENTER);
    textSize(Math.min(54, width * 0.1));
    text("PAUSED", width / 2, height / 2 - 25);

    drawingContext.shadowBlur = 0;

    pop();
  }
}
