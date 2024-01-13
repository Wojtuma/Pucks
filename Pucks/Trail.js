import { Vector } from "../Vector.js";

export class Trail {
	constructor(x, y, radius) {
		this.pos = new Vector(x, y);
        this.radius = radius * 0.99;

		this.isFlamable = true;
		this.fillStyle = `rgba(193, 214, 77, 1)`;
	}
}