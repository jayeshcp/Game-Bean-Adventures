import k from "../engine.js";
import { GAME_OBJECTS, LEVELS } from "./LEVELS.js";
import {
  FALL_DATH_THRESHOLD,
  GRAVITY,
  LEVELS_BACKGROUND_COLOR,
  PLAYER_JUMP_FORCE,
  PLAYER_MOVE_SPEED,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "../constants.js";
import { ghostPatrol } from "../utils.js";

k.setGravity(GRAVITY);

export default async function game({ levelIdx, score }) {
  k.setBackground(LEVELS_BACKGROUND_COLOR);
  const levelStartScore = score; // snapshot value of score to use when restarting level after lose

  // Use the level passed, or first level
  const level = k.addLevel(LEVELS[levelIdx || 0], {
    tileWidth: TILE_WIDTH,
    tileHeight: TILE_HEIGHT,
    pos: k.vec2(100, 200),
    tiles: {
      [GAME_OBJECTS.PLAYER]: () => [
        k.sprite("bean"),
        k.area(),
        k.body(),
        k.anchor("bot"),
        "player",
        {
          MOVE_SPEED: PLAYER_MOVE_SPEED,
          JUMP_FORCE: PLAYER_JUMP_FORCE,
        },
      ],
      [GAME_OBJECTS.GHOSTY]: () => [
        k.sprite("ghosty"),
        k.scale(0.8),
        k.area(),
        k.body({ isStatic: true }),
        ghostPatrol(),
        k.anchor("bot"),
        "enemy",
      ],
      [GAME_OBJECTS.PLATFORM]: () => [
        k.sprite("grass"),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("bot"),
        "platform",
      ],
      [GAME_OBJECTS.COIN]: () => [
        k.sprite("coin"),
        k.area(),
        k.anchor("bot"),
        "coin",
      ],
      [GAME_OBJECTS.SPIKE]: () => [
        k.sprite("spike"),
        k.area(),
        k.anchor("bot"),
        "danger",
      ],
      [GAME_OBJECTS.PORTAL]: () => [
        k.sprite("portal"),
        k.area(),
        k.anchor("bot"),
        "portal",
      ],
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

  player.onBeforePhysicsResolve((collision) => {
    if (collision.target.is(["platform", "soft"]) && player.isJumping()) {
      collision.preventResolution();
    }
  });

  player.onGround((objectBelow) => {
    if (objectBelow.is("enemy")) {
      player.jump(player.JUMP_FORCE * 1.5);
      k.destroy(objectBelow);
      k.addKaboom(player.pos);
      k.play("powerup");
    }
  });

  // Movements
  k.onButtonDown("moveLeft", () => {
    player.flipX = true;
    player.move(-player.MOVE_SPEED, 0);
  });

  k.onButtonDown("moveRight", () => {
    player.flipX = false;
    player.move(player.MOVE_SPEED, 0);
  });

  k.onButtonDown("jump", () => {
    if (player.isGrounded()) {
      player.jump(player.JUMP_FORCE);
    }
  });

  k.onKeyPress("f", () => {
    k.setFullscreen(!k.isFullscreen());
  });

  player.onCollide("danger", () => {
    k.play("hit");
    // Go to "lose" scene when we hit a "danger"
    k.go("lose", { levelIdx, levelStartScore });
  });

  player.onCollide("enemy", (e, otherObject) => {
    // if it is not from the top, die
    if (!otherObject?.isBottom()) {
      k.play("hit");
      // Go to "lose" scene when we hit a "enemy"
      k.go("lose", { levelIdx, levelStartScore });
    }
  });

  player.onCollide("coin", (coin) => {
    k.destroy(coin);
    k.play("score");
    increaseScore();
  });

  // Fall death
  player.onUpdate(() => {
    if (player.pos.y >= FALL_DATH_THRESHOLD) {
      k.play("hit");
      k.go("lose", { levelIdx, levelStartScore });
    }
  });

  // Enter the next level on portal
  player.onCollide("portal", () => {
    k.play("bell");
    if (levelIdx < LEVELS.length - 1) {
      // If there's a next level, go() to the same scene but load the next level
      k.go("game", {
        levelIdx: levelIdx + 1,
        score,
      });
    } else {
      // Otherwise we have reached the end of game, go to "win" scene!
      k.go("win", { score: score });
    }
  });
}
