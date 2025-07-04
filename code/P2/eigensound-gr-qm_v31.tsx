import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Info, Download, Upload, Mic } from 'lucide-react';

const EigensoundGRQM = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState('quantum');
  const [showInfo, setShowInfo] = useState(false);
  const [activePreset, setActivePreset] = useState('custom');
  const [normalizationMode, setNormalizationMode] = useState('adaptive');
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [visualizationData, setVisualizationData] = useState({
    waveform: new Array(128).fill(0),
    spectrum: new Array(64).fill(0),
    quantumState: { uncertainty: 0, coherence: 0, entanglement: 0 },
    relativisticState: { curvature: 0, dilation: 0, redshift: 0 }
  });
  
  // Quantum parameters
  const [quantumParams, setQuantumParams] = useState({
    uncertainty: 0.5,
    coherence: 0.8,
    entanglement: 0.3,
    wavePacketWidth: 0.6
  });
  
  // Relativity parameters
  const [grParams, setGRParams] = useState({
    curvature: 0.4,
    timeDialation: 0.2,
    redshift: 0.3,
    horizonEffect: 0.5
  });
  
  // Sound parameters
  const [soundParams, setSoundParams] = useState({
    baseFreq: 440,
    harmonics: 3,
    amplitude: 0.5,
    filterQ: 10
  });
  
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const volumeHistoryRef = useRef(new Array(100).fill(0));
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingStartTimeRef = useRef(0);
  const recordingIntervalRef = useRef(null);
  const destinationNodeRef = useRef(null);
  
  // Preset configurations
  const presets = {
    'custom': {
      name: 'Custom',
      description: 'Design your own quantum-relativistic soundscape',
      quantum: { uncertainty: 0.5, coherence: 0.8, entanglement: 0.3, wavePacketWidth: 0.6 },
      gr: { curvature: 0.4, timeDialation: 0.2, redshift: 0.3, horizonEffect: 0.5 },
      sound: { baseFreq: 440, harmonics: 3, amplitude: 0.5, filterQ: 10 }
    },
    'heisenberg': {
      name: 'Heisenberg Uncertainty',
      description: 'High uncertainty creates chaotic, unpredictable sound patterns',
      quantum: { uncertainty: 0.9, coherence: 0.4, entanglement: 0.1, wavePacketWidth: 0.3 },
      gr: { curvature: 0.1, timeDialation: 0.05, redshift: 0.05, horizonEffect: 0.1 },
      sound: { baseFreq: 660, harmonics: 5, amplitude: 0.6, filterQ: 5 }
    },
    'schrodinger': {
      name: 'Schrödinger Superposition',
      description: 'Quantum superposition creates interference patterns in sound',
      quantum: { uncertainty: 0.5, coherence: 0.9, entanglement: 0.7, wavePacketWidth: 0.8 },
      gr: { curvature: 0.1, timeDialation: 0.02, redshift: 0.02, horizonEffect: 0.05 },
      sound: { baseFreq: 330, harmonics: 4, amplitude: 0.4, filterQ: 15 }
    },
    'epr': {
      name: 'EPR Entanglement',
      description: 'Spooky action at a distance - harmonics respond instantaneously',
      quantum: { uncertainty: 0.3, coherence: 0.95, entanglement: 0.95, wavePacketWidth: 0.7 },
      gr: { curvature: 0.05, timeDialation: 0.01, redshift: 0.01, horizonEffect: 0.02 },
      sound: { baseFreq: 220, harmonics: 6, amplitude: 0.45, filterQ: 20 }
    },
    'blackhole': {
      name: 'Black Hole Horizon',
      description: 'Extreme redshift and time dilation near the event horizon',
      quantum: { uncertainty: 0.2, coherence: 0.6, entanglement: 0.2, wavePacketWidth: 0.5 },
      gr: { curvature: 0.9, timeDialation: 0.8, redshift: 0.9, horizonEffect: 0.95 },
      sound: { baseFreq: 110, harmonics: 2, amplitude: 0.3, filterQ: 8 }
    },
    'gravitational': {
      name: 'Gravitational Waves',
      description: 'Spacetime ripples create periodic frequency modulation',
      quantum: { uncertainty: 0.1, coherence: 0.8, entanglement: 0.1, wavePacketWidth: 0.9 },
      gr: { curvature: 0.7, timeDialation: 0.4, redshift: 0.3, horizonEffect: 0.2 },
      sound: { baseFreq: 880, harmonics: 3, amplitude: 0.55, filterQ: 12 }
    },
    'decoherence': {
      name: 'Quantum Decoherence',
      description: 'Watch quantum coherence decay in real-time',
      quantum: { uncertainty: 0.6, coherence: 0.3, entanglement: 0.4, wavePacketWidth: 0.4 },
      gr: { curvature: 0.2, timeDialation: 0.1, redshift: 0.1, horizonEffect: 0.15 },
      sound: { baseFreq: 523, harmonics: 4, amplitude: 0.5, filterQ: 6 }
    },
    'planck': {
      name: 'Planck Scale',
      description: 'Where quantum and gravitational effects become comparable',
      quantum: { uncertainty: 0.8, coherence: 0.5, entanglement: 0.6, wavePacketWidth: 0.2 },
      gr: { curvature: 0.8, timeDialation: 0.6, redshift: 0.7, horizonEffect: 0.8 },
      sound: { baseFreq: 1760, harmonics: 8, amplitude: 0.7, filterQ: 25 }
    },
    'cosmic': {
      name: 'Cosmic Ambient',
      description: 'Slow-evolving, space-like textures for meditation',
      quantum: { uncertainty: 0.3, coherence: 0.9, entanglement: 0.5, wavePacketWidth: 1.2 },
      gr: { curvature: 0.3, timeDialation: 0.5, redshift: 0.4, horizonEffect: 0.3 },
      sound: { baseFreq: 110, harmonics: 2, amplitude: 0.3, filterQ: 30 }
    },
    'glitch': {
      name: 'Quantum Glitch',
      description: 'Rapid uncertainty-driven textural changes',
      quantum: { uncertainty: 0.95, coherence: 0.1, entanglement: 0.8, wavePacketWidth: 0.1 },
      gr: { curvature: 0.6, timeDialation: 0.2, redshift: 0.4, horizonEffect: 0.7 },
      sound: { baseFreq: 1320, harmonics: 7, amplitude: 0.8, filterQ: 3 }
    }
  };
  
  // Volume normalization strategies
  const normalizeVolume = useCallback((amplitudes, mode) => {
    const maxAmp = Math.max(...amplitudes);
    const rms = Math.sqrt(amplitudes.reduce((sum, amp) => sum + amp * amp, 0) / amplitudes.length);
    const avgAmp = amplitudes.reduce((sum, amp) => sum + Math.abs(amp), 0) / amplitudes.length;
    
    switch (mode) {
      case 'peak':
        return maxAmp > 0 ? amplitudes.map(amp => amp / maxAmp) : amplitudes;
      case 'rms':
        return rms > 0 ? amplitudes.map(amp => amp / (rms * 3)) : amplitudes;
      case 'adaptive':
        const target = Math.max(avgAmp, 0.1);
        return amplitudes.map(amp => amp / (target * 2));
      case 'compressor':
        const threshold = 0.7;
        return amplitudes.map(amp => {
          const absAmp = Math.abs(amp);
          if (absAmp > threshold) {
            const ratio = 0.3;
            const compressed = threshold + (absAmp - threshold) * ratio;
            return Math.sign(amp) * compressed;
          }
          return amp;
        });
      default:
        return amplitudes;
    }
  }, []);

  // Enhanced quantum wavefunction with better physics
  const quantumWaveFunction = useCallback((t, x) => {
    const { uncertainty, coherence, wavePacketWidth } = quantumParams;
    const k = 2 * Math.PI / Math.max(wavePacketWidth, 0.1);
    const sigma = Math.max(uncertainty * 0.5, 0.01);
    
    // Gaussian wave packet with quantum uncertainty
    const envelope = Math.exp(-Math.pow(x - t * 0.1, 2) / (2 * sigma * sigma));
    const wave = Math.cos(k * x - 2 * Math.PI * t * 0.1);
    const coherenceFactor = Math.exp(-t * (1 - coherence) * 0.01);
    
    // Add quantum fluctuations
    const quantumNoise = (Math.random() - 0.5) * uncertainty * 0.1;
    
    return envelope * wave * coherenceFactor + quantumNoise;
  }, [quantumParams]);
  
  // Relativistic spacetime curvature effect
  const relativisticEffect = useCallback((t, freq) => {
    const { curvature, timeDialation, redshift } = grParams;
    
    // Simulate gravitational time dilation
    const dilationFactor = 1 - timeDialation * 0.1;
    const adjustedTime = t * dilationFactor;
    
    // Gravitational redshift
    const redshiftFactor = 1 - redshift * 0.1;
    const adjustedFreq = freq * redshiftFactor;
    
    // Spacetime curvature creates frequency modulation
    const curvatureModulation = Math.sin(adjustedTime * 0.05) * curvature * 0.1;
    
    return {
      frequency: adjustedFreq * (1 + curvatureModulation),
      timeScale: dilationFactor
    };
  }, [grParams]);
  
  // Combined quantum-relativistic sound synthesis with improved stability
  const synthesizeSound = useCallback(() => {
    if (!audioContextRef.current || !isPlaying) return;
    
    const currentTime = audioContextRef.current.currentTime;
    timeRef.current += 0.016; // ~60fps update rate
    
    // Clear existing oscillators more efficiently
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop(currentTime);
      } catch (e) {
        // Oscillator already stopped
      }
    });
    oscillatorsRef.current = [];
    
    const { baseFreq, harmonics } = soundParams;
    const amplitudes = [];
    
    // Generate harmonics with quantum and relativistic effects
    for (let i = 1; i <= harmonics; i++) {
      const harmonic = Math.max(baseFreq * i, 20); // Prevent sub-audio frequencies
      
      // Apply quantum uncertainty to amplitude
      const quantumAmp = Math.abs(quantumWaveFunction(timeRef.current, i));
      
      // Apply relativistic effects to frequency
      const { frequency: relFreq } = relativisticEffect(timeRef.current, harmonic);
      const safeFreq = Math.min(Math.max(relFreq, 20), 20000); // Audio range limits
      
      // Create oscillator with error handling
      try {
        const osc = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        osc.frequency.setValueAtTime(safeFreq, currentTime);
        osc.type = 'sine';
        
        // Quantum entanglement effect - correlate harmonics
        const entanglementPhase = quantumParams.entanglement * i * Math.PI / 4;
        const entanglementAmp = quantumAmp * (1 + 0.3 * Math.sin(timeRef.current + entanglementPhase));
        
        amplitudes.push(entanglementAmp);
        
        // Apply normalization
        const normalizedAmps = normalizeVolume([entanglementAmp], normalizationMode);
        const finalAmp = Math.max(0, Math.min(1, normalizedAmps[0] * 0.15 * masterVolume));
        
        gainNode.gain.setValueAtTime(finalAmp, currentTime);
        
        osc.connect(gainNode);
        gainNode.connect(filterNodeRef.current);
        
        osc.start(currentTime);
        osc.stop(currentTime + 0.1); // Prevent accumulation
        oscillatorsRef.current.push(osc);
      } catch (e) {
        console.warn('Audio synthesis error:', e);
      }
    }
    
    // Update volume history for adaptive normalization
    const avgAmplitude = amplitudes.reduce((sum, amp) => sum + Math.abs(amp), 0) / amplitudes.length;
    volumeHistoryRef.current.push(avgAmplitude);
    if (volumeHistoryRef.current.length > 100) {
      volumeHistoryRef.current.shift();
    }
    
    // Update visualization data
    updateVisualizationData(amplitudes);
  }, [isPlaying, quantumParams, grParams, soundParams, quantumWaveFunction, relativisticEffect, normalizeVolume, normalizationMode, masterVolume]);
  
  // Update visualization data
  const updateVisualizationData = useCallback((amplitudes) => {
    if (!analyserNodeRef.current) return;
    
    const bufferLength = analyserNodeRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const waveformArray = new Float32Array(analyserNodeRef.current.fftSize);
    
    analyserNodeRef.current.getByteFrequencyData(dataArray);
    analyserNodeRef.current.getFloatTimeDomainData(waveformArray);
    
    // Process waveform for visualization (downsample)
    const waveform = [];
    const step = Math.floor(waveformArray.length / 128);
    for (let i = 0; i < 128; i++) {
      waveform.push(waveformArray[i * step] || 0);
    }
    
    // Process frequency spectrum (downsample)
    const spectrum = [];
    const freqStep = Math.floor(dataArray.length / 64);
    for (let i = 0; i < 64; i++) {
      spectrum.push((dataArray[i * freqStep] || 0) / 255);
    }
    
    // Calculate current physics state for visualization
    const quantumState = {
      uncertainty: quantumParams.uncertainty,
      coherence: quantumParams.coherence * Math.exp(-timeRef.current * (1 - quantumParams.coherence) * 0.005),
      entanglement: quantumParams.entanglement
    };
    
    const relativisticState = {
      curvature: grParams.curvature,
      dilation: 1 - grParams.timeDialation * 0.1,
      redshift: 1 - grParams.redshift * 0.1
    };
    
    setVisualizationData({
      waveform,
      spectrum,
      quantumState,
      relativisticState
    });
  }, [quantumParams, grParams]);
  
  // Initialize audio context with analyzer
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create analyzer for visualization
      analyserNodeRef.current = audioContextRef.current.createAnalyser();
      analyserNodeRef.current.fftSize = 1024;
      analyserNodeRef.current.smoothingTimeConstant = 0.8;
      
      // Create filter for spectral shaping
      filterNodeRef.current = audioContextRef.current.createBiquadFilter();
      filterNodeRef.current.type = 'bandpass';
      filterNodeRef.current.frequency.value = 1000;
      filterNodeRef.current.Q.value = soundParams.filterQ;
      
      // Create master gain
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = masterVolume;
      
      // Connect audio graph: filter -> analyzer -> gain -> destination
      filterNodeRef.current.connect(analyserNodeRef.current);
      analyserNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
    
    return () => {
      // Cleanup
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (recordedAudio) {
        URL.revokeObjectURL(recordedAudio);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Animation loop
  useEffect(() => {
    const animate = () => {
      synthesizeSound();
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (isPlaying) {
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, synthesizeSound]);
  
  // Update audio parameters with better error handling
  useEffect(() => {
    try {
      if (filterNodeRef.current) {
        filterNodeRef.current.frequency.setValueAtTime(
          Math.max(soundParams.baseFreq * 2, 80), 
          audioContextRef.current?.currentTime || 0
        );
        filterNodeRef.current.Q.setValueAtTime(
          Math.max(soundParams.filterQ, 0.1), 
          audioContextRef.current?.currentTime || 0
        );
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(
          Math.max(0, Math.min(1, masterVolume)), 
          audioContextRef.current?.currentTime || 0
        );
      }
    } catch (error) {
      console.warn('Audio parameter update failed:', error);
    }
  }, [soundParams, masterVolume]);
  
  const togglePlay = () => {
    try {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Play/pause failed:', error);
    }
  };
  
  const resetParams = () => {
    setQuantumParams({
      uncertainty: 0.5,
      coherence: 0.8,
      entanglement: 0.3,
      wavePacketWidth: 0.6
    });
    setGRParams({
      curvature: 0.4,
      timeDialation: 0.2,
      redshift: 0.3,
      horizonEffect: 0.5
    });
    setSoundParams({
      baseFreq: 440,
      harmonics: 3,
      amplitude: 0.5,
      filterQ: 10
    });
    setActivePreset('custom');
    timeRef.current = 0;
  };
  
  const loadPreset = (presetKey) => {
    const preset = presets[presetKey];
    if (!preset) return;
    
    setQuantumParams(preset.quantum);
    setGRParams(preset.gr);
    setSoundParams(preset.sound);
    setActivePreset(presetKey);
    timeRef.current = 0;
  };
  
  // Audio recording functionality
  const startRecording = async () => {
    try {
      if (!audioContextRef.current) return;
      
      // Create media stream destination for recording
      destinationNodeRef.current = audioContextRef.current.createMediaStreamDestination();
      gainNodeRef.current.connect(destinationNodeRef.current);
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(destinationNodeRef.current.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      recordedChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudio(audioUrl);
        
        // Disconnect recording destination
        if (destinationNodeRef.current) {
          gainNodeRef.current.disconnect(destinationNodeRef.current);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();
      
      // Update recording duration
      recordingIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000;
        setRecordingDuration(elapsed);
      }, 100);
      
    } catch (error) {
      console.error('Recording failed:', error);
      alert('Recording failed. Please ensure microphone permissions are granted.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };
  
  const downloadRecording = () => {
    if (recordedAudio) {
      const link = document.createElement('a');
      link.href = recordedAudio;
      link.download = `eigensound-${activePreset}-${new Date().toISOString().slice(0, 19)}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Preset export/import functionality
  const exportPreset = () => {
    const presetData = {
      name: activePreset === 'custom' ? 'Custom Export' : presets[activePreset]?.name || 'Custom',
      description: activePreset === 'custom' ? 'User customized settings' : presets[activePreset]?.description || '',
      quantum: quantumParams,
      gr: grParams,
      sound: soundParams,
      normalization: normalizationMode,
      volume: masterVolume,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(presetData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `eigensound-preset-${presetData.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const importPreset = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const presetData = JSON.parse(e.target.result);
        
        // Validate preset structure
        if (!presetData.quantum || !presetData.gr || !presetData.sound) {
          throw new Error('Invalid preset format');
        }
        
        // Load preset data
        setQuantumParams(presetData.quantum);
        setGRParams(presetData.gr);
        setSoundParams(presetData.sound);
        
        if (presetData.normalization) {
          setNormalizationMode(presetData.normalization);
        }
        if (presetData.volume !== undefined) {
          setMasterVolume(presetData.volume);
        }
        
        setActivePreset('custom');
        timeRef.current = 0;
        
        alert(`Preset "${presetData.name}" loaded successfully!`);
        
      } catch (error) {
        console.error('Preset import failed:', error);
        alert('Failed to import preset. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };
  
  // Waveform visualization component
  const WaveformDisplay = ({ data, title, color }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !data) return;
      
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      
      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, width, height);
      
      // Draw waveform
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const sliceWidth = width / data.length;
      let x = 0;
      
      for (let i = 0; i < data.length; i++) {
        const v = Math.max(-1, Math.min(1, data[i]));
        const y = (v * height / 2) + height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.stroke();
      
      // Draw center line
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      
      // Add title
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '12px monospace';
      ctx.fillText(title, 10, 20);
      
    }, [data, title, color]);
    
    return <canvas ref={canvasRef} width={300} height={120} className="bg-gray-800 rounded" />;
  };
  
  // Spectrum analyzer component
  const SpectrumDisplay = ({ data, title, color }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !data) return;
      
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      
      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, width, height);
      
      // Draw spectrum bars
      const barWidth = width / data.length;
      
      for (let i = 0; i < data.length; i++) {
        const barHeight = Math.max(0, data[i] * height);
        const hue = (i / data.length) * 240; // Blue to red spectrum
        
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
      }
      
      // Add title
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '12px monospace';
      ctx.fillText(title, 10, 20);
      
    }, [data, title, color]);
    
    return <canvas ref={canvasRef} width={300} height={120} className="bg-gray-800 rounded" />;
  };
  
  const InfoPanel = () => (
    <div className="bg-gray-900 text-white p-4 rounded-lg space-y-3 text-sm">
      <h3 className="font-bold text-lg">Eigensound GR/QM Concepts</h3>
      <div className="space-y-2">
        <div>
          <strong>Quantum Mode:</strong> Uncertainty principle affects amplitude modulation. 
          Higher uncertainty creates more chaotic sound patterns. Coherence determines how 
          long quantum states maintain their phase relationships.
        </div>
        <div>
          <strong>Entanglement:</strong> Correlates harmonic frequencies - changing one 
          affects others instantaneously, demonstrating quantum non-locality through sound.
        </div>
        <div>
          <strong>Relativistic Effects:</strong> Gravitational time dilation slows the 
          temporal evolution. Redshift lowers frequencies as if sounds are climbing out 
          of a gravitational well.
        </div>
        <div>
          <strong>Spacetime Curvature:</strong> Creates frequency modulation, simulating 
          how curved spacetime affects wave propagation.
        </div>
        <div>
          <strong>Recording:</strong> Capture your quantum-relativistic soundscapes. 
          Click Record while playing to save the generated audio.
        </div>
        <div>
          <strong>Presets:</strong> Export your custom settings or import presets 
          from other users. Share your physics-based compositions!
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Eigensound GR/QM
          </h1>
          <p className="text-lg text-gray-300">
            Quantum-Relativistic Sound Synthesis Explorer
          </p>
        </div>
        
        {/* Control Panel */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={!isPlaying && !isRecording}
              >
                <Mic size={20} />
                {isRecording ? `Recording ${recordingDuration.toFixed(1)}s` : 'Record'}
              </button>
              <button
                onClick={resetParams}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
            <div className="flex items-center gap-4">
              {recordedAudio && (
                <button
                  onClick={downloadRecording}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              )}
              <button
                onClick={exportPreset}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Download size={16} />
                Export
              </button>
              <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm">
                <Upload size={16} />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importPreset}
                  className="hidden"
                />
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Volume:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-xs text-gray-400 w-8">{Math.round(masterVolume * 100)}%</span>
              </div>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Info size={20} />
                Info
              </button>
            </div>
          </div>
          
          {/* Mode Selection */}
          <div className="flex gap-2 mb-4">
            {['quantum', 'relativistic', 'combined'].map(mode => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeMode === mode 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Preset Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Physics Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => loadPreset(key)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    activePreset === key 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
            {activePreset !== 'custom' && (
              <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">{presets[activePreset].name}:</strong> {presets[activePreset].description}
                </p>
              </div>
            )}
          </div>
          
          {/* Normalization Controls */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Volume Normalization</h3>
            <div className="flex gap-2">
              {[
                { key: 'peak', name: 'Peak', desc: 'Normalize to highest peak' },
                { key: 'rms', name: 'RMS', desc: 'Root mean square normalization' },
                { key: 'adaptive', name: 'Adaptive', desc: 'Smart volume adaptation' },
                { key: 'compressor', name: 'Compressor', desc: 'Dynamic range compression' }
              ].map(norm => (
                <button
                  key={norm.key}
                  onClick={() => setNormalizationMode(norm.key)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    normalizationMode === norm.key 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title={norm.desc}
                >
                  {norm.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {showInfo && <InfoPanel />}
        
        {/* Recording Status and Playback */}
        {recordedAudio && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-lg mb-3 text-green-400">Recorded Audio</h3>
            <div className="flex items-center gap-4">
              <audio controls src={recordedAudio} className="flex-1">
                Your browser does not support the audio element.
              </audio>
              <button
                onClick={downloadRecording}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={20} />
                Download Recording
              </button>
              <button
                onClick={() => {
                  URL.revokeObjectURL(recordedAudio);
                  setRecordedAudio(null);
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Real-time Visualizations */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-4 text-white">Real-time Physics Visualization</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <WaveformDisplay 
              data={visualizationData.waveform} 
              title="Quantum Waveform" 
              color="#22d3ee" 
            />
            <SpectrumDisplay 
              data={visualizationData.spectrum} 
              title="Frequency Spectrum" 
              color="#f59e0b" 
            />
          </div>
          
          {/* Physics State Indicators */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded p-3">
              <h4 className="font-semibold text-cyan-400 mb-2">Quantum State</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs">Uncertainty:</div>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${visualizationData.quantumState.uncertainty * 100}%` }}
                    />
                  </div>
                  <div className="text-xs w-8">{Math.round(visualizationData.quantumState.uncertainty * 100)}%</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs">Coherence:</div>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${visualizationData.quantumState.coherence * 100}%` }}
                    />
                  </div>
                  <div className="text-xs w-8">{Math.round(visualizationData.quantumState.coherence * 100)}%</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs">Entanglement:</div>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${visualizationData.quantumState.entanglement * 100}%` }}
                    />
                  </div>
                  <div className="text-xs w-8">{Math.round(visualizationData.quantumState.entanglement * 100)}%</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded p-3">
              <h4 className="font-semibold text-orange-400 mb-2">Relativistic State</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs">Curvature:</div>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${visualizationData.relativisticState.curvature * 100}%` }}
                    />
                  </div>
                  <div className="text-xs w-8">{Math.round(visualizationData.relativisticState.curvature * 100)}%</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs">Time Factor:</div>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${visualizationData.relativisticState.dilation * 100}%` }}
                    />
                  </div>
                  <div className="text-xs w-8">{visualizationData.relativisticState.dilation.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs">Redshift:</div>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${visualizationData.relativisticState.redshift * 100}%` }}
                    />
                  </div>
                  <div className="text-xs w-8">{visualizationData.relativisticState.redshift.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Parameter Controls */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Quantum Parameters */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 text-cyan-400">Quantum Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Uncertainty (ℏ)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={quantumParams.uncertainty}
                  onChange={(e) => {
                    setQuantumParams(prev => ({...prev, uncertainty: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{quantumParams.uncertainty.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Coherence Time</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={quantumParams.coherence}
                  onChange={(e) => {
                    setQuantumParams(prev => ({...prev, coherence: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{quantumParams.coherence.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Entanglement</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={quantumParams.entanglement}
                  onChange={(e) => {
                    setQuantumParams(prev => ({...prev, entanglement: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{quantumParams.entanglement.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Wave Packet Width</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.01"
                  value={quantumParams.wavePacketWidth}
                  onChange={(e) => {
                    setQuantumParams(prev => ({...prev, wavePacketWidth: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{quantumParams.wavePacketWidth.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Relativistic Parameters */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 text-orange-400">Relativistic Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Spacetime Curvature</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={grParams.curvature}
                  onChange={(e) => {
                    setGRParams(prev => ({...prev, curvature: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{grParams.curvature.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Time Dilation</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={grParams.timeDialation}
                  onChange={(e) => {
                    setGRParams(prev => ({...prev, timeDialation: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{grParams.timeDialation.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Gravitational Redshift</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={grParams.redshift}
                  onChange={(e) => {
                    setGRParams(prev => ({...prev, redshift: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{grParams.redshift.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Event Horizon Effect</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={grParams.horizonEffect}
                  onChange={(e) => {
                    setGRParams(prev => ({...prev, horizonEffect: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{grParams.horizonEffect.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Sound Parameters */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3 text-green-400">Sound Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Base Frequency (Hz)</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="10"
                  value={soundParams.baseFreq}
                  onChange={(e) => {
                    setSoundParams(prev => ({...prev, baseFreq: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{soundParams.baseFreq}Hz</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Harmonics</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={soundParams.harmonics}
                  onChange={(e) => {
                    setSoundParams(prev => ({...prev, harmonics: parseInt(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{soundParams.harmonics}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amplitude</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={soundParams.amplitude}
                  onChange={(e) => {
                    setSoundParams(prev => ({...prev, amplitude: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{soundParams.amplitude.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Filter Q</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={soundParams.filterQ}
                  onChange={(e) => {
                    setSoundParams(prev => ({...prev, filterQ: parseFloat(e.target.value)}));
                    setActivePreset('custom');
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{soundParams.filterQ}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EigensoundGRQM;