import k from "../engine.js";

setGravity(2400);

const SPEED = 480;

// Design levels
const LEVELS = [
  [
    "@     $ $    $  $     $$     $",
    "       ===    =====    ==   ==",
    "     = $     =       $= $  == ",
    "   ^ $$        ^       $     >",
    "=========   ====== === =  ===="
  ],
  [
    "@   $        ",
    "    $ $      ",
    "    $    #  >",
    "=   =  ==== ="
  ],
];

export default async function game({ levelIdx, score }) {
  k.setBackground("#2E8BC0");

  // Use the level passed, or first level
  const level = k.addLevel(LEVELS[levelIdx || 0], {
    tileWidth: 64,
    tileHeight: 64,
    pos: k.vec2(100, 200),
    tiles: {
      "@": () => [k.sprite("bean"), k.area(), k.body(), k.anchor("bot"), "player"],
      "#": () => [k.sprite("ghosty"), k.scale(0.8), k.area(), k.body({ isStatic: true }), k.anchor("bot"), "danger"],
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

  // Get the player object from tag
  const player = level.get("player")[0];
  player.pos = level.tile2Pos(0, 0);
  player.onUpdate(() => {
    k.setCamPos(player.pos);
  });

  // Movements
  k.onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump(800);
    }
  });

  k.onKeyDown("left", () => {
    player.move(-SPEED, 0);
  });

  k.onKeyDown("right", () => {
    player.move(SPEED, 0);
  });

  player.onCollide("danger", () => {
    k.play("hit");
    // Go to "lose" scene when we hit a "danger"
    k.go("lose");
  });

  player.onCollide("coin", (coin) => {
    k.destroy(coin);
    k.play("score");
    score++;
    scoreLabel.text = `Score: ${score}`;
  });

  // Fall death
  player.onUpdate(() => {
    if (player.pos.y >= 480) {
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

  // Score counter text
  const scoreLabel = k.add([k.text(`Score: ${score}`), k.pos(12)]);
}
