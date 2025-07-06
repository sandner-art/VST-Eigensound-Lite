// --- AudioEngine Module ---
// Manages all Web Audio API interactions, synthesis, and effects.

import math from '../vendor/math-wrapper.js'; // <-- ADD THIS LINE

const NOTE_LIFETIME = 4.0; // seconds

export class AudioEngine {
    // ... rest of the file is the same as before ...
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.currentEigensystem = null; // Will be populated with { values, vectors }
        this.activeNodes = [];
        this.isInitialized = false;
        console.log("AudioEngine initialized.");
    }

    // --- Core Audio Setup ---
    async initializeAudio() {
        if (this.isInitialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.audioContext.destination);
            // Resume if suspended
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

    // --- Synthesizer Mode ---
    excite(excitationVector) {
        if (!this.isInitialized || !this.currentEigensystem) {
            console.warn("Audio not ready or no eigensystem to play.");
            if(!this.isInitialized) this.initializeAudio(); // Attempt to init on first interaction
            return;
        }

        const { values, vectors } = this.currentEigensystem;
        const now = this.audioContext.currentTime;

        // 1. Project excitationVector onto the eigenvectors to get initial amplitudes.
        const exc = excitationVector || math.ones(values.length);
        const amplitudes = math.multiply(math.inv(vectors), exc).toArray();

        console.log("Exciting system...");
        
        // Clean up any previously playing notes
        this.activeNodes.forEach(node => node.gain.gain.cancelScheduledValues(now));
        this.activeNodes.forEach(node => node.osc.stop(now));
        this.activeNodes = [];

        for (let i = 0; i < values.length; i++) {
            const eigenvalue = math.complex(values[i]);
            const initialAmplitude = Math.abs(amplitudes[i]) / values.length;

            if (initialAmplitude < 0.001) continue;

            // Map imaginary part to frequency (scaled for audible range)
            const frequency = Math.abs(eigenvalue.im) * 50 + 100; // Scale to an audible range
            // Map real part to decay rate
            const decayRate = -eigenvalue.re; // Damping is negative of the real part

            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(this.masterGain);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, now);

            // Set gain envelope based on amplitude and decay rate
            gainNode.gain.setValueAtTime(initialAmplitude, now);
            
            // Use setTargetAtTime for a more natural exponential decay
            // The time constant is the inverse of the decay rate
            const timeConstant = 1 / Math.max(0.1, decayRate);
            gainNode.gain.setTargetAtTime(0.0001, now, timeConstant);
            
            osc.start(now);
            osc.stop(now + NOTE_LIFETIME);

            this.activeNodes.push({ osc, gain: gainNode });
        }
        
        // Remove nodes after they've finished playing
        setTimeout(() => {
            this.activeNodes = this.activeNodes.filter(n => n.osc.playbackState === 'playing');
        }, NOTE_LIFETIME * 1000 + 200);
    }

    updateEigensystem(eigensystem) {
        this.currentEigensystem = eigensystem;
    }
}