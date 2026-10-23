/** Imágenes de ambiente (Unsplash, licencia libre) con versiones de 800 y 1600 px. */
export type StockName =
  | 'gym-barra-sombra'
  | 'kettlebell-tiza'
  | 'kettlebell-gris'
  | 'rack-mancuernas'
  | 'mancuerna-fondo-negro'
  | 'disco-45'
  | 'barra-disco-oscuro'
  | 'columna-pesas'
  | 'kettlebells-bn';

export const stock = (name: StockName) => ({
  src: `/media/stock/${name}-1600.webp`,
  srcSet: `/media/stock/${name}-800.webp 800w, /media/stock/${name}-1600.webp 1600w`,
});

/** Fotos propias de Noelia (Instagram, 640 px: no estirarlas a pantalla completa). */
export const noelia = {
  stage: { src: '/media/noelia-tarima-npc-cordoba.webp', w: 320, h: 640, alt: 'Noelia Perucci en la tarima de NPC Córdoba, con bikini de competencia azul y el dorsal 181.' },
  stageSquare: { src: '/media/noelia-tarima-npc-cordoba-cuadrada.webp', w: 640, h: 640, alt: 'Noelia Perucci compitiendo en la categoría wellness de NPC Córdoba.' },
  training: { src: '/media/noelia-entrenando-espalda.webp', w: 360, h: 300, alt: 'Noelia Perucci entrenando espalda en una polea del gimnasio.' },
  certificate: {
    src: '/media/certificado-olympia.webp',
    w: 590,
    h: 395,
    alt: 'Certificado Bodybuilding & Fitness Trainer de la Academia Olympia Internacional a nombre de Noelia Soledad Perucci, emitido en julio de 2021.',
  },
};
