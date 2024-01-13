import { Vector } from "../Vector.js";
import { Puck } from "./Puck.js";

export class Glass extends Puck{
  constructor(x, y) {
    super(x, y);
    this.isBreakable = true;
    this.hitPoints = Math.round(this.radius / 10);

    this.lineWidth = 5;
    this.fillStyle = `rgba(255, 255, 255, 0.8)`;
  }

  checkCollision(particle) {
    const v = Vector.sub(this.pos, particle.pos)
    const dist = v.mag();
    if (dist <= this.radius + particle.radius) {
      super.checkCollision(particle);
      this.hitPoints -= 1;
      console.log(this.hitPoints);
    }
  }
}