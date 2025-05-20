import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appContactIconAnimations]',
  standalone: true
})
export class ContactIconAnimationsDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  ngAfterViewInit(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }
  
  private initAnimations(): void {
    const contactIcons = this.el.nativeElement.querySelectorAll('.contact-icon');
    
    if (!contactIcons || contactIcons.length === 0) {
      console.warn('No contact icons found');
      return;
    }
    
    // Add CSS for pulse effect
    this.addPulseEffectStyles();
    
    // Animate each icon with delay - تحويل NodeList إلى مصفوفة
    Array.from(contactIcons).forEach((icon, index) => {
      // تحويل صريح لنوع HTMLElement
      const iconElement = icon as HTMLElement;
      
      // Add initial styles
      this.renderer.setStyle(iconElement, 'opacity', '0');
      this.renderer.setStyle(iconElement, 'transform', 'scale(0.8)');
      
      // Animate with delay
      setTimeout(() => {
        this.renderer.setStyle(iconElement, 'transition', 'opacity 0.5s ease, transform 0.5s ease');
        this.renderer.setStyle(iconElement, 'opacity', '1');
        this.renderer.setStyle(iconElement, 'transform', 'scale(1)');
        
        // Add pulse effect
        this.renderer.addClass(iconElement, 'pulse-effect');
      }, 300 * index);
    });
  }
  
  private addPulseEffectStyles(): void {
    // Create style element if it doesn't exist
    const styleId = 'contact-icon-animations-style';
    if (!document.getElementById(styleId)) {
      const style = this.renderer.createElement('style');
      this.renderer.setAttribute(style, 'id', styleId);
      
      const css = `
        .pulse-effect {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1.01);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1.01);
          }
        }
      `;
      
      this.renderer.appendChild(style, this.renderer.createText(css));
      this.renderer.appendChild(document.head, style);
    }
  }
}
