import k from "../engine.js";

export default async function game() {
  k.setBackground("#FADCD9");

  k.add([
    k.sprite("bean"),
    k.pos(100, 100),
    k.scale(2),
    k.layer("obj"),
    k.anchor("top"),
    k.area(),
    k.body(),
  ]);

  
}