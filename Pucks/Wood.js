import { Puck } from "./Puck";
import { Vector } from "../Vector.js";

export class Wood extends Puck{
    constructor(x, y) {
      this.MAX_VELOCITY = 3;
    }

    checkCollision(particle) {
        const v = Vector.sub(this.pos, particle.pos)
        const dist = v.mag();
    
        if (dist <= this.radius + particle.radius) {
          console.log("COLLISION");
        }
    }
}