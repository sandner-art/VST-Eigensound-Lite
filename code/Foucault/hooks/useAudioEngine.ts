import { useRef, useCallback, useState } from 'react';
import type { PendulumState, PhysicsParams, SynthType, AudioParams } from '../types';
import { DEFAULT_AUDIO_PARAMS } from '../constants';

interface AudioVoice {
  oscillator: OscillatorNode;
  noise: AudioBufferSourceNode;
  sampleSource: AudioBufferSourceNode;
  gain: GainNode;
  panner: StereoPannerNode;
  filter: BiquadFilterNode;
  type: SynthType;
}

export const useAudioEngine = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterVolumeRef = useRef<GainNode | null>(null);
  const masterCompressorRef = useRef<DynamicsCompressorNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const reverbWetGainRef = useRef<GainNode | null>(null);
  const destinationNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const customSampleBufferRef = useRef<AudioBuffer | null>(null);
  const voicesRef = useRef<Record<number, AudioVoice>>({});
  const synthTypeRef = useRef<SynthType>(DEFAULT_AUDIO_PARAMS.synthType);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isSampleLoaded, setIsSampleLoaded] = useState(false);

  const createReverbIR = (context: AudioContext): AudioBuffer => {
      const sampleRate = context.sampleRate;
      const length = sampleRate * 2; // 2 seconds reverb tail
      const impulse = context.createBuffer(2, length, sampleRate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
          const t = i / length;
          left[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 4);
          right[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 4);
      }
      return impulse;
  };

  const createVoice = (context: AudioContext): Omit<AudioVoice, 'type'> => {
    const gain = context.createGain();
    const panner = context.createStereoPanner();
    const filter = context.createBiquadFilter();

    gain.gain.setValueAtTime(0, context.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(20000, context.currentTime);

    gain.connect(masterVolumeRef.current!);
    panner.connect(gain);
    filter.connect(panner);
    
    const oscillator = context.createOscillator();
    oscillator.frequency.setValueAtTime(110, context.currentTime);
    oscillator.start();
    
    const bufferSize = context.sampleRate * 2;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    const noise = context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    noise.start();

    const sampleSource = context.createBufferSource();
    if (customSampleBufferRef.current) {
        sampleSource.buffer = customSampleBufferRef.current;
        sampleSource.loop = true;
    }
    sampleSource.start();
    
    return { oscillator, noise, sampleSource, gain, panner, filter };
  };

  const initAudio = useCallback(async () => {
    if (isInitialized || audioContextRef.current) return;

    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = context;
    if (context.state === 'suspended') {
      await context.resume();
    }

    const masterVolume = context.createGain();
    masterVolume.gain.setValueAtTime(DEFAULT_AUDIO_PARAMS.volume, context.currentTime);
    masterVolumeRef.current = masterVolume;
    
    const masterCompressor = context.createDynamicsCompressor();
    masterCompressorRef.current = masterCompressor;
    
    const reverb = context.createConvolver();
    reverb.buffer = createReverbIR(context);
    reverbNodeRef.current = reverb;

    const reverbWetGain = context.createGain();
    reverbWetGain.gain.setValueAtTime(DEFAULT_AUDIO_PARAMS.reverb, context.currentTime);
    reverbWetGainRef.current = reverbWetGain;
    
    destinationNodeRef.current = context.createMediaStreamDestination();

    // Main signal chain: Voices -> Master Volume -> Compressor -> Destination & Recorder
    masterVolume.connect(masterCompressor);
    masterCompressor.connect(context.destination);
    masterCompressor.connect(destinationNodeRef.current); // Also connect to recorder destination

    // Reverb send chain: Master Volume -> Reverb Wet Gain -> Reverb -> Compressor
    masterVolume.connect(reverbWetGain);
    reverbWetGain.connect(reverb);
    reverb.connect(masterCompressor);

    setIsInitialized(true);
  }, [isInitialized]);

  const setVoiceType = (voice: AudioVoice, type: SynthType) => {
    voice.oscillator.disconnect();
    voice.noise.disconnect();
    voice.sampleSource.disconnect();
    
    if (type === 'noise') {
        voice.noise.connect(voice.filter);
    } else if (type === 'sample' && isSampleLoaded && voice.sampleSource.buffer) {
        voice.sampleSource.connect(voice.filter);
    } else {
        voice.oscillator.type = type as OscillatorType;
        voice.oscillator.connect(voice.filter);
    }
    voice.type = type;
  };

  const addPendulumAudio = useCallback((pendulum: PendulumState) => {
    const context = audioContextRef.current;
    if (!context || voicesRef.current[pendulum.id]) return;
    if (context.state === 'suspended') context.resume();
    
    const voiceParts = createVoice(context);
    const voice: AudioVoice = { ...voiceParts, type: synthTypeRef.current };
    setVoiceType(voice, synthTypeRef.current);
    voicesRef.current[pendulum.id] = voice;
  }, [isSampleLoaded]);
  
  const removePendulumAudio = useCallback((id: number) => {
    const context = audioContextRef.current;
    const voice = voicesRef.current[id];
    if (!context || !voice) return;

    const now = context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setTargetAtTime(0, now, 0.5);

    setTimeout(() => {
        voice.oscillator.stop();
        voice.noise.stop();
        voice.sampleSource.stop();
        voice.gain.disconnect();
        voice.panner.disconnect();
        voice.filter.disconnect();
        delete voicesRef.current[id];
    }, 1000);
  }, []);

  const setSynthType = useCallback((type: SynthType) => {
    synthTypeRef.current = type;
    for (const id in voicesRef.current) {
        setVoiceType(voicesRef.current[id], type);
    }
  }, [isSampleLoaded]);

  const updateAudio = useCallback((pendulums: PendulumState[], params: PhysicsParams, audioParams: AudioParams) => {
    const context = audioContextRef.current;
    if (!context) return;
    const now = context.currentTime;
    
    for (const pendulum of pendulums) {
      const voice = voicesRef.current[pendulum.id];
      if (!voice) continue;

      const { position, velocity, amplitude, precessionAngle } = pendulum;

      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      const maxTheoreticalSpeed = Math.sqrt(2 * params.gravity / params.length) * amplitude;
      const speedRatio = Math.min(speed / (maxTheoreticalSpeed + 0.01), 1.0);
      
      const baseFreq = 80;
      const octaveRange = 3;
      const pitchMultiplier = Math.pow(2, speedRatio * octaveRange);

      const positionMagnitude = Math.sqrt(position.x ** 2 + position.y ** 2);
      let dopplerShift = 1.0;
      if (positionMagnitude > 1e-6) {
          const radialVelocity = (position.x * velocity.x + position.y * velocity.y) / positionMagnitude;
          const speedOfSound = 343; // m/s
          // Enhanced doppler effect for more pronounced audio feedback
          dopplerShift = speedOfSound / (speedOfSound - radialVelocity * audioParams.dopplerEffect * 30);
          dopplerShift = Math.max(0.25, Math.min(2.5, dopplerShift));
      }

      if (voice.type === 'sample') {
        const playbackRate = pitchMultiplier * dopplerShift;
        if (isFinite(playbackRate)) {
            voice.sampleSource.playbackRate.setTargetAtTime(playbackRate, now, 0.05);
        }
      } else {
        const musicalFreq = baseFreq * pitchMultiplier * dopplerShift;
        if (isFinite(musicalFreq)) {
            voice.oscillator.frequency.setTargetAtTime(musicalFreq, now, 0.05);
        }
      }
      
      const volume = Math.pow(Math.min(amplitude / 1.5, 1.0), 2);
      if (isFinite(volume)) voice.gain.gain.setTargetAtTime(volume, now, 0.05);

      const pan = Math.sin(precessionAngle * 2);
      if (isFinite(pan)) voice.panner.pan.setTargetAtTime(pan, now, 0.1);
      
      const filterFreq = 400 + Math.pow(speedRatio, 2) * 8000;
      if (isFinite(filterFreq)) voice.filter.frequency.setTargetAtTime(filterFreq, now, 0.05);
    }
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    if (masterVolumeRef.current && audioContextRef.current) {
        masterVolumeRef.current.gain.setTargetAtTime(volume, audioContextRef.current.currentTime, 0.02);
    }
  }, []);

  const setReverb = useCallback((amount: number) => {
    if (reverbWetGainRef.current && audioContextRef.current) {
        reverbWetGainRef.current.gain.setTargetAtTime(amount, audioContextRef.current.currentTime, 0.02);
    }
  }, []);
  
  const loadSample = useCallback(async (file: File) => {
    const context = audioContextRef.current;
    if (!context) return;
    try {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        customSampleBufferRef.current = audioBuffer;
        setIsSampleLoaded(true);

        for (const id in voicesRef.current) {
          const voice = voicesRef.current[id];
          const newSource = context.createBufferSource();
          newSource.buffer = audioBuffer;
          newSource.loop = true;
          
          if(voice.type === 'sample') voice.sampleSource.disconnect();
          voice.sampleSource = newSource;
          voice.sampleSource.start();

          if (synthTypeRef.current === 'sample') {
            setVoiceType(voice, 'sample');
          }
        }
    } catch (e) {
        console.error("Error loading audio sample:", e);
        setIsSampleLoaded(false);
    }
  }, []);

  const testAudio = useCallback(() => {
    const context = audioContextRef.current;
    if (!isInitialized || !masterVolumeRef.current || !context) return;
    if (context.state === 'suspended') context.resume();

    const now = context.currentTime;
    const testGain = context.createGain();
    testGain.connect(masterVolumeRef.current);
    testGain.gain.setValueAtTime(0.7, now);
    testGain.gain.setTargetAtTime(0, now + 0.1, 0.2);

    const currentType = synthTypeRef.current;
    if (currentType === 'sample' && isSampleLoaded && customSampleBufferRef.current) {
      const testSample = context.createBufferSource();
      testSample.buffer = customSampleBufferRef.current;
      testSample.connect(testGain);
      testSample.start(now);
      testSample.stop(now+1);
    } else if (currentType !== 'noise') {
      const testOsc = context.createOscillator();
      testOsc.type = currentType as OscillatorType;
      testOsc.frequency.setValueAtTime(440, now);
      testOsc.connect(testGain);
      testOsc.start(now);
      testOsc.stop(now + 1);
    } else { // Noise
      const testNoise = context.createBufferSource();
      const bufferSize = context.sampleRate * 0.5;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
      }
      testNoise.buffer = buffer;
      testNoise.connect(testGain);
      testNoise.start(now);
      testNoise.stop(now + 0.5);
    }
  }, [isInitialized, isSampleLoaded]);

  const startRecording = useCallback(() => {
    if (!destinationNodeRef.current) return;
    mediaRecorderRef.current = new MediaRecorder(destinationNodeRef.current.stream);
    recordedChunksRef.current = [];
    
    mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
        }
    };
    
    mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
a.style.display = 'none';
        a.href = url;
        a.download = `terraphone-recording-${new Date().toISOString()}.wav`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    };
    
    mediaRecorderRef.current.start();
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
  }, []);

  return { initAudio, addPendulumAudio, removePendulumAudio, updateAudio, setSynthType, setMasterVolume, setReverb, testAudio, loadSample, isSampleLoaded, isInitialized, startRecording, stopRecording };
};