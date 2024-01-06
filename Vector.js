function randomNumBetween(min, max) {
    return min + Math.random() * (max - min);
}

export class Vector {
	constructor(x, y) {
	  this.x = x;
	  this.y = y;
	}
	static add(vector1, vector2) {
	  return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
	}
	static mult(vector, scalar) {
	  return new Vector(vector.x * scalar, vector.y * scalar);
	}
	static div(vector, scalar) {
	  return new Vector(vector.x / scalar, vector.y / scalar);
	}
	static sub(vector1, vector2) {
	  return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
	}
	dot(vector) {
	  return this.x * vector.x + this.y * vector.y;
	}
	getTangent() {
	  return new Vector(-this.y, this.x);
	}
	mag() {
	  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
	copy() {
	  return new Vector(this.x, this.y);
	}
	static random(minX, maxX, minY, maxY) {
	  return new Vector(
		randomNumBetween(minX, maxX),
		randomNumBetween(minY, maxY)
	  );
	}
  }