/**
 * Preguntas frecuentes. Solo se publican como datos estructurados (FAQPage)
 * las que tienen respuesta confirmada (`confirmed: true`).
 */
export interface FaqItem {
  q: string;
  a: string;
  confirmed: boolean;
}

export const trainingFaq: FaqItem[] = [
  {
    q: '¿Qué incluye la asesoría integral?',
    a: 'Una evaluación física para conocer tu punto de partida, un plan de entrenamiento, un plan nutricional personalizado y controles semanales para ajustar el plan según tu avance.',
    confirmed: true,
  },
  {
    q: '¿Cómo empiezo?',
    a: 'Escribile a Noelia por WhatsApp o completá el formulario del plan que te interese. Te responde para coordinar la evaluación física, que es el primer paso.',
    confirmed: true,
  },
  {
    q: '¿Cuánto cuesta un plan?',
    a: 'El precio depende del plan y de la modalidad. Noelia te lo pasa cuando le escribís, junto con las formas de pago.',
    confirmed: false,
  },
  {
    q: '¿El entrenamiento es online o presencial?',
    a: 'Consultalo al escribirle: la modalidad se coordina según el plan.',
    confirmed: false,
  },
  {
    q: '¿Tengo que comprar suplementos para entrenar con Noelia?',
    a: 'No. Los planes y la tienda son independientes: podés contratar un plan sin comprar suplementos.',
    confirmed: true,
  },
];

export const storeFaq: FaqItem[] = [
  {
    q: '¿Los suplementos reemplazan la comida?',
    a: 'No. Un suplemento complementa una alimentación variada. Si tenés una condición de salud, estás embarazada o tomás medicación, consultá con un profesional antes de usarlos.',
    confirmed: true,
  },
  {
    q: '¿Cómo pago el pedido?',
    a: 'Al confirmar, el pedido queda registrado y Noelia te contacta para coordinar el pago y la entrega.',
    confirmed: false,
  },
  {
    q: '¿Hacen envíos?',
    a: 'Las zonas y los costos de envío se confirman al coordinar el pedido.',
    confirmed: false,
  },
];
