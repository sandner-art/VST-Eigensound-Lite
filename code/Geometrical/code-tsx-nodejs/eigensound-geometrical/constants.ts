export const MAX_SIDES = 8;
export const MIN_SIDES = 3;
export const INITIAL_TEMPO = 120;
export const SVG_SIZE = 600;
export const SVG_CENTER = SVG_SIZE / 2;
export const BASE_RADIUS = SVG_SIZE * 0.4;

export const NOTES = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
};

export const SCALES = {
    PENTATONIC_MAJOR: { name: 'Major Pentatonic', intervals: [2, 2, 3, 2, 3] },
    PENTATONIC_MINOR: { name: 'Minor Pentatonic', intervals: [3, 2, 2, 3, 2] },
    DIATONIC_MAJOR: { name: 'Major (Ionian)', intervals: [2, 2, 1, 2, 2, 2, 1] },
    DIATONIC_MINOR: { name: 'Natural Minor', intervals: [2, 1, 2, 2, 1, 2, 2] },
};


// Colors for each polygon
export const SHAPE_COLORS = {
  3: '#fb7185', // rose-400
  4: '#facc15', // yellow-400
  5: '#4ade80', // green-400
  6: '#38bdf8', // lightBlue-400
  7: '#a78bfa', // violet-400
  8: '#f472b6', // pink-400
};
