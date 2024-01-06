import { Puck } from "./Pucks/Puck.js";
import { Utility } from "./Utility.js";
import { Vector } from "./Vector.js";

function randomNumBetween(min, max) {
    return min + Math.random() * (max - min);
}
  
export  class Canvas {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');  
      document.body.appendChild(this.canvas);
  
      this.canvas.width = 800;
      this.canvas.height = 800;
      this.setup();

      
      let movedParticle = null;
      let isMousePressed = false;
      let lastMousePos = new Vector(0, 0);
      let lastTimestamp;
      let totalDistance = 0;
      let speed = 0;
      let speedVector = new Vector(0, 0);

      this.canvas.addEventListener("mousedown", (e) => {
        const mousePos = new Vector(e.x, e.y);
        const nearestParticle = Utility.findNearest(mousePos, this.particles, this.canvas.width, this.canvas.height);
        nearestParticle.stop();
        isMousePressed = true;
        movedParticle = nearestParticle;
        console.log(nearestParticle);
      });

      this.canvas.addEventListener('mousemove', (e) => {
        const mousePos = new Vector(e.x, e.y);      
        if (isMousePressed) {
          movedParticle.pos = mousePos;
          speedVector = new Vector((mousePos.x - lastMousePos.x), (mousePos.y - lastMousePos.y));
          lastMousePos = mousePos;
        }
      });

      this.canvas.addEventListener('mouseup', (e) => {
        isMousePressed = false;
        console.log(movedParticle);
        movedParticle.vel = speedVector;
      });
  
      requestAnimationFrame(() => this.update());
    }

    setup() {
      const NUM_PARTICLES = 10;
      this.particles = [];
  
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const newParticle = new Puck(
          randomNumBetween(0, this.canvas.width),
          randomNumBetween(0, this.canvas.height),
        );      
        this.particles.push(newParticle);
      }
    }

    update() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.particles.length; i++) {
        const current = this.particles[i];
        const rest = this.particles.slice(i + 1);

        for(let p of rest) {
          p.checkCollision(current);
          
        }
      }
      for (let particle of this.particles) {
        let intervalId;
        particle.update();
        intervalId = setInterval(particle.handleEdges(this.canvas.width, this.canvas.height), 5000);
        
        /* if(particle.isOutOfBounds(this.canvas.width, this.canvas.height)) {
          this.particles.pop(particle);
          console.log(this.particles);
        } */

        this.ctx.fillStyle = `rgba(255, 255, 255, 1)`;
        this.ctx.beginPath();
        this.ctx.arc(
          particle.pos.x, 
          particle.pos.y,
          particle.radius,
          0, 
          2 * Math.PI
        );
        this.ctx.fill();
      }
  
      requestAnimationFrame(() => this.update());
    }
  }
  