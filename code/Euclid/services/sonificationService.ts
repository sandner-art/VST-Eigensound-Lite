
import { SonificationRules, Waveform, MusicalScale, SonificationMode, SonificationFx, NoiseType, Sample, SourceType, FmParams, GranularParams, PresetSourceParameters, DistortionParams, DelayParams, ReverbParams, RhythmSettings, RhythmPresetMapping, DrumType, BlendMode } from '../types';

export interface SourceData {
    key: string;
    type: 'oscillator' | 'sample' | NoiseType | 'granular' | 'rhythmic_pulse';
    value: number;
    buffer?: AudioBuffer;
    fx: SonificationFx;
    fm?: FmParams;
    granular?: GranularParams;
    distortion?: DistortionParams;
    delay?: DelayParams;
    reverb?: ReverbParams;
}

const scales: Record<MusicalScale, number[]> = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor_pentatonic: [0, 3, 5, 7, 10],
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    blues: [0, 3, 5, 6, 7, 10],
};

interface PlayingSource {
    node: AudioNode;
    fxChain: { node: AudioNode, wetGain?: GainNode, dryGain?: GainNode }[];
    gain: GainNode;
    fxType: SonificationFx;
    sourceType: SourceData['type'];
    waveform?: Waveform;
    filterNode?: BiquadFilterNode;
    modulator?: { osc: OscillatorNode, gain: GainNode };
    granularScheduler?: { intervalId: number, grainProps: { buffer: AudioBuffer, playbackRate: number, grainDuration: number } };
    pulseScheduler?: { intervalId: number };
    lfo?: { osc: OscillatorNode, depth: GainNode };
    tremoloGain?: GainNode;
    targetGain: number;
}

interface RhythmClock {
    timeoutId: number | null;
    startTime: number;
    step: number;
    patterns: {
        kick: number[],
        snare: number[],
        hat: number[],
    },
    settings: RhythmSettings,
    sonificationRules: SonificationRules,
}

export class SonificationEngine {
    private audioContext: AudioContext;
    private playingSources: PlayingSource[] = [];
    private masterGain: GainNode;
    private compressor: DynamicsCompressorNode;
    private isMuted: boolean = false;
    private impulseReverb: AudioBuffer | null = null;
    private noiseBuffers: Record<NoiseType, AudioBuffer> = {} as Record<NoiseType, AudioBuffer>;
    private customWaveforms: { [key in 'pulse']?: PeriodicWave } = {};
    private sharedConstantSource: ConstantSourceNode;
    private fadeoutTimeout: number | null = null;
    private rhythmClock: RhythmClock | null = null;


    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -12;
        this.compressor.knee.value = 20;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0.01;
        this.compressor.release.value = 0.25;

        this.masterGain.connect(this.compressor).connect(this.audioContext.destination);
        this.masterGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
        
        this.sharedConstantSource = this.audioContext.createConstantSource();
        this.sharedConstantSource.offset.value = 1;
        this.sharedConstantSource.start();

