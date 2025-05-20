// Animated skill bars
document.addEventListener('DOMContentLoaded', function() {
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Function to animate skill bars when they come into view
  function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
      if (isInViewport(bar) && !bar.classList.contains('animated')) {
        // Get the target width from the parent's data attribute or style
        const targetWidth = bar.style.width;
        
        // Reset width to 0 first
        bar.style.width = '0%';
        
        // Add animated class to prevent re-animation
        bar.classList.add('animated');
        
        // Animate to target width
        setTimeout(() => {
          bar.style.transition = 'width 1.5s ease-in-out';
          bar.style.width = targetWidth;
        }, 200);
      }
    });
  }
  
  // Initial check and add scroll listener
  animateSkillBars();
  window.addEventListener('scroll', animateSkillBars);
});

// Project cards scroll animations
document.addEventListener('DOMContentLoaded', function() {
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Function to animate project cards when they come into view
  function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
      if (isInViewport(card) && !card.classList.contains('animated')) {
        // Add animated class to prevent re-animation
        card.classList.add('animated');
        
        // Apply animation with delay based on index
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100 * index); // Staggered delay
      }
    });
  }
  
  // Initial check and add scroll listener
  animateProjectCards();
  window.addEventListener('scroll', animateProjectCards);
});

// Contact section icon animations
document.addEventListener('DOMContentLoaded', function() {
  const contactIcons = document.querySelectorAll('.contact-icon');
  
  contactIcons.forEach((icon, index) => {
    // Add initial styles
    icon.style.opacity = '0';
    icon.style.transform = 'scale(0.8)';
    
    // Animate with delay
    setTimeout(() => {
      icon.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      icon.style.opacity = '1';
      icon.style.transform = 'scale(1)';
      
      // Add pulse effect
      icon.classList.add('pulse-effect');
    }, 300 * index);
  });
  
  // Add CSS for pulse effect
  const style = document.createElement('style');
  style.textContent = `
    .pulse-effect {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
});
