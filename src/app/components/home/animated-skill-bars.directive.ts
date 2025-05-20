import { Directive, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAnimatedSkillBars]',
  standalone: true
})
export class AnimatedSkillBarsDirective implements AfterViewInit, OnDestroy {
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
    const skillBars = this.el.nativeElement.querySelectorAll('.skill-progress');
    
    if (!skillBars.length) return;
    
    // Create intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          const bar = entry.target as HTMLElement;
      const computedWidth = getComputedStyle(bar).width;

this.renderer.setStyle(bar, 'width', '0px'); // reset
this.renderer.addClass(bar, 'animated');

setTimeout(() => {
  this.renderer.setStyle(bar, 'transition', 'width 1.5s ease-in-out');
  this.renderer.setStyle(bar, 'width', computedWidth);
}, 200);

        }
      });
    }, { threshold: 0.1 });
    
    // Observe each skill bar
skillBars.forEach((bar: Element) => {
  this.observer?.observe(bar);
});

  }
}
