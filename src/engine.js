import kaplay from "kaplay";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay({
  global: false,
});
// debug.inspect = true;

k.loadRoot("./"); // A good idea for Itch.io publishing later

export default k;
