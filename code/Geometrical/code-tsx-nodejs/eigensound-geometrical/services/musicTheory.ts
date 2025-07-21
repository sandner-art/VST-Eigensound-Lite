import { NOTES, SCALES } from "../constants.js";

const freqFromNote = (baseFreq, steps) => {
    return baseFreq * Math.pow(2, steps / 12);
};

export const getScaleFrequencies = (rootNote, scaleName) => {
    const rootFreq = NOTES[rootNote];
    if (!rootFreq) return [];

    const scale = SCALES[scaleName];
    if (!scale) return [];

    const frequencies = [rootFreq];
    let currentSteps = 0;
    
    // Use intervals to build the scale, skipping the last implicit interval back to octave
    for (let i = 0; i < scale.intervals.length -1; i++) {
        currentSteps += scale.intervals[i];
        frequencies.push(freqFromNote(rootFreq, currentSteps));
    }
    
    return frequencies;
};
