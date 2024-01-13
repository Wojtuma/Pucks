export class Utility {
	static randomNumBetween(min, max) {
		return min + Math.random() * (max - min);
	}

	static findNearest(mousePos, particles, width, height) {
		let nearestParticle = null;
		let nearestDistance = Math.hypot(width, height);

		particles.forEach(particle => {
			let distance = this.calculateDistance(mousePos, particle.pos);
			if (distance < nearestDistance && this.isMouseOnParticle(mousePos, particle)) {
				nearestDistance = distance;
				nearestParticle = particle;
			}
		});
		if(nearestParticle == null) {
			console.log("No particle nearby");
			return null;
		} else {
				return nearestParticle;
		}
	}

	static isMouseOnParticle(mousePos, particle) {
		if ((mousePos.x >= particle.pos.x - (particle.radius * 1.5) &&
			mousePos.x <= particle.pos.x + (particle.radius * 1.5)) &&
			(mousePos.y >= particle.pos.y - (particle.radius * 1.5) &&
				mousePos.y <= particle.pos.y + (particle.radius * 1.5))
		) {
			return true;
		} else {
			return false;
		}
	}

	static calculateDistance(point1, point2) {
		const dx = point1.x - point2.x;
		const dy = point1.y - point2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	static drawCircle(context, particle, isGlass) {
		context.beginPath();
		context.arc(
			particle.pos.x,
			particle.pos.y,
			particle.radius,
			0,
			2 * Math.PI
		);
		if (isGlass) {
			context.strokeStyle = particle.fillStyle;
			context.lineWidth = particle.lineWidth;
			context.stroke();
		} else {
			context.fillStyle = particle.fillStyle;
			context.fill();
		}
	}
}