import k from "../engine.js";
import { LEVELS } from "./LEVELS.js";

k.setGravity(2400);

const SPEED = 480;

export default async function game({ levelIdx, score }) {
  k.setBackground("#2E8BC0");

  // Use the level passed, or first level
  const level = k.addLevel(LEVELS[levelIdx || 0], {
    tileWidth: 64,
    tileHeight: 64,
    pos: k.vec2(100, 200),
    tiles: {
      "@": () => [
        k.sprite("bean"),
        k.area(),
        k.body(),
        k.anchor("bot"),
        "player",
      ],
      "#": () => [
        k.sprite("ghosty"),
        k.scale(0.8),
        k.area(),
        k.body({ isStatic: true }),
        k.patrol({
          speed: 120,
          endBehavior: "loop",
        }),
        k.anchor("bot"),
        "danger",
        "ghosty",
      ],
      "=": () => [
        k.sprite("grass"),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("bot"),
      ],
      $: () => [k.sprite("coin"), k.area(), k.anchor("bot"), "coin"],
      "^": () => [k.sprite("spike"), k.area(), k.anchor("bot"), "danger"],
      ">": () => [k.sprite("portal"), k.area(), k.anchor("bot"), "portal"],
    },
  });

  // Score counter text
  const scoreLabel = k.add([
    k.text(`Score: ${score}`, { size: 36 }),
    k.pos(50, 50),
    k.layer("ui"),
    k.fixed(),
  ]);

  let maxScore = k.getData("maxScore", 0) || 0;
  const maxScoreLabel = k.add([
    k.text(`Max Score: ${maxScore}`, { size: 18 }),
    k.pos(50, 100),
    k.layer("ui"),
    k.fixed(),
  ]);

  function increaseScore(increment = 1) {
    score += increment;
    scoreLabel.text = `Score: ${score}`;

    // update max score
    maxScore = k.getData("maxScore", 0);
    if (score > maxScore) {
      maxScore = score;
      k.setData("maxScore", maxScore);
      maxScoreLabel.text = `Max Score: ${maxScore}`;
    }
  }

  // Get the player object from tag
  const player = level.get("player")[0];
  player.pos = level.tile2Pos(0, 0);
  player.onUpdate(() => {
    k.setCamPos(player.worldPos());
  });

  const ghosty = level.get("ghosty")[0];
  if (ghosty) {
    if (levelIdx != 3) {
      ghosty.waypoints = [
        k.vec2(ghosty.pos.x - 140, ghosty.pos.y),
        k.vec2(ghosty.pos.x + 80, ghosty.pos.y),
      ];
    } else {
      ghosty.waypoints = [
        k.vec2(ghosty.pos.x - 240, ghosty.pos.y),
        k.vec2(ghosty.pos.x + 10, ghosty.pos.y),
      ];
    }
  }

  // Movements
  k.onButtonDown("moveLeft", () => {
    player.move(-SPEED, 0);
  });

  k.onButtonDown("moveRight", () => {
    player.move(SPEED, 0);
  });

  k.onButtonDown("jump", () => {
    if (player.isGrounded()) {
      player.jump(800);
    }
  });

  player.onCollide("danger", () => {
    k.play("hit");
    // Go to "lose" scene when we hit a "danger"
    k.go("lose");
  });

  player.onCollide("coin", (coin) => {
    k.destroy(coin);
    k.play("score");
    increaseScore();
  });

  // Fall death
  player.onUpdate(() => {
    if (player.pos.y >= 2000) {
      k.play("hit");
      k.go("lose");
    }
  });

  // Enter the next level on portal
  player.onCollide("portal", () => {
    k.play("bell");
    if (levelIdx < LEVELS.length - 1) {
      // If there's a next level, go() to the same scene but load the next level
      k.go("game", {
        levelIdx: levelIdx + 1,
        score: score,
      });
    } else {
      // Otherwise we have reached the end of game, go to "win" scene!
      k.go("win", { score: score });
    }
  });
}
