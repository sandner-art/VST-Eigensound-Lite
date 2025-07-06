// --- AudioEngine Module ---
// Manages all Web Audio API interactions, synthesis, and effects.

import math from '../vendor/math-wrapper.js';

const NOTE_LIFETIME = 4.0; // seconds

export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.currentEigensystem = null;
        this.activeNodes = [];
        this.isInitialized = false;
        console.log("AudioEngine initialized.");
    }

    async initializeAudio() {
        if (this.isInitialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.audioContext.destination);
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.isInitialized = true;
            console.log("Audio context initialized successfully.");
        } catch (e) {
            console.error("Failed to initialize audio context:", e);
            alert("Could not initialize audio. Please use a modern browser and allow audio permissions.");
        }
    }

    excite(excitationVector) {
        if (!this.isInitialized || !this.currentEigensystem) {
            if(!this.isInitialized) this.initializeAudio();
            return;
        }

        const { values, vectors } = this.currentEigensystem;
        const now = this.audioContext.currentTime;

        // --- THIS IS THE CRITICAL FIX ---
        // Project excitationVector onto the eigenvectors to get initial amplitudes.
        // math.multiply returns a column matrix (e.g., [[a1], [a2], ...])
        // .flat() converts it to a simple array [a1, a2, ...]
        const exc = excitationVector || Array(values.length).fill(1);
        const amplitudes = math.multiply(math.inv(vectors), exc).toArray().flat();
        // --- END OF FIX ---

        this.activeNodes.forEach(node => {
            node.gain.gain.cancelScheduledValues(now);
            node.gain.gain.setTargetAtTime(0, now, 0.01);
            node.osc.stop(now + 0.1);
        });
        this.activeNodes = [];

        for (let i = 0; i < values.length; i++) {
            const eigenvalue = math.complex(values[i]);
            const initialAmplitude = Math.abs(amplitudes[i]) / values.length;

            if (initialAmplitude < 0.001) continue;

            const frequency = Math.abs(eigenvalue.im) * 80 + 100;
            const decayRate = -eigenvalue.re;

            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(this.masterGain);
            osc.type = 'sine';
            osc.frequency.value = frequency;

            gainNode.gain.setValueAtTime(initialAmplitude, now);
            const timeConstant = 1 / Math.max(0.1, decayRate);
            gainNode.gain.setTargetAtTime(0.0001, now, timeConstant);
            
            osc.start(now);
            osc.stop(now + NOTE_LIFETIME);
            this.activeNodes.push({ osc, gain: gainNode });
        }
    }

    updateEigensystem(eigensystem) {
        this.currentEigensystem = eigensystem;
    }
}