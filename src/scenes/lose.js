import k from "../engine.js";

export default async function lose() {
  gtag("event", "lose", {
    event_category: "game",
    event_label: "lose",
  });

  k.setBackground([90, 40, 40]);

  k.add([k.text("You Lose! 👻", { size: 56 }), k.pos(40, 120)]);

  // Press any key to go back
  k.onKeyPress(() => {
    k.go("game", {
        levelIdx: 0,
        score: 0,
    });
  });
}
