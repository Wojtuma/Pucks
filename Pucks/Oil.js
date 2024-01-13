import { Vector } from "../Vector.js";
import { Puck } from "./Puck.js";

export class Oil extends Puck {
	constructor(x, y) {
		super(x, y);
		this.isFlamable = true;
		
		this.fillStyle = `rgba(142, 176, 39, 1)`;
	}

	update() {
		super.update();
		this.acc.x = Math.sign(this.vel.x) * (-0.01);
		this.acc.y = Math.sign(this.vel.y) * (-0.01);
		this.vel = Vector.add(this.vel, this.acc);
		this.acc = Vector.mult(this.acc, 0);
	}

	checkCollision(particle) {
		const v = Vector.sub(this.pos, particle.pos)
		const dist = v.mag();
		if (dist <= this.radius + particle.radius) {
			super.checkCollision(particle);
		}
	}
}