import k from "../engine.js";

export default async function win({ score }) {
  k.setBackground([40, 60, 40]);
  k.add([
    k.text(`You grabbed ${score} coins!!!`, {
      size: 56,
      width: k.width(),
    }),
    k.pos(50, 120),
    k.layer("ui"),
  ]);

  let maxScore = k.getData("maxScore", 0);
  k.add([
    k.text(`Max Score: ${maxScore}`, { size: 18 }),
    k.pos(50, 200),
    k.layer("ui"),
  ]);

  k.onKeyPress(() => {
    k.go("game", {
        levelIdx: 0,
        score: 0,
    });
  });
}
