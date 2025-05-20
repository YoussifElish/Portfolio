// Particles animation for hero section
document.addEventListener('DOMContentLoaded', function() {
  const heroSection = document.getElementById('home');
  if (!heroSection) return;
  
  const heroBackground = heroSection.querySelector('.hero-background');
  if (!heroBackground) return;
  
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '1';
  canvas.style.opacity = '0.7';
  heroBackground.appendChild(canvas);
  
  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = heroBackground.offsetWidth;
    canvas.height = heroBackground.offsetHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Get canvas context
  const ctx = canvas.getContext('2d');
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      
      // Colors based on site theme
      const colors = ['#6200EE', '#03DAC6', '#B794F6', '#7EFCE0'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Bounce off edges
      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Create particles
  const particles = [];
  const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Draw connections between particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(98, 0, 238, ${0.2 - distance/500})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    drawConnections();
    requestAnimationFrame(animate);
  }
  
  animate();
});
