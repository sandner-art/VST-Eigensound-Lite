import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Info } from 'lucide-react';

const EigensoundGRQM = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState('quantum');
  const [showInfo, setShowInfo] = useState(false);
  const [activePreset, setActivePreset] = useState('custom');
  
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
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  
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
  
  // Quantum wavefunction simulation
  const quantumWaveFunction = useCallback((t, x) => {
    const { uncertainty, coherence, wavePacketWidth } = quantumParams;
    const k = 2 * Math.PI / wavePacketWidth;
    const sigma = uncertainty * 0.5;
    
    // Gaussian wave packet with quantum uncertainty
    const envelope = Math.exp(-Math.pow(x - t * 0.1, 2) / (2 * sigma * sigma));
    const wave = Math.cos(k * x - 2 * Math.PI * t * 0.1);
    const coherenceFactor = Math.exp(-t * (1 - coherence) * 0.01);
    
    return envelope * wave * coherenceFactor;
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
  
  // Combined quantum-relativistic sound synthesis
  const synthesizeSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const currentTime = audioContextRef.current.currentTime;
    timeRef.current += 0.01;
    
    // Clear existing oscillators
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
    
    if (!isPlaying) return;
    
    const { baseFreq, harmonics } = soundParams;
    
    // Generate harmonics with quantum and relativistic effects
    for (let i = 1; i <= harmonics; i++) {
      const harmonic = baseFreq * i;
      
      // Apply quantum uncertainty to amplitude
      const quantumAmp = Math.abs(quantumWaveFunction(timeRef.current, i));
      
      // Apply relativistic effects to frequency
      const { frequency: relFreq } = relativisticEffect(timeRef.current, harmonic);
      
      // Create oscillator
      const osc = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      osc.frequency.setValueAtTime(relFreq, currentTime);
      osc.type = 'sine';
      
      // Quantum entanglement effect - correlate harmonics
      const entanglementPhase = quantumParams.entanglement * i * Math.PI / 4;
      const entanglementAmp = quantumAmp * (1 + 0.3 * Math.sin(timeRef.current + entanglementPhase));
      
      gainNode.gain.setValueAtTime(entanglementAmp * 0.1, currentTime);
      
      osc.connect(gainNode);
      gainNode.connect(filterNodeRef.current);
      
      osc.start();
      oscillatorsRef.current.push(osc);
    }
  }, [isPlaying, quantumParams, grParams, soundParams, quantumWaveFunction, relativisticEffect]);
  
  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create filter for spectral shaping
    filterNodeRef.current = audioContextRef.current.createBiquadFilter();
    filterNodeRef.current.type = 'bandpass';
    filterNodeRef.current.frequency.value = 1000;
    filterNodeRef.current.Q.value = soundParams.filterQ;
    
    // Create master gain
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = soundParams.amplitude;
    
    filterNodeRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);
    
    return () => {
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
  
  // Update audio parameters
  useEffect(() => {
    if (filterNodeRef.current) {
      filterNodeRef.current.frequency.value = soundParams.baseFreq * 2;
      filterNodeRef.current.Q.value = soundParams.filterQ;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = soundParams.amplitude;
    }
  }, [soundParams]);
  
  const togglePlay = () => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsPlaying(!isPlaying);
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
                onClick={resetParams}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Info size={20} />
              Info
            </button>
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
        </div>
        
        {showInfo && <InfoPanel />}
        
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
        
        {/* Visual Feedback */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3">Real-time Physics Visualization</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded p-3">
              <h4 className="font-semibold text-cyan-400 mb-2">Quantum State</h4>
              <div className="text-sm space-y-1">
                <div>Wave Function Collapse: {(quantumParams.uncertainty * 100).toFixed(0)}%</div>
                <div>Coherence Decay: {((1 - quantumParams.coherence) * 100).toFixed(0)}%</div>
                <div>Entanglement Correlation: {(quantumParams.entanglement * 100).toFixed(0)}%</div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded p-3">
              <h4 className="font-semibold text-orange-400 mb-2">Spacetime Metrics</h4>
              <div className="text-sm space-y-1">
                <div>Curvature Tensor: {(grParams.curvature * 100).toFixed(0)}%</div>
                <div>Time Dilation Factor: {(1 - grParams.timeDialation).toFixed(3)}</div>
                <div>Redshift Factor: {(1 - grParams.redshift).toFixed(3)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EigensoundGRQM;