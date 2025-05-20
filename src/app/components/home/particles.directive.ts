import { Directive, ElementRef, OnInit, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appParticles]',
  standalone: true
})
export class ParticlesDirective implements AfterViewInit, OnDestroy {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private particles: Particle[] = [];
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  ngAfterViewInit(): void {
    // Only run in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.initParticles();
    }
  }
  
  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  
  private initParticles(): void {
    // Create canvas element
    this.canvas = this.renderer.createElement('canvas');
    
    // Set canvas styles
    this.renderer.setStyle(this.canvas, 'position', 'absolute');
    this.renderer.setStyle(this.canvas, 'top', '0');
    this.renderer.setStyle(this.canvas, 'left', '0');
    this.renderer.setStyle(this.canvas, 'width', '100%');
    this.renderer.setStyle(this.canvas, 'height', '100%');
    this.renderer.setStyle(this.canvas, 'z-index', '1');
    this.renderer.setStyle(this.canvas, 'opacity', '0.7');
    
    // Append canvas to element
    this.renderer.appendChild(this.el.nativeElement, this.canvas);
    
    // Set canvas size
    this.resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    
    // Get canvas context
    this.ctx = this.canvas!.getContext('2d');
    
    if (!this.ctx) return;
    
    // Create particles
    const particleCount = Math.min(100, Math.floor((this.canvas!.width * this.canvas!.height) / 10000));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.canvas!.width, this.canvas!.height));
    }
    
    // Start animation
    this.animate();
  }
  
  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    this.canvas.width = this.el.nativeElement.offsetWidth;
    this.canvas.height = this.el.nativeElement.offsetHeight;
  }
  
  private animate(): void {
    if (!this.ctx || !this.canvas) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.canvas.width, this.canvas.height);
      this.particles[i].draw(this.ctx);
    }
    
    // Draw connections
    this.drawConnections();
    
    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }
  
  private drawConnections(): void {
    if (!this.ctx) return;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(98, 0, 238, ${0.2 - distance/500})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    
    // Colors based on site theme
    const colors = ['#6200EE', '#03DAC6', '#B794F6', '#7EFCE0'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  
  update(canvasWidth: number, canvasHeight: number): void {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Bounce off edges
    if (this.x > canvasWidth || this.x < 0) {
      this.speedX = -this.speedX;
    }
    
    if (this.y > canvasHeight || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }
  
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
