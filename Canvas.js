import { Puck } from "./Pucks/Puck.js";
import { Wood } from "./Pucks/Wood.js";
import { Glass } from "./Pucks/Glass.js";
import { Oil } from "./Pucks/Oil.js";
import { Trail } from "./Pucks/Trail.js";
import { Utility } from "./Utility.js";
import { Vector } from "./Vector.js";

let movedParticle = null;
export class Canvas {

	constructor() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		document.body.appendChild(this.canvas);

		this.canvas.width = 800;
		this.canvas.height = 800;
		this.setup();

		let mousePos = new Vector(0, 0);
		let lastMousePos = new Vector(0, 0);
		let isMousePressed = false;
		let mouseSpeed = new Vector(0, 0);
		let nearestParticle = null;

		this.canvas.addEventListener('mousedown', (e) => {
			mousePos = new Vector(e.x, e.y);
			nearestParticle = Utility.findNearest(mousePos, this.particles, this.canvas.width, this.canvas.height);
			if (nearestParticle != null) {
				nearestParticle.stop();
			}
			isMousePressed = true;
			movedParticle = nearestParticle;
		});

		this.canvas.addEventListener('mousemove', (e) => {
			mousePos = new Vector(e.x, e.y);
			if (isMousePressed && movedParticle != null) {
				movedParticle.pos = mousePos;
				mouseSpeed = new Vector((mousePos.x - lastMousePos.x), (mousePos.y - lastMousePos.y));
				lastMousePos = mousePos;
			}
		});

		this.canvas.addEventListener('mouseup', (e) => {
			isMousePressed = false;
			if (movedParticle != null) {
				if (Math.abs(mouseSpeed.x) <= 0.5 || Math.abs(mouseSpeed.y) <= 0.5) {
					movedParticle.vel.x = 0;
					movedParticle.vel.y = 0;
				} else {
					movedParticle.vel = mouseSpeed;
				}
				movedParticle = null;
				nearestParticle = null;
			}
		});

		requestAnimationFrame(() => this.update());
	}

	setup() {
		const NUM_PARTICLES = 1;
		this.particles = [];
		this.oilMatrix = [];

		for (let i = 0; i < NUM_PARTICLES; i++) {
			const newParticle = new Puck(
				Utility.randomNumBetween(51, this.canvas.width - 51),
				Utility.randomNumBetween(51, this.canvas.height - 51)
			);
			this.particles.push(newParticle);
		}
		this.particles.push(new Oil(
			Utility.randomNumBetween(51, this.canvas.width - 51),
			Utility.randomNumBetween(51, this.canvas.height - 51)
		));
	}

	update() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		let isAccelerating = false;
		// Checking particle collisions
		for (let i = 0; i < this.particles.length; i++) {
			const current = this.particles[i];
			const rest = this.particles.slice(i + 1);

			for (let p of rest) {
				p.checkCollision(current);
			}
		}
		
		// Drawing particle trails
		for (let element of this.oilMatrix) {
			Utility.drawCircle(this.ctx, element, false);
		}

		// Iterating trough all particles
		for (let particle of this.particles) {
			if (particle instanceof Oil) {
				let particleTrail = new Trail(
									Math.round(particle.pos.x),
									Math.round(particle.pos.y),
									particle.radius);
				if (this.oilMatrix.indexOf(particleTrail) === -1) {
					this.oilMatrix.push(particleTrail);
				}
			} else {
				const pixel = this.ctx.getImageData(particle.pos.x, particle.pos.y, 1, 1);
				const data = pixel.data;
				if (data[0] != 0 || data[1] != 0 || data[2] != 0 || data[3] != 0) {
					isAccelerating = true;
				}
			}

			// Check if particle is being held by mouse, if not, update
			if (particle != movedParticle) {
				if (particle.isBreakable && particle.hitPoints <= 0) {
					this.particles.pop(particle);
				}
				particle.update(isAccelerating);
			}
			particle.handleEdges(this.canvas.width, this.canvas.height);
			
			// Drawing particles
			Utility.drawCircle(this.ctx, particle, particle instanceof Glass);
		}		

		requestAnimationFrame(() => this.update());
	}
}
