import { Injectable } from '@angular/core';
import { AnimationBuilder, AnimationFactory, AnimationPlayer, style, animate } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';

export interface TransitionOptions {
  duration?: number;
  delay?: number;
  easing?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransitionService {
  // Page transition state
  private _isAnimating = new BehaviorSubject<boolean>(false);
  isAnimating$ = this._isAnimating.asObservable();

  constructor(private animationBuilder: AnimationBuilder) {}

  /**
   * Create animation for element(s)
   */
  createFadeInAnimation(element: HTMLElement, options: TransitionOptions = {}): AnimationPlayer {
    const duration = options.duration || 300;
    const delay = options.delay || 0;
    const easing = options.easing || 'cubic-bezier(0.4, 0, 0.2, 1)';
    
    const factory = this.animationBuilder.build([
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate(`${duration}ms ${delay}ms ${easing}`, style({ opacity: 1, transform: 'translateY(0)' }))
    ]);
    
    return factory.create(element);
  }
  
  /**
   * Create staggered animations for list items
   */
  createStaggerAnimation(elements: HTMLElement[], options: TransitionOptions = {}): AnimationPlayer[] {
    const duration = options.duration || 300;
    const easing = options.easing || 'cubic-bezier(0.4, 0, 0.2, 1)';
    
    return elements.map((element, index) => {
      const delay = (options.delay || 50) * index;
      const factory = this.animationBuilder.build([
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(`${duration}ms ${delay}ms ${easing}`, style({ opacity: 1, transform: 'translateY(0)' }))
      ]);
      
      return factory.create(element);
    });
  }

  /**
   * Set animation state
   */
  setAnimating(isAnimating: boolean): void {
    this._isAnimating.next(isAnimating);
  }
  
  /**
   * Get random float between min and max
   */
  getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
  
  /**
   * Get random animation delay
   */
  getRandomDelay(min: number = 0, max: number = 500): number {
    return this.getRandomFloat(min, max);
  }
} 