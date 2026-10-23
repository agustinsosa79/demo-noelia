import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // Duraciones cortas para la interfaz y largas solo para revelar contenido
  // (NN/g: el feedback debe sentirse inmediato; las transiciones grandes, < 0,5-1 s).
  gsap.defaults({ ease: 'expo.out', duration: 1 });
}

export { gsap, ScrollTrigger, SplitText };

export const prefersReducedMotion = () =>
  typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
