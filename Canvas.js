import { Puck } from "./Pucks/Puck.js";
import { Wood } from "./Pucks/Wood.js";
import { Glass } from "./Pucks/Glass.js";
import { Utility } from "./Utility.js";
import { Vector } from "./Vector.js";
let movedParticle = null;
export  class Canvas {
  
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');  
      document.body.appendChild(this.canvas);
  
      this.canvas.width = 800;
      this.canvas.height = 800;
      this.setup();

      let isMousePressed = false;
      let lastMousePos = new Vector(0, 0);
      let mouseSpeed = new Vector(0, 0);

      this.canvas.addEventListener("mousedown", (e) => {
        const mousePos = new Vector(e.x, e.y);
        const nearestParticle = Utility.findNearest(mousePos, this.particles, this.canvas.width, this.canvas.height);
        nearestParticle.stop();
        isMousePressed = true;
        movedParticle = nearestParticle;
        movedParticle.pos = mousePos;
        console.log(nearestParticle);
      });

      this.canvas.addEventListener('mousemove', (e) => {
        const mousePos = new Vector(e.x, e.y);      
        if (isMousePressed) {
          movedParticle.pos = mousePos;
          mouseSpeed = new Vector((mousePos.x - lastMousePos.x), (mousePos.y - lastMousePos.y));
          lastMousePos = mousePos;
        }
      });
      
      this.canvas.addEventListener('mouseup', (e) => {
        isMousePressed = false;
        if (Math.abs(mouseSpeed.x) <= 1 || Math.abs(mouseSpeed.y) <= 1) {
          movedParticle.vel.x = 0;
          movedParticle.vel.y = 0;
        } else {
          movedParticle.vel = mouseSpeed;
        }
        movedParticle = null;
      });
  
      requestAnimationFrame(() => this.update());
    }

    setup() {
      const NUM_PARTICLES = 1;
      this.particles = [];
  
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const newParticle = new Puck(
          Utility.randomNumBetween(51, this.canvas.width - 51),
          Utility.randomNumBetween(51, this.canvas.height - 51)
        );      
        this.particles.push(newParticle);
      }
      /* this.particles.push(new Wood(
        Utility.randomNumBetween(51, this.canvas.width - 51),
        Utility.randomNumBetween(51, this.canvas.height - 51)
      )); */
      this.particles.push(new Glass(
        Utility.randomNumBetween(51, this.canvas.width - 51),
        Utility.randomNumBetween(51, this.canvas.height - 51)
      ));
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
        if(particle != movedParticle) {
          if (particle.isBreakable && particle.hitPoints == 0) {
            this.particles.pop(particle);
          }
          particle.update();
        }
        particle.handleEdges(this.canvas.width, this.canvas.height);
        
        /* if(particle.isOutOfBounds(this.canvas.width, this.canvas.height)) {
          this.particles.pop(particle);
          console.log(this.particles);
        } */

        
        this.ctx.beginPath();
        this.ctx.arc(
          particle.pos.x, 
          particle.pos.y,
          particle.radius,
          0, 
          2 * Math.PI
        );
        if (particle instanceof Glass) {
          this.ctx.strokeStyle = particle.fillStyle;
          this.ctx.lineWidth = particle.lineWidth;
          this.ctx.stroke();
        } else {
          this.ctx.fillStyle = particle.fillStyle;
          this.ctx.fill();
        }
      }
  
      requestAnimationFrame(() => this.update());
    }
  }
  