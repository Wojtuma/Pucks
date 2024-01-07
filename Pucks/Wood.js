import { Vector } from "../Vector.js";
import { Puck } from "./Puck.js";

export class Wood extends Puck{
  constructor(x, y) {
    super(x, y);
    this.MAX_VELOCITY = 3;
    this.fillStyle = `rgba(139,69,19)`;
  }

  update() {
    super.update();
    this.acc.x = Math.sign(this.vel.x) * (-0.01);
    this.acc.y = Math.sign(this.vel.y) * (-0.01);
    this.vel = Vector.add(this.vel, this.acc);
    this.acc = Vector.mult(this.acc, 0);
  }

  checkCollision(particle) {
    super.checkCollision(particle);
    particle.vel = Vector.add(particle.vel, Vector.mult(this.acc, 100));
  }
}
