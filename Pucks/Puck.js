import { Vector } from "../Vector.js";
import { Utility } from "../Utility.js";

export class Puck {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = Vector.random(-1, 1, -1, 1);
    this.acc = new Vector(0, 0);
    this.radius = Math.floor(Utility.randomNumBetween(5, 50));
    this.MAX_VELOCITY = 5;

    this.isFlamable = false;
    this.isBreakable = false;

    this.fillStyle = `rgba(255, 255, 255, 1)`;
  }

  update(isAccelerating) {
    if (this.vel.x > this.MAX_VELOCITY) {
      this.vel.x = this.MAX_VELOCITY;
    }
    if (this.vel.y > this.MAX_VELOCITY) {
      this.vel.y = this.MAX_VELOCITY;
    }
    if(isAccelerating) {
    this.acc.x = Math.sign(this.vel.x) * (0.05);
		this.acc.y = Math.sign(this.vel.y) * (0.05);
    }
    this.pos = Vector.add(this.pos, this.vel);
    this.vel = Vector.add(this.vel, this.acc);
    this.acc = Vector.mult(this.acc, 0);
  }

  handleEdges(width, height) {
    if (this.pos.x - this.radius <= 0 || this.pos.x + this.radius >= width) {
      this.vel.x = -this.vel.x;
    } else if (this.pos.y - this.radius <= 0 || this.pos.y + this.radius >= height) {
      this.vel.y = -this.vel.y;
    }
  }

  isOutOfBounds(width, height) {
    if (this.pos.x - this.radius < 0 - (this.radius * 0.5)) {
      this.vel.x = 1;
    } else if (this.pos.x + this.radius > width + (this.radius * 0.5)) {
      this.vel.x = -1;
    } else if (this.pos.y - this.radius < 0 - (this.radius * 0.5)) {
      this.vel.y = 1;
    } else if (this.pos.y + this.radius > height + (this.radius * 0.5)) {
      this.vel.y = -1;
    }
  }

  checkCollision(particle) {
    const v = Vector.sub(this.pos, particle.pos)
    const dist = v.mag();

    if (dist <= this.radius + particle.radius) {
      console.log("COLLISION");
      const unitNormal = Vector.div(v, v.mag());
      const unitTangent = unitNormal.getTangent();

      const correction = Vector.mult(unitNormal, this.radius + particle.radius);
      const newV = Vector.add(particle.pos, correction);
      this.pos = newV;

      const a = this.vel;
      const b = particle.vel;

      const a_n = a.dot(unitNormal);
      const b_n = b.dot(unitNormal);
      const a_t = a.dot(unitTangent);
      const b_t = b.dot(unitTangent);

      const a_n_final = (a_n * (this.radius - particle.radius) +
        2 * particle.radius*b_n) / (this.radius + particle.radius);
      const b_n_final = (b_n * (particle.radius - this.radius) + 
        2 * this.radius * a_n) / (this.radius + particle.radius);

      const a_n_after = Vector.mult(unitNormal, a_n_final);
      const b_n_after = Vector.mult(unitNormal, b_n_final);
      const a_t_after = Vector.mult(unitTangent, a_t);
      const b_t_after = Vector.mult(unitTangent, b_t);

      const a_after = Vector.add(a_n_after, a_t_after);
      const b_after = Vector.add(b_n_after, b_t_after);

      this.vel = a_after;
      particle.vel = b_after;
    }
  }

  stop() {
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
  }
}