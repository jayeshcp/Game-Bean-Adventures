import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay({
  global: false,
  buttons: {
    jump: {
      keyboard: ["space", "up", "w"],
      gamepad: ["dpad-up"],
    },
    moveLeft: {
      keyboard: ["left", "a"],
      gamepad: ["dpad-left"],
    },
    moveRight: {
      keyboard: ["right", "d"],
      gamepad: ["dpad-right"],
    },
  },
});
// debug.inspect = true;

k.loadRoot("./"); // A good idea for Itch.io publishing later

export default k;
