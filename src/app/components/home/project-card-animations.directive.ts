import { Directive, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appProjectCardAnimations]',
  standalone: true
})
export class ProjectCardAnimationsDirective implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  ngAfterViewInit(): void {
    // Only run in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.initAnimations();
    }
  }
  
  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  
  private initAnimations(): void {
    const projectCards = this.el.nativeElement.querySelectorAll('.project-card');
    
    if (!projectCards.length) return;
    
    // Create intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          const card = entry.target as HTMLElement;
          
          // Add animated class to prevent re-animation
          this.renderer.addClass(card, 'animated');
          
          // Apply animation with delay based on index
          this.renderer.setStyle(card, 'opacity', '0');
          this.renderer.setStyle(card, 'transform', 'translateY(30px)');
          
          setTimeout(() => {
            this.renderer.setStyle(card, 'transition', 'opacity 0.5s ease, transform 0.5s ease');
            this.renderer.setStyle(card, 'opacity', '1');
            this.renderer.setStyle(card, 'transform', 'translateY(0)');
          }, 100 * index); // Staggered delay
        }
      });
    }, { threshold: 0.1 });
    
    // Observe each project card
   projectCards.forEach((card: Element) => {
  this.observer?.observe(card);
});

  }
}
