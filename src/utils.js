export function ghostPatrol(speed = 120, dir = 1) {
  return {
    id: "patrol",
    require: ["pos", "area"],
    add() {
      this.on("collide", (obj, col) => {
        if (col.isLeft()) {
          dir = 1;
        } else if (col.isRight()) {
          dir = -1;
        }
      });
    },
    update() {
      this.move(speed * dir, 0);
    },
  };
}
