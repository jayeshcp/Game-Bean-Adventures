import k from "../engine.js";

export default async function splash() {
  k.setBackground("#FADCD9");

  k.add([
    k.text("Bean Adventures", { size: 48, align: "center" }),
    k.pos(200, 200),
    k.color(120, 120, 40),
    k.layer("ui"),
    k.scale(1)
  ]);

  k.add([
    k.text("Press any key or click to start", { size: 36, align: "center" }),
    k.pos(200, 300),
    k.color(80, 80, 80),
    k.layer("ui"),
    k.scale(1)
  ]);

  async function goToGame() {
    await k.wait(0.8);
    k.go("game");
  }

  k.onClick(async () => {
    k.addKaboom(k.mousePos());
    goToGame();
  });

  k.onKeyPress(async () => {
    k.addKaboom(k.vec2(200, 200));
    goToGame();
  });
}