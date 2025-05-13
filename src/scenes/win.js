import k from "../engine.js";

export default async function win({ score}) {
  k.setBackground([40, 60, 40]);
  k.add([
    k.text(`You grabbed ${score} coins!!!`, {
      width: k.width(),
    }),
    k.pos(20, 120),
  ]);

  k.onKeyPress(() => {
    k.go("game", {
        levelIdx: 0,
        score: 0,
    });
  });
}
