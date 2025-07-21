import { NOTES } from '../constants.js';

class AudioService {
    static instance;
    #audioContext = null;
    #noiseBuffer = null;
    #samples = new Map();

    constructor() {}

    static getInstance() {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    init() {
        if (!this.#audioContext && typeof window !== 'undefined') {
            this.#audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this._createNoiseBuffer();
        }
    }

    _createNoiseBuffer() {
        if (!this.#audioContext) return;
        const bufferSize = this.#audioContext.sampleRate;
        this.#noiseBuffer = this.#audioContext.createBuffer(1, bufferSize, this.#audioContext.sampleRate);
        const output = this.#noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    }

    async loadSample(file) {
        if (!this.#audioContext) {
            this.init();
        }
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.#audioContext.decodeAudioData(e.target.result,
                    (buffer) => {
                        this.#samples.set(file.name, buffer);
                        resolve(file.name);
                    },
                    (error) => {
                        console.error('decodeAudioData error', error);
                        reject(error);
                    }
                );
            };
            reader.onerror = (error) => {
                console.error('FileReader error', error);
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    play(instrument, frequency, gainValue = 0.5) {
        if (!this.#audioContext || this.#audioContext.state !== 'running') return;
        
        const sampleBuffer = this.#samples.get(instrument);
        if (sampleBuffer) {
            this._playSample(sampleBuffer, frequency, gainValue);
            return;
        }

        switch (instrument) {
            case 'sine':
                this._playSine(frequency, gainValue);
                break;
            case 'kick':
                this._playKick(gainValue);
                break;
            case 'snare':
                this._playSnare(gainValue);
                break;
            case 'hihat':
                this._playHiHat(gainValue);
                break;
        }
    }

    _playSample(buffer, frequency, gainValue) {
        if (!this.#audioContext) return;
        const now = this.#audioContext.currentTime;
        const gainNode = this.#audioContext.createGain();
        gainNode.gain.setValueAtTime(gainValue, now);
        
        const source = this.#audioContext.createBufferSource();
        source.buffer = buffer;

        // Pitch shift sample based on frequency. Assumes sample's base note is C4.
        const baseFrequency = NOTES['C4']; // 261.63 Hz
        if (frequency && baseFrequency) {
            source.playbackRate.value = frequency / baseFrequency;
        }

        source.connect(gainNode).connect(this.#audioContext.destination);
        source.start(now);
    }
    
    _playSine(frequency, gainValue) {
        if (!this.#audioContext) return;
        const now = this.#audioContext.currentTime;
        const gainNode = this.#audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gainValue, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        const oscillator = this.#audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now);

        oscillator.connect(gainNode).connect(this.#audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
    }

    _playKick(gainValue) {
        if (!this.#audioContext) return;
        const now = this.#audioContext.currentTime;
        const gainNode = this.#audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gainValue, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        const oscillator = this.#audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(0.001, now + 0.4);

        oscillator.connect(gainNode).connect(this.#audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
    }
    
    _playSnare(gainValue) {
        if (!this.#audioContext || !this.#noiseBuffer) return;
        const now = this.#audioContext.currentTime;

        const gainNode = this.#audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gainValue * 0.8, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        const noiseSource = this.#audioContext.createBufferSource();
        noiseSource.buffer = this.#noiseBuffer;
        
        const filter = this.#audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.5;

        noiseSource.connect(filter).connect(gainNode).connect(this.#audioContext.destination);
        noiseSource.start(now);
        noiseSource.stop(now + 0.2);
    }
    
    _playHiHat(gainValue) {
        if (!this.#audioContext || !this.#noiseBuffer) return;
        const now = this.#audioContext.currentTime;

        const gainNode = this.#audioContext.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(gainValue * 0.3, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        const noiseSource = this.#audioContext.createBufferSource();
        noiseSource.buffer = this.#noiseBuffer;

        const filter = this.#audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        
        noiseSource.connect(filter).connect(gainNode).connect(this.#audioContext.destination);
        noiseSource.start(now);
        noiseSource.stop(now + 0.05);
    }

    getContextState() {
        return this.#audioContext ? this.#audioContext.state : 'uninitialized';
    }

    resumeContext() {
        return this.#audioContext ? this.#audioContext.resume() : Promise.resolve();
    }
}

export const audioService = AudioService.getInstance();