        this.createImpulseReverb();
        this.createNoiseBuffers();
        this.createCustomWaveforms();
        this.resumeContext();
    }

    private resumeContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(console.error);
        }
    }
    
    public setMuted(muted: boolean): void {
        this.isMuted = muted;
        const newGain = this.isMuted ? 0 : 0.8;
        this.masterGain.gain.setTargetAtTime(newGain, this.audioContext.currentTime, 0.02);
    }

    private createCustomWaveforms() {
        const n = 4096;
        const real = new Float32Array(n);
        const imag = new Float32Array(n);
        for (let i = 1; i < n; i++) {
            imag[i] = (2 / (i * Math.PI)) * (1 - Math.cos(i * Math.PI / 2)) * Math.sin(i*Math.PI/4);
        }
        this.customWaveforms.pulse = this.audioContext.createPeriodicWave(real, imag, { disableNormalization: false });
    }
    
    private createNoiseBuffers() {
        const bufferSize = this.audioContext.sampleRate * 2;
        const whiteBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const whiteData = whiteBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) whiteData[i] = Math.random() * 2 - 1;
        this.noiseBuffers.white_noise = whiteBuffer;
        const pinkBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const pinkData = pinkBuffer.getChannelData(0);
        let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179; b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520; b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522; b5 = -0.7616 * b5 - white * 0.0168980;
            pinkData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            pinkData[i] *= 0.11; b6 = white * 0.115926;
        }
        this.noiseBuffers.pink_noise = pinkBuffer;
        const brownBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const brownData = brownBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            brownData[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = brownData[i]; brownData[i] *= 3.5;
        }
        this.noiseBuffers.brown_noise = brownBuffer;
    }

    private createImpulseReverb() {
        const rate = this.audioContext.sampleRate;
        const length = rate * 2;
        const impulse = this.audioContext.createBuffer(2, length, rate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);
        for (let i = 0; i < length; i++) {
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
        }
        this.impulseReverb = impulse;
    }

    private midiToFreq(midi: number): number {
        return Math.pow(2, (midi - 69) / 12) * 440;
    }

    private mapValueToPitch(value: number, rules: SonificationRules): number {
        const normalizedValue = Math.max(0, Math.min(1, value / 400));
        if (!isFinite(normalizedValue)) return rules.baseFrequency;
        const baseMidi = 69 + 12 * Math.log2(rules.baseFrequency / 440);
        const noteOffset = Math.floor(normalizedValue * 48); 
        const scaleIntervals = scales[rules.scale];
        const numIntervals = scaleIntervals.length;
        const octave = Math.floor(noteOffset / numIntervals);
        const noteInScale = scaleIntervals[noteOffset % numIntervals];
        const finalMidiNote = baseMidi + (octave * 12) + noteInScale;
        return this.midiToFreq(finalMidiNote);
    }
    
    private mapValueToParam(value: number, min: number, max: number, scaling: 'linear' | 'log' = 'linear'): number {
        const clampedValue = Math.max(0, Math.min(1, value / 400));
        if (!isFinite(clampedValue)) return min;
        if (scaling === 'log') {
             const minLog = Math.log(min > 0 ? min : 0.001);
             const maxLog = Math.log(max > 0 ? max : 0.001);
             return Math.exp(minLog + (maxLog - minLog) * clampedValue);
        }
        return min + (max - min) * clampedValue;
    }

    private createFxChain(fx: SonificationFx, params: SourceData): PlayingSource['fxChain'] {
        switch(fx) {
            case 'distortion':
                const distortion = this.audioContext.createWaveShaper();
                distortion.oversample = '4x';
                return [{ node: distortion }];
            case 'delay':
                const delay = this.audioContext.createDelay(1.0);
                const feedback = this.audioContext.createGain();
                delay.connect(feedback).connect(delay);
                return [{ node: delay }, { node: feedback }];
            case 'reverb':
                if (!this.impulseReverb) return [];
                const convolver = this.audioContext.createConvolver();
                convolver.buffer = this.impulseReverb;
                const wetGain = this.audioContext.createGain();
                const dryGain = this.audioContext.createGain();
                wetGain.connect(convolver);
                return [{ node: convolver, wetGain, dryGain }];
            default:
                return [];
        }
    }

    private stopSource(source: PlayingSource, now: number) {
        source.gain.gain.setTargetAtTime(0, now, 0.05);
        if (source.granularScheduler) clearInterval(source.granularScheduler.intervalId);
        if (source.pulseScheduler) clearInterval(source.pulseScheduler.intervalId);
        if (source.modulator) source.modulator.osc.stop(now + 0.1);
        if (source.lfo) source.lfo.osc.stop(now + 0.1);
        if ('stop' in source.node) try { (source.node as OscillatorNode | AudioBufferSourceNode).stop(now + 0.1); } catch(e){}
        source.node.disconnect();
    }

    public update(sources: SourceData[], rules: SonificationRules, samples: Sample[], blendAssignments: { [key: string]: BlendMode }, isDragging?: boolean, xy?: {x: number, y: number}): void {
        this.resumeContext();
        if (this.rhythmClock?.settings.isEnabled) return; // Don't run ambient engine if rhythm is active
        this.stopRhythm();
        const now = this.audioContext.currentTime;
        const numSources = Math.min(sources.length, rules.maxPolyphony);

        // Remove surplus sources
        while (this.playingSources.length > numSources) {
            const sourceToRemove = this.playingSources.pop();
            if (sourceToRemove) {
                this.stopSource(sourceToRemove, now);
            }
        }

        // Update or remove existing sources
        for (let i = this.playingSources.length - 1; i >= 0; i--) {
            const ps = this.playingSources[i];
            const sd = sources[i];
            const isMatch = sd && ps.sourceType === sd.type && ps.waveform === rules.waveform && ps.fxType === sd.fx;
            if (i >= numSources || !isMatch) {
                this.stopSource(this.playingSources[i], now);
                this.playingSources.splice(i, 1);
            }
        }
        
        while (this.playingSources.length < numSources) {
            const index = this.playingSources.length;
            const sourceData = sources[index];
            let node: AudioNode, modulator: PlayingSource['modulator'], lfo: PlayingSource['lfo'], tremoloGain: PlayingSource['tremoloGain'];
            
            if (sourceData.type === 'granular' && sourceData.buffer) {
                node = this.audioContext.createGain();
            } else if (sourceData.type === 'sample' && sourceData.buffer) {
                node = this.audioContext.createBufferSource();
                (node as AudioBufferSourceNode).buffer = sourceData.buffer;
                (node as AudioBufferSourceNode).loop = true;
            } else if (sourceData.type.endsWith('_noise')) {
                node = this.audioContext.createBufferSource();
                (node as AudioBufferSourceNode).buffer = this.noiseBuffers[sourceData.type as NoiseType];
                (node as AudioBufferSourceNode).loop = true;
            } else {
                const osc = this.audioContext.createOscillator();
                if (rules.waveform === 'fm') {
                    const modOsc = this.audioContext.createOscillator();
                    const modGain = this.audioContext.createGain();
                    modOsc.connect(modGain).connect(osc.frequency);
                    modulator = { osc: modOsc, gain: modGain };
                }
                node = osc;
            }

            if(rules.lfo.target !== 'none') {
                const lfoOsc = this.audioContext.createOscillator();
                const lfoDepth = this.audioContext.createGain();
                this.setOscillatorType(lfoOsc, rules.lfo.waveform);
                lfoOsc.connect(lfoDepth);
                lfo = { osc: lfoOsc, depth: lfoDepth };

                if(rules.lfo.target === 'volume') {
                    tremoloGain = this.audioContext.createGain();
                    this.sharedConstantSource.connect(tremoloGain.gain);
                    lfo.depth.connect(tremoloGain.gain);
                }
            }

            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter(); filterNode.type = 'lowpass'; filterNode.frequency.value = 20000; filterNode.Q.value = 1;
            const fxChain = this.createFxChain(sourceData.fx, sourceData);

            let lastNode: AudioNode = node;
            lastNode.connect(filterNode);
            lastNode = tremoloGain ? filterNode.connect(tremoloGain) : filterNode;

            if (fxChain.length > 0 && fxChain[0].wetGain && fxChain[0].dryGain) { // Reverb case
                const {node: fxNode, wetGain, dryGain} = fxChain[0];
                lastNode.connect(dryGain);
                lastNode.connect(wetGain);
                wetGain.connect(fxNode);
                dryGain.connect(gainNode);
                fxNode.connect(gainNode);
            } else {
                fxChain.forEach(fx => { lastNode.connect(fx.node); lastNode = fx.node });
                lastNode.connect(gainNode);
            }
            gainNode.connect(this.masterGain);

            gainNode.gain.setValueAtTime(0, now);
            if ('start' in node) try { (node as OscillatorNode | AudioBufferSourceNode).start(); } catch(e){}
            if (modulator) try { modulator.osc.start(); } catch(e){}
            if (lfo) try { lfo.osc.start(); } catch(e){}

            this.playingSources.push({ node, gain: gainNode, fxChain, fxType: sourceData.fx, sourceType: sourceData.type, filterNode, targetGain: 0, modulator, waveform: rules.waveform, lfo, tremoloGain });
        }

        const gainPerNode = numSources > 0 ? 0.7 / numSources : 0;
        sources.slice(0, numSources).forEach((sourceData, index) => {
            const ps = this.playingSources[index];
            if (!ps || !isFinite(sourceData.value)) return;

            if (sourceData.type === 'rhythmic_pulse') {
                ps.targetGain = 0; // Ensure no continuous sound from main gain node
                if (ps.pulseScheduler) clearInterval(ps.pulseScheduler.intervalId);
                const rate = this.mapValueToParam(sourceData.value, 0.5, 20);
                const intervalTime = 1000 / Math.max(0.1, rate);
                const intervalId = window.setInterval(() => { this.createPulseSound(rules.baseFrequency * 2, 0.6); }, intervalTime);
                ps.pulseScheduler = { intervalId };
                ps.gain.gain.setTargetAtTime(0, now, 0.01);
                return; // Skip other logic for this source
            } else {
                if (ps.pulseScheduler) { clearInterval(ps.pulseScheduler.intervalId); ps.pulseScheduler = undefined; }
            }

            const value = sourceData.value;
            const blendMode = blendAssignments[sourceData.key] || '100';
            let blendFactor = 1.0;
            switch(blendMode) {
                case '75': blendFactor = 0.75; break;
                case '50': blendFactor = 0.50; break;
                case '25': blendFactor = 0.25; break;
                case 'dynamic': blendFactor = this.mapValueToParam(value, 0.1, 1.0); break;
            }
            
            if (isDragging && xy) {
                ps.targetGain = gainPerNode * blendFactor;
                const pitch = this.mapValueToPitch(value, rules);
                const filterFreq = this.mapValueToParam(xy.x * 400, 200, 18000, 'log');
                const filterQ = this.mapValueToParam(xy.y * 400, 1, 20);

                if (ps.filterNode) {
                    ps.filterNode.frequency.setTargetAtTime(filterFreq, now, 0.02);
                    ps.filterNode.Q.setTargetAtTime(filterQ, now, 0.02);
                }
                if (ps.node instanceof OscillatorNode) {
                    this.setOscillatorType(ps.node, 'sawtooth');
                    ps.node.frequency.setTargetAtTime(pitch, now, 0.02);
                }
                if (ps.lfo) ps.lfo.depth.gain.setTargetAtTime(0, now, 0.01);
                if (ps.modulator) ps.modulator.gain.gain.setTargetAtTime(0, now, 0.01);
                return;
            }
            
            if(ps.filterNode) ps.filterNode.Q.setTargetAtTime(1, now, 0.02); 

            if (ps.sourceType === 'granular' && sourceData.buffer && sourceData.granular) {
                if(!ps.granularScheduler) this.startGranular(ps, sourceData.buffer, sourceData.granular);
                switch(rules.granularModulationTarget) {
                    case 'pitch': ps.granularScheduler!.grainProps.playbackRate = this.mapValueToParam(value, 0.2, 2.5); break;
                    case 'rate': if (ps.granularScheduler) { clearInterval(ps.granularScheduler.intervalId); this.startGranular(ps, sourceData.buffer, {...sourceData.granular, grainRate: this.mapValueToParam(value, 5, 100)}); } break;
                    case 'duration': ps.granularScheduler!.grainProps.grainDuration = this.mapValueToParam(value, 0.01, 0.2); break;
                }
                ps.targetGain = gainPerNode * blendFactor; return;
            }
            
            if (ps.granularScheduler) { clearInterval(ps.granularScheduler.intervalId); ps.granularScheduler = undefined; }

            switch(rules.mode) {
                case 'pitch':
                    ps.targetGain = gainPerNode * blendFactor;
                    if (ps.node instanceof AudioBufferSourceNode) ps.node.playbackRate.setTargetAtTime(this.mapValueToParam(value, 0.5, 2.0), now, 0.02);
                    else if (ps.node instanceof OscillatorNode) {
                        const freq = this.mapValueToPitch(value, rules);
                        this.setOscillatorType(ps.node, rules.waveform);
                        ps.node.frequency.setTargetAtTime(freq, now, 0.02);
                        if (ps.modulator && sourceData.fm) {
                            ps.modulator.osc.frequency.setTargetAtTime(freq * sourceData.fm.harmonicity, now, 0.02);
                            ps.modulator.gain.gain.setTargetAtTime(freq * sourceData.fm.modIndex, now, 0.02);
                        }
                    }
                    ps.filterNode?.frequency.setTargetAtTime(20000, now, 0.02); break;
                case 'volume':
                    ps.targetGain = this.mapValueToParam(value, 0, gainPerNode * 1.5) * blendFactor;
                    if (ps.node instanceof AudioBufferSourceNode) ps.node.playbackRate.setTargetAtTime(1, now, 0.02);
                    else if (ps.node instanceof OscillatorNode) { this.setOscillatorType(ps.node, rules.waveform); ps.node.frequency.setTargetAtTime(rules.baseFrequency, now, 0.02); }
                    ps.filterNode?.frequency.setTargetAtTime(20000, now, 0.02); break;
                case 'filter':
                     ps.targetGain = gainPerNode * blendFactor;
                     const filterFreq = this.mapValueToParam(value, 200, 12000, 'log');
                     ps.filterNode?.frequency.setTargetAtTime(filterFreq, now, 0.02);
                     if (ps.node instanceof OscillatorNode) { this.setOscillatorType(ps.node, 'sawtooth'); ps.node.frequency.setTargetAtTime(rules.baseFrequency, now, 0.02); } break;
            }

            if (ps.lfo) {
                const { lfo, node, filterNode } = ps;
                const { target, rate, depth } = rules.lfo;
                const modValue = rules.lfoModulationTarget === 'rate' ? this.mapValueToParam(value, 0.1, 20) : rate;
                const depthValue = rules.lfoModulationTarget === 'depth' ? this.mapValueToParam(value, 0, 1) : depth;
                lfo.osc.frequency.setTargetAtTime(modValue, now, 0.02);
                
                if(target === 'pitch' && (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode)) lfo.depth.gain.setTargetAtTime(depthValue * 1200, now, 0.02); // depth in cents
                else if(target === 'filter' && filterNode) lfo.depth.gain.setTargetAtTime(depthValue * (filterNode.frequency.value / 2), now, 0.02);
                else if(target === 'volume') lfo.depth.gain.setTargetAtTime(depthValue, now, 0.02);
                else lfo.depth.gain.setTargetAtTime(0, now, 0.02); // No modulation
                
                if(lfo.depth.gain.value > 0) {
                     if(target === 'pitch' && (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode)) lfo.depth.connect(node.detune); else if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) try { lfo.depth.disconnect(node.detune); } catch(e){}
                     if(target === 'filter' && filterNode) lfo.depth.connect(filterNode.frequency); else if(filterNode) try { lfo.depth.disconnect(filterNode.frequency); } catch(e){}
                }
            }

            if (ps.fxType === 'distortion' && ps.fxChain[0]?.node instanceof WaveShaperNode) {
                const amount = sourceData.distortion?.amount ?? 0.5;
                const k = Math.max(0.01, amount * 100);
                const curve = new Float32Array(256);
                for (let i=0; i<256; i++) { const x = i*2/256-1; curve[i] = (Math.PI+k)*x/(Math.PI+k*Math.abs(x)); }
                ps.fxChain[0].node.curve = curve;
            } else if (ps.fxType === 'delay' && ps.fxChain[0]?.node instanceof DelayNode) {
                ps.fxChain[0].node.delayTime.setTargetAtTime(sourceData.delay?.time ?? 0.3, now, 0.02);
                (ps.fxChain[1].node as GainNode).gain.setTargetAtTime(sourceData.delay?.feedback ?? 0.5, now, 0.02);
            } else if (ps.fxType === 'reverb' && ps.fxChain[0]?.wetGain && ps.fxChain[0]?.dryGain) {
                const mix = sourceData.reverb?.mix ?? 0.5;
                ps.fxChain[0].wetGain.gain.setTargetAtTime(mix, now, 0.02);
                ps.fxChain[0].dryGain.gain.setTargetAtTime(1-mix, now, 0.02);
            }
        });
    }

    private setOscillatorType(osc: OscillatorNode, waveform: Waveform) {
        if (waveform === 'pulse' && this.customWaveforms.pulse) {
            osc.setPeriodicWave(this.customWaveforms.pulse);
        } else if (waveform === 'fm' || waveform === 'pulse') {
            osc.type = 'sine';
        } else {
            osc.type = waveform;
        }
    }

    private startGranular(source: PlayingSource, buffer: AudioBuffer, params: GranularParams) {
        const grainProps = { buffer, playbackRate: 1.0, grainDuration: params.grainDuration };
        const intervalTime = 1000 / params.grainRate;
        const intervalId = window.setInterval(() => {
            if (this.audioContext.state === 'suspended' || source.gain.gain.value < 0.01) return;
            const now = this.audioContext.currentTime;
            const grainDur = grainProps.grainDuration;
            const jitterAmount = params.jitter * (grainProps.buffer.duration - grainDur);
            const offset = Math.random() * jitterAmount;
            const envelope = this.audioContext.createGain();
            envelope.connect(source.node);
            envelope.gain.setValueAtTime(0, now);
            envelope.gain.linearRampToValueAtTime(1, now + grainDur * 0.4);
            envelope.gain.linearRampToValueAtTime(0, now + grainDur);
            const grain = this.audioContext.createBufferSource();
            grain.buffer = grainProps.buffer;
            grain.playbackRate.value = grainProps.playbackRate + (Math.random() - 0.5) * 0.1;
            grain.connect(envelope);
            grain.start(now, offset, grainDur * 2);
            grain.stop(now + grainDur * 2);
        }, intervalTime);
        source.granularScheduler = { intervalId, grainProps };
    }

    public start(): void {
        this.resumeContext();
        if (this.fadeoutTimeout) { clearTimeout(this.fadeoutTimeout); this.fadeoutTimeout = null; }
        const now = this.audioContext.currentTime;
        this.playingSources.forEach(source => {
            if (source.sourceType !== 'rhythmic_pulse') {
                 source.gain.gain.setTargetAtTime(source.targetGain, now, 0.02)
            }
        });
    }
    
    public stop(immediate = false): void {
        this.stopRhythm();
        if (this.fadeoutTimeout) { clearTimeout(this.fadeoutTimeout); this.fadeoutTimeout = null; }
        const now = this.audioContext.currentTime;
        const fadeTime = immediate ? 0.05 : 0.2;
        this.playingSources.forEach(source => {
            source.gain.gain.setTargetAtTime(0, now, fadeTime);
            if (immediate) this.stopSource(source, now);
        });
        if (immediate) this.playingSources = [];
    }

    public playWithFadeout(duration: number): void {
        this.start();
        if (this.fadeoutTimeout) clearTimeout(this.fadeoutTimeout);
        this.fadeoutTimeout = window.setTimeout(() => { this.stop(); this.fadeoutTimeout = null; }, duration * 1000);
    }
    
    // --- RHYTHM MODULE ---

    private createPulseSound(frequency: number, volume: number) {
        if (this.isMuted || volume <= 0) return;
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(volume * this.masterGain.gain.value, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.connect(gain).connect(this.compressor);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    private generateEuclideanPattern(pulses: number, steps: number): number[] {
        if (pulses <= 0 || steps <= 0 || pulses > steps) return new Array(steps).fill(0);
        let pattern: number[][] = [];
        for (let i = 0; i < steps; i++) {
            pattern.push(i < pulses ? [1] : [0]);
        }
        let l = pattern.length;
        while (l > 1) {
            let temp = l - 1;
            let first = pattern[0];
            let last = pattern[temp];
            if (first.length >= last.length) break;
            let j = temp;
            while(j > 0 && pattern[j].length === last.length) {
                pattern[j-1] = pattern[j-1].concat(pattern[j]);
                pattern.splice(j,1);
                j--;
            }
            l = pattern.length;
        }
        return [].concat.apply([], pattern);
    }

    private createDrumSound(type: DrumType, time: number, volume: number) {
        if (this.isMuted || volume <= 0) return;
        const masterVolume = this.masterGain.gain.value;
        const finalVolume = volume * masterVolume;

        switch(type) {
            case 'kick': {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, time);
                osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);
                gain.gain.setValueAtTime(finalVolume, time);
                gain.gain.exponentialRampToValueAtTime(0.001 * finalVolume, time + 0.2);
                osc.connect(gain).connect(this.compressor);
                osc.start(time);
                osc.stop(time + 0.25);
                break;
            }
            case 'snare': {
                const noise = this.audioContext.createBufferSource();
                noise.buffer = this.noiseBuffers.white_noise;
                const noiseFilter = this.audioContext.createBiquadFilter();
                noiseFilter.type = 'highpass';
                noiseFilter.frequency.value = 1500;
                const noiseEnvelope = this.audioContext.createGain();
                noise.connect(noiseFilter).connect(noiseEnvelope).connect(this.compressor);
                noiseEnvelope.gain.setValueAtTime(0.8 * finalVolume, time);
                noiseEnvelope.gain.exponentialRampToValueAtTime(0.01 * finalVolume, time + 0.2);
                noise.start(time);
                noise.stop(time + 0.2);

                const body = this.audioContext.createOscillator();
                body.type = 'triangle';
                body.frequency.value = 180;
                const bodyEnvelope = this.audioContext.createGain();
                body.connect(bodyEnvelope).connect(this.compressor);
                bodyEnvelope.gain.setValueAtTime(0.7 * finalVolume, time);
                bodyEnvelope.gain.exponentialRampToValueAtTime(0.01 * finalVolume, time + 0.1);
                body.start(time);
                body.stop(time + 0.1);
                break;
            }
            case 'hat': {
                const noise = this.audioContext.createBufferSource();
                noise.buffer = this.noiseBuffers.white_noise;
                const noiseFilter = this.audioContext.createBiquadFilter();
                noiseFilter.type = 'bandpass';
                noiseFilter.frequency.value = 10000;
                noiseFilter.Q.value = 1.5;
                const noiseEnvelope = this.audioContext.createGain();
                noise.connect(noiseFilter).connect(noiseEnvelope).connect(this.compressor);
                noiseEnvelope.gain.setValueAtTime(0.7 * finalVolume, time);
                noiseEnvelope.gain.exponentialRampToValueAtTime(0.01 * finalVolume, time + 0.08);
                noise.start(time);
                noise.stop(time + 0.1);
                break;
            }
        }
    }

     private createHarmonicBass(time: number, volume: number, rules: SonificationRules) {
        if (this.isMuted || volume <= 0) return;
        const masterVolume = this.masterGain.gain.value;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sawtooth';
        // Play the root note of the scale, two octaves down
        osc.frequency.value = rules.baseFrequency / 4; 
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, time);
        filter.frequency.exponentialRampToValueAtTime(200, time + 0.15);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume * masterVolume * 0.5, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        
        osc.connect(filter).connect(gain).connect(this.compressor);
        osc.start(time);
        osc.stop(time + 0.3);
    }

    private rhythmScheduler = () => {
        if (!this.rhythmClock) return;

        const { settings, patterns } = this.rhythmClock;
        const secondsPerStep = 60.0 / settings.bpm / 4; // 16th notes
        const now = this.audioContext.currentTime;
        
        const scheduleAheadTime = 0.2; // seconds

        while (this.rhythmClock.startTime < now + scheduleAheadTime) {
            const step = this.rhythmClock.step;
            
            if (patterns.kick[step % patterns.kick.length]) {
                this.createDrumSound('kick', this.rhythmClock.startTime, settings.kickVolume);
                if (settings.harmonicBass) {
                    this.createHarmonicBass(this.rhythmClock.startTime, settings.kickVolume, this.rhythmClock.sonificationRules);
                }
            }
            if (patterns.snare[step % patterns.snare.length]) {
                this.createDrumSound('snare', this.rhythmClock.startTime, settings.snareVolume);
            }
            if (patterns.hat[step % patterns.hat.length]) {
                this.createDrumSound('hat', this.rhythmClock.startTime, settings.hatVolume);
            }

            this.rhythmClock.step++;
            this.rhythmClock.startTime += secondsPerStep;
        }

        this.rhythmClock.timeoutId = window.setTimeout(this.rhythmScheduler, 25);
    }

    public stopRhythm() {
        if (this.rhythmClock?.timeoutId) {
            clearTimeout(this.rhythmClock.timeoutId);
        }
        this.rhythmClock = null;
    }

    public updateRhythm(settings: RhythmSettings, mapping: RhythmPresetMapping, sources: SourceData[], sonificationRules: SonificationRules) {
        this.resumeContext();
        if (!settings.isEnabled) {
            this.stopRhythm();
            return;
        }

        const sourcesMap = new Map(sources.map(s => [s.key, s.value]));
        
        const getParamValue = (sourceKey: string | undefined, min: number, max: number, isInt = true): number => {
            if (!sourceKey || sourceKey === 'none') return isInt ? Math.round((min+max)/2) : (min+max)/2;
            const rawValue = sourcesMap.get(sourceKey) || 0;
            const normalizedValue = Math.max(0, Math.min(1, rawValue / 200)); // Normalize assuming raw value is roughly 0-200
            const value = min + normalizedValue * (max - min);
            return isInt ? Math.round(value) : value;
        };

        const patterns = { kick: [0], snare: [0], hat: [0]};

        (['kick', 'snare', 'hat'] as DrumType[]).forEach(drum => {
            const pulses = getParamValue(mapping[drum]?.pulses, 1, 16);
            const steps = getParamValue(mapping[drum]?.steps, pulses, 32);
            let pattern = this.generateEuclideanPattern(pulses, steps);
            
            const offsetSourceKey = mapping[drum]?.offset;
            if (offsetSourceKey && offsetSourceKey !== 'none' && pattern.length > 0) {
                 const offset = getParamValue(offsetSourceKey, 0, pattern.length - 1);
                 pattern = [...pattern.slice(-offset), ...pattern.slice(0, -offset)];
            }
            patterns[drum] = pattern;
        });

        if (!this.rhythmClock) {
            this.rhythmClock = {
                timeoutId: null,
                startTime: this.audioContext.currentTime,
                step: 0,
                patterns: patterns,
                settings: settings,
                sonificationRules: sonificationRules,
            };
            this.rhythmScheduler();
        } else {
            this.rhythmClock.patterns = patterns;
            this.rhythmClock.settings = settings;
            this.rhythmClock.sonificationRules = sonificationRules;
        }
    }
}
