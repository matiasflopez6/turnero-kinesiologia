// Zonas del mapa corporal. Cada vista es una figura geométrica en un viewBox de 200 x 400.
// Vista de frente: el lado derecho del paciente queda a la izquierda de la pantalla. De espalda, al revés.

export const ZONES = {
  cervical: 'Columna cervical',
  dorsal: 'Columna dorsal',
  lumbar: 'Columna lumbar',
  torax: 'Tórax',
  abdomen: 'Abdomen',
  hombro_der: 'Hombro derecho', hombro_izq: 'Hombro izquierdo',
  escapula_der: 'Escápula derecha', escapula_izq: 'Escápula izquierda',
  brazo_der: 'Brazo derecho', brazo_izq: 'Brazo izquierdo',
  codo_der: 'Codo derecho', codo_izq: 'Codo izquierdo',
  muneca_der: 'Muñeca y mano derecha', muneca_izq: 'Muñeca y mano izquierda',
  cadera_der: 'Cadera derecha', cadera_izq: 'Cadera izquierda',
  gluteo_der: 'Glúteo derecho', gluteo_izq: 'Glúteo izquierdo',
  muslo_der: 'Muslo derecho', muslo_izq: 'Muslo izquierdo',
  isquio_der: 'Isquiotibiales derechos', isquio_izq: 'Isquiotibiales izquierdos',
  rodilla_der: 'Rodilla derecha', rodilla_izq: 'Rodilla izquierda',
  pierna_der: 'Pierna derecha', pierna_izq: 'Pierna izquierda',
  gemelo_der: 'Gemelo derecho', gemelo_izq: 'Gemelo izquierdo',
  tobillo_der: 'Tobillo y pie derecho', tobillo_izq: 'Tobillo y pie izquierdo',
};

export const FINDINGS = {
  dolor: 'Dolor',
  contractura: 'Contractura',
  limitacion: 'Limitación de movilidad',
};

// [zona, x, y, ancho, alto] con la figura vista de frente. Los lados se espejan para la vista de espalda.
const LIMBS = [
  ['hombro', 44, 64, 30, 26],
  ['brazo', 44, 90, 22, 56],
  ['codo', 42, 146, 22, 20],
  ['muneca', 40, 166, 22, 56],
  ['rodilla', 74, 266, 24, 26],
  ['tobillo', 72, 362, 26, 26],
];

function sides(name, x, y, w, h, leftSide) {
  const other = leftSide === 'der' ? 'izq' : 'der';
  return [
    [`${name}_${leftSide}`, x, y, w, h],
    [`${name}_${other}`, 200 - x - w, y, w, h],
  ];
}

export const VIEWS = {
  frente: [
    ['torax', 74, 64, 52, 60],
    ['abdomen', 74, 124, 52, 46],
    ...LIMBS.flatMap(([n, x, y, w, h]) => sides(n, x, y, w, h, 'der')),
    ...sides('cadera', 74, 170, 26, 26, 'der'),
    ...sides('muslo', 74, 196, 24, 70, 'der'),
    ...sides('pierna', 76, 292, 22, 70, 'der'),
  ],
  espalda: [
    ['cervical', 86, 46, 28, 20],
    ...sides('escapula', 74, 68, 26, 40, 'izq'),
    ['dorsal', 74, 108, 52, 32],
    ['lumbar', 74, 140, 52, 30],
    ...LIMBS.flatMap(([n, x, y, w, h]) => sides(n, x, y, w, h, 'izq')),
    ...sides('gluteo', 74, 170, 26, 30, 'izq'),
    ...sides('isquio', 74, 200, 24, 66, 'izq'),
    ...sides('gemelo', 76, 292, 22, 70, 'izq'),
  ],
};

// Partes que se dibujan pero no se marcan.
export const SILHOUETTE = [
  [84, 8, 32, 40], // cabeza
  [90, 48, 20, 16], // cuello
];

export function severity(eva) {
  if (eva == null) return 'marca';
  if (eva >= 7) return 'alta';
  if (eva >= 4) return 'media';
  return 'baja';
}
