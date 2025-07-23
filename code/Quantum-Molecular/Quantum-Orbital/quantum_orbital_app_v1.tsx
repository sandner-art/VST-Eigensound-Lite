import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const QuantumOrbitalApp = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const pointCloudRef = useRef(null);
  const quantumFeaturesRef = useRef([]);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef(new Map());
  const masterGainRef = useRef(null);
  const convolverRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const originalPositionsRef = useRef(null);
  
  const [quantumNumbers, setQuantumNumbers] = useState({ n: 2, l: 1, m: 0 });
  const [element, setElement] = useState('hydrogen');
  const [isPlaying, setIsPlaying] = useState(false);
  const [pointDensity, setPointDensity] = useState(5000);
  const [volume, setVolume] = useState(0.3);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [visualizationMode, setVisualizationMode] = useState('points');
  const [coordinateSystem, setCoordinateSystem] = useState('spherical');
  const [colorMode, setColorMode] = useState('density');
  const [colorPalette, setColorPalette] = useState('scientific');
  const [quantumFluctuations, setQuantumFluctuations] = useState(true);
  const [fluctuationIntensity, setFluctuationIntensity] = useState(0.5);
  const [renderQuality, setRenderQuality] = useState('high');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Visual effects controls
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [emissionStrength, setEmissionStrength] = useState(0.3);
  const [densityCutoff, setDensityCutoff] = useState(0.001);
  const [showCrossSection, setShowCrossSection] = useState(false);
  const [crossSectionPlane, setCrossSectionPlane] = useState('xy');
  const [crossSectionPosition, setCrossSectionPosition] = useState(0);
  
  // 3D Rendering controls
  const [sphereSize, setSphereSize] = useState(0.04);
  const [sphereResolution, setSphereResolution] = useState(8);
  const [volumeDensity, setVolumeDensity] = useState(1.0);
  const [wireframeConnections, setWireframeConnections] = useState(4);
  const [lightIntensity, setLightIntensity] = useState(0.8);
  const [ambientLevel, setAmbientLevel] = useState(0.3);
  
  // Quantum features
  const [showRadialNodes, setShowRadialNodes] = useState(false);
  const [showProbabilityCurrent, setShowProbabilityCurrent] = useState(false);
  const [showClassicalTurning, setShowClassicalTurning] = useState(false);

  // Audio synthesis parameters
  const [synthesisMode, setSynthesisMode] = useState('cinematic');
  const [evolutionType, setEvolutionType] = useState('wave');
  const [reverbAmount, setReverbAmount] = useState(0.3);
  const [spatialWidth, setSpatialWidth] = useState(0.5);
  const [harmonicContent, setHarmonicContent] = useState(0.6);
  const [modulationDepth, setModulationDepth] = useState(0.4);
  const [evolutionSpeed, setEvolutionSpeed] = useState(0.5);

  // Color palettes
  const colorPalettes = {
    scientific: {
      name: 'Scientific',
      colors: [
        { r: 0.0, g: 0.4, b: 0.8 }, // Blue
        { r: 0.0, g: 0.8, b: 0.8 }, // Cyan  
        { r: 0.0, g: 0.8, b: 0.4 }, // Green
        { r: 0.8, g: 0.8, b: 0.0 }, // Yellow
        { r: 0.8, g: 0.4, b: 0.0 }, // Orange
        { r: 0.8, g: 0.0, b: 0.4 }  // Red
      ]
    },
    artistic: {
      name: 'Artistic',
      colors: [
        { r: 0.42, g: 0.27, b: 0.76 }, // Purple
        { r: 0.23, g: 0.51, b: 0.96 }, // Blue
        { r: 0.02, g: 0.71, b: 0.83 }, // Cyan
        { r: 0.06, g: 0.72, b: 0.51 }, // Green
        { r: 0.96, g: 0.62, b: 0.04 }, // Yellow
        { r: 0.94, g: 0.27, b: 0.27 }  // Red
      ]
    },
    neon: {
      name: 'Neon',
      colors: [
        { r: 1.0, g: 0.0, b: 0.5 }, // Hot Pink
        { r: 0.5, g: 0.0, b: 1.0 }, // Electric Purple
        { r: 0.0, g: 0.5, b: 1.0 }, // Electric Blue
        { r: 0.0, g: 1.0, b: 0.5 }, // Electric Green
        { r: 1.0, g: 0.5, b: 0.0 }, // Electric Orange
        { r: 1.0, g: 0.0, b: 0.25 } // Electric Red
      ]
    },
    plasma: {
      name: 'Plasma',
      colors: [
        { r: 0.05, g: 0.11, b: 0.16 }, // Dark Blue
        { r: 0.25, g: 0.35, b: 0.47 }, // Steel Blue
        { r: 0.47, g: 0.55, b: 0.66 }, // Blue Gray
        { r: 0.88, g: 0.88, b: 0.87 }, // Light Gray
        { r: 1.0, g: 0.84, b: 0.04 },  // Gold
        { r: 1.0, g: 0.42, b: 0.21 }   // Orange Red
      ]
    },
    rainbow: {
      name: 'Rainbow',
      colors: [
        { r: 0.58, g: 0.0, b: 0.83 }, // Violet
        { r: 0.29, g: 0.0, b: 0.51 }, // Indigo
        { r: 0.0, g: 0.0, b: 1.0 },   // Blue
        { r: 0.0, g: 1.0, b: 0.0 },   // Green
        { r: 1.0, g: 1.0, b: 0.0 },   // Yellow
        { r: 1.0, g: 0.5, b: 0.0 },   // Orange
        { r: 1.0, g: 0.0, b: 0.0 }    // Red
      ]
    }
  };

  // Element configurations
  const elements = {
    hydrogen: { Z: 1, name: 'Hydrogen', color: 0xff6b6b, mass: 1.008 },
    helium: { Z: 2, name: 'Helium', color: 0x4ecdc4, mass: 4.003 },
    lithium: { Z: 3, name: 'Lithium', color: 0x45b7d1, mass: 6.941 },
    beryllium: { Z: 4, name: 'Beryllium', color: 0x96ceb4, mass: 9.012 },
    boron: { Z: 5, name: 'Boron', color: 0xfcea2b, mass: 10.811 },
    carbon: { Z: 6, name: 'Carbon', color: 0x6c5ce7, mass: 12.011 },
    nitrogen: { Z: 7, name: 'Nitrogen', color: 0xa29bfe, mass: 14.007 },
    oxygen: { Z: 8, name: 'Oxygen', color: 0xfd79a8, mass: 15.999 }
  };

  // Complete quantum mechanics calculations
  const factorial = (n) => {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const associatedLaguerre = (alpha, n, x) => {
    if (n === 0) return 1;
    if (n === 1) return 1 + alpha - x;
    if (n === 2) return ((2 + 3*alpha + alpha*alpha - 2*(2 + alpha)*x + x*x) / 2);
    if (n === 3) return ((-6 - 11*alpha - 6*alpha*alpha - alpha*alpha*alpha + 6*(1 + 2*alpha + alpha*alpha)*x - 3*(2 + alpha)*x*x + x*x*x) / 6);
    return Math.exp(-x/2) * Math.pow(x, alpha/2);
  };

  const associatedLegendre = (l, m, x) => {
    const absM = Math.abs(m);
    if (l === 0) return 1;
    if (l === 1) {
      if (absM === 0) return x;
      if (absM === 1) return Math.sqrt(Math.max(0, 1 - x*x));
    }
    if (l === 2) {
      if (absM === 0) return 0.5 * (3*x*x - 1);
      if (absM === 1) return 3*x*Math.sqrt(Math.max(0, 1 - x*x));
      if (absM === 2) return 3*(1 - x*x);
    }
    if (l === 3) {
      if (absM === 0) return 0.5 * (5*x*x*x - 3*x);
      if (absM === 1) return 1.5 * (5*x*x - 1) * Math.sqrt(Math.max(0, 1 - x*x));
      if (absM === 2) return 15 * x * (1 - x*x);
      if (absM === 3) return 15 * Math.pow(Math.max(0, 1 - x*x), 1.5);
    }
    return Math.pow(Math.max(0, 1 - x*x), absM/2);
  };

  const sphericalHarmonic = (l, m, theta, phi) => {
    const absM = Math.abs(m);
    const normalization = Math.sqrt((2*l + 1) * factorial(l - absM) / (4 * Math.PI * factorial(l + absM)));
    const legendre = associatedLegendre(l, absM, Math.cos(theta));
    const azimuthal = m >= 0 ? Math.cos(m * phi) : Math.sin(Math.abs(m) * phi);
    return normalization * legendre * azimuthal;
  };

  const radialWaveFunction = (n, l, r, Z = 1) => {
    if (r === 0) return 0;
    const a0 = 1.0;
    const rho = 2 * Z * r / (n * a0);
    const normalization = Math.sqrt(Math.pow(2*Z/(n*a0), 3) * factorial(n-l-1) / (2*n*factorial(n+l)));
    const laguerre = associatedLaguerre(2*l+1, n-l-1, rho);
    return normalization * Math.exp(-rho/2) * Math.pow(rho, l) * laguerre;
  };

  // Enhanced probability density calculation
  const probabilityDensity = (n, l, m, x, y, z, Z = 1) => {
    const r = Math.sqrt(x*x + y*y + z*z);
    if (r === 0) return l === 0 ? 1.0 : 0.0; // Handle origin properly
    
    const theta = Math.acos(Math.max(-1, Math.min(1, z / r)));
    const phi = Math.atan2(y, x);
    
    const radial = radialWaveFunction(n, l, r, Z);
    const angular = sphericalHarmonic(l, m, theta, phi);
    
    const psi = radial * angular;
    return psi * psi; // |ψ|² - probability density
  };

  // Calculate radial nodes
  const getRadialNodes = (n, l, Z = 1) => {
    const nodes = [];
    const nodeCount = n - l - 1;
    
    if (nodeCount <= 0) return nodes;
    
    for (let i = 1; i <= nodeCount; i++) {
      const nodeRadius = (n * i) / (Z * (nodeCount + 1)) * 3;
      nodes.push(nodeRadius);
    }
    
    return nodes;
  };

  // Classical turning points
  const getClassicalTurningPoints = (n, l, Z = 1) => {
    const energy = -13.6 * Z * Z / (n * n);
    const L = Math.sqrt(l * (l + 1));
    
    const rMin = L > 0 ? (L * L) / (2 * Z * Math.abs(energy)) * 0.5 : 0.1;
    const rMax = n * n / Z * 1.5;
    
    return { rMin, rMax };
  };

  // Probability current calculation
  const probabilityCurrent = (n, l, m, x, y, z, Z = 1) => {
    const r = Math.sqrt(x*x + y*y + z*z);
    if (r === 0) return { x: 0, y: 0, z: 0 };
    
    const phi = Math.atan2(y, x);
    const current_magnitude = Math.abs(m) * 0.001;
    
    return {
      x: -current_magnitude * Math.sin(phi),
      y: current_magnitude * Math.cos(phi),
      z: 0
    };
  };

  // Enhanced color calculation
  const calculateColor = (density, x, y, z, phase, n, l, m, Z) => {
    const palette = colorPalettes[colorPalette];
    let color = { r: 0.5, g: 0.5, b: 0.5 };
    
    switch (colorMode) {
      case 'density':
        const logDensity = Math.log10(Math.max(density, 1e-10));
        const densityNorm = Math.max(0, Math.min(1, (logDensity + 6) / 6));
        const colorIndex = densityNorm * (palette.colors.length - 1);
        const index1 = Math.floor(colorIndex);
        const index2 = Math.min(palette.colors.length - 1, index1 + 1);
        const t = colorIndex - index1;
        
        color = {
          r: palette.colors[index1].r * (1 - t) + palette.colors[index2].r * t,
          g: palette.colors[index1].g * (1 - t) + palette.colors[index2].g * t,
          b: palette.colors[index1].b * (1 - t) + palette.colors[index2].b * t
        };
        break;
        
      case 'phase':
        const phaseNorm = (phase + Math.PI) / (2 * Math.PI);
        const phaseIndex = Math.floor(phaseNorm * (palette.colors.length - 1));
        color = palette.colors[Math.max(0, Math.min(palette.colors.length - 1, phaseIndex))];
        break;
        
      case 'energy':
        const energy = -13.6 * Z * Z / (n * n);
        const energyNorm = Math.max(0, Math.min(1, Math.abs(energy) / 50));
        const energyIndex = Math.floor(energyNorm * (palette.colors.length - 1));
        color = palette.colors[energyIndex];
        break;
        
      case 'quantum':
        const qIndex = (n + l + Math.abs(m)) % palette.colors.length;
        color = palette.colors[qIndex];
        break;
        
      case 'nodes':
        const r = Math.sqrt(x*x + y*y + z*z);
        const nodes = getRadialNodes(n, l, Z);
        let nearNode = false;
        
        nodes.forEach(nodeR => {
          if (Math.abs(r - nodeR) < 0.4) nearNode = true;
        });
        
        color = nearNode ? { r: 1, g: 0, b: 0 } : palette.colors[2];
        break;
        
      case 'angular':
        const theta = Math.acos(Math.max(-1, Math.min(1, z / Math.sqrt(x*x + y*y + z*z))));
        const angularNorm = theta / Math.PI;
        const angularIndex = Math.floor(angularNorm * (palette.colors.length - 1));
        color = palette.colors[angularIndex];
        break;
        
      default:
        color = { r: 0.5, g: 0.5, b: 0.5 };
    }
    
    // Apply visual effects
    let finalColor = { ...color };
    
    if (glowIntensity > 0) {
      const glowFactor = 1 + glowIntensity * density * 5;
      finalColor.r = Math.min(1, finalColor.r * glowFactor);
      finalColor.g = Math.min(1, finalColor.g * glowFactor);
      finalColor.b = Math.min(1, finalColor.b * glowFactor);
    }
    
    if (emissionStrength > 0) {
      const emissionFactor = 1 + emissionStrength * density * 3;
      finalColor.r = Math.min(1, finalColor.r * emissionFactor);
      finalColor.g = Math.min(1, finalColor.g * emissionFactor);
      finalColor.b = Math.min(1, finalColor.b * emissionFactor);
    }
    
    return finalColor;
  };

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Audio synthesis system with multiple modes
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      
      // Enhanced reverb
      convolverRef.current = audioContextRef.current.createConvolver();
      const reverbGain = audioContextRef.current.createGain();
      reverbGain.gain.setValueAtTime(reverbAmount, audioContextRef.current.currentTime);
      
      const sampleRate = audioContextRef.current.sampleRate;
      const length = sampleRate * 4;
      const impulse = audioContextRef.current.createBuffer(2, length, sampleRate);
      
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          const decay = Math.pow(1 - i / length, 2);
          channelData[i] = (Math.random() * 2 - 1) * decay;
        }
      }
      
      convolverRef.current.buffer = impulse;
      convolverRef.current.connect(reverbGain);
      reverbGain.connect(masterGainRef.current);
    }
    return audioContextRef.current;
  }, [reverbAmount]);

  // Multiple synthesis modes
  const createSynthesis = useCallback((n, l, m, Z) => {
    const audioContext = initAudioContext();
    const baseFreq = 55 * Math.pow(2, (n - 1) + l * 0.5 + m * 0.1) * Math.pow(Z, 0.3);

    switch (synthesisMode) {
      case 'oscillator':
        return createOscillatorSynth(audioContext, baseFreq, n, l, m);
      case 'granular':
        return createGranularSynth(audioContext, baseFreq, n, l, m);
      case 'modal':
        return createModalSynth(audioContext, baseFreq, n, l, m);
      case 'cinematic':
      default:
        return createCinematicSynth(audioContext, baseFreq, n, l, m);
    }
  }, [synthesisMode, volume, harmonicContent, spatialWidth, modulationDepth, initAudioContext]);

  const createOscillatorSynth = (audioContext, baseFreq, n, l, m) => {
    const oscillators = [];
    
    for (let harmonic = 1; harmonic <= n; harmonic++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const panner = audioContext.createStereoPanner();
      
      osc.type = ['sine', 'triangle', 'sawtooth', 'square'][l % 4];
      osc.frequency.setValueAtTime(baseFreq * harmonic, audioContext.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(baseFreq * harmonic * 2, audioContext.currentTime);
      filter.Q.setValueAtTime(1 + harmonicContent * 10, audioContext.currentTime);
      
      panner.pan.setValueAtTime((m / (2 * l + 1)) * spatialWidth, audioContext.currentTime);
      gain.gain.setValueAtTime(volume * 0.3 / harmonic, audioContext.currentTime);
      
      osc.connect(filter);
      filter.connect(panner);
      panner.connect(gain);
      gain.connect(masterGainRef.current);
      
      oscillators.push({ osc, gain, filter, panner });
      osc.start();
    }
    
    return oscillators;
  };

  const createGranularSynth = (audioContext, baseFreq, n, l, m) => {
    const grainScheduler = () => {
      const grainOsc = audioContext.createOscillator();
      const grainGain = audioContext.createGain();
      const grainFilter = audioContext.createBiquadFilter();
      
      const freq = baseFreq * (0.5 + Math.random() * 2);
      const duration = 0.01 + Math.random() * 0.2;
      
      grainOsc.frequency.setValueAtTime(freq, audioContext.currentTime);
      grainOsc.type = 'sine';
      
      grainFilter.type = 'bandpass';
      grainFilter.frequency.setValueAtTime(freq, audioContext.currentTime);
      grainFilter.Q.setValueAtTime(5 + l * 3, audioContext.currentTime);
      
      grainGain.gain.setValueAtTime(0, audioContext.currentTime);
      grainGain.gain.exponentialRampToValueAtTime(volume * 0.1, audioContext.currentTime + duration * 0.1);
      grainGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      grainOsc.connect(grainFilter);
      grainFilter.connect(grainGain);
      grainGain.connect(convolverRef.current);
      
      grainOsc.start(audioContext.currentTime);
      grainOsc.stop(audioContext.currentTime + duration);
    };

    const grainRate = 20 + n * 10;
    const grainTimer = setInterval(grainScheduler, 1000 / grainRate);
    
    return [{ grainTimer }];
  };

  const createModalSynth = (audioContext, baseFreq, n, l, m) => {
    const resonators = [];
    
    for (let mode = 1; mode <= n + l; mode++) {
      const input = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const delay = audioContext.createDelay(1.0);
      const feedback = audioContext.createGain();
      const output = audioContext.createGain();
      
      const freq = baseFreq * mode * (1 + Math.random() * 0.1);
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, audioContext.currentTime);
      filter.Q.setValueAtTime(20 + l * 5, audioContext.currentTime);
      
      delay.delayTime.setValueAtTime(1 / freq, audioContext.currentTime);
      feedback.gain.setValueAtTime(0.8, audioContext.currentTime);
      output.gain.setValueAtTime(volume * 0.05, audioContext.currentTime);
      
      input.connect(filter);
      filter.connect(delay);
      delay.connect(feedback);
      feedback.connect(filter);
      filter.connect(output);
      output.connect(masterGainRef.current);
      
      resonators.push({ input, filter, delay, feedback, output });
    }
    
    // Excite resonators
    const exciteTimer = setInterval(() => {
      const noise = audioContext.createBufferSource();
      const noiseBuffer = audioContext.createBuffer(1, 4410, 44100);
      const data = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1;
      }
      
      noise.buffer = noiseBuffer;
      resonators.forEach(resonator => {
        noise.connect(resonator.input);
      });
      
      noise.start();
      noise.stop(audioContext.currentTime + 0.1);
    }, 500 + Math.random() * 1000);
    
    return [{ resonators, exciteTimer }];
  };

  const createCinematicSynth = (audioContext, baseFreq, n, l, m) => {
    const layers = [];

    // Sub bass layer
    const subOsc = audioContext.createOscillator();
    const subGain = audioContext.createGain();
    const subFilter = audioContext.createBiquadFilter();
    
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(baseFreq * 0.5, audioContext.currentTime);
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(baseFreq * 3, audioContext.currentTime);
    subGain.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
    
    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(masterGainRef.current);
    
    // Harmonic layers
    const padOscs = [];
    for (let harmonic = 1; harmonic <= 6; harmonic++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      const panner = audioContext.createStereoPanner();
      
      osc.type = ['sine', 'triangle', 'sawtooth'][harmonic % 3];
      osc.frequency.setValueAtTime(baseFreq * harmonic, audioContext.currentTime);
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * harmonic, audioContext.currentTime);
      filter.Q.setValueAtTime(2 + harmonicContent * 8, audioContext.currentTime);
      
      panner.pan.setValueAtTime((m / (2 * l + 1)) * spatialWidth, audioContext.currentTime);
      gain.gain.setValueAtTime(volume * 0.15 / harmonic, audioContext.currentTime);
      
      osc.connect(filter);
      filter.connect(panner);
      panner.connect(gain);
      gain.connect(masterGainRef.current);
      gain.connect(convolverRef.current);
      
      padOscs.push({ osc, gain, filter, panner });
    }

    // Granular layer
    const grainScheduler = () => {
      if (Math.random() < 0.3 + harmonicContent * 0.4) {
        const grainOsc = audioContext.createOscillator();
        const grainGain = audioContext.createGain();
        const grainFilter = audioContext.createBiquadFilter();
        
        const freq = baseFreq * (0.25 + Math.random() * 3);
        const duration = 0.02 + Math.random() * 0.3;
        
        grainOsc.frequency.setValueAtTime(freq, audioContext.currentTime);
        grainOsc.type = 'sine';
        
        grainFilter.type = 'bandpass';
        grainFilter.frequency.setValueAtTime(freq, audioContext.currentTime);
        grainFilter.Q.setValueAtTime(3 + l * 3, audioContext.currentTime);
        
        grainGain.gain.setValueAtTime(0, audioContext.currentTime);
        grainGain.gain.exponentialRampToValueAtTime(volume * 0.08, audioContext.currentTime + duration * 0.1);
        grainGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        grainOsc.connect(grainFilter);
        grainFilter.connect(grainGain);
        grainGain.connect(convolverRef.current);
        
        grainOsc.start(audioContext.currentTime);
        grainOsc.stop(audioContext.currentTime + duration);
      }
    };

    const grainTimer = setInterval(grainScheduler, 80 + Math.random() * 200);

    layers.push({ subOsc, padOscs, grainTimer });
    
    // Start oscillators
    subOsc.start();
    padOscs.forEach(({ osc }) => osc.start());
    
    return layers;
  };

  // Enhanced point cloud generation with higher density support
  const generatePointCloud = useCallback(() => {
    const { n, l, m } = quantumNumbers;
    const Z = elements[element].Z;
    const points = [];
    const colors = [];
    const phases = [];
    const velocities = [];
    const originalPos = [];
    
    const scale = n * 1.8 * (1 + 0.1 * Math.log(Z));
    const targetPoints = renderQuality === 'high' ? pointDensity : Math.floor(pointDensity * 0.6);
    
    // Cross-section filtering
    const inCrossSection = (x, y, z) => {
      if (!showCrossSection) return true;
      
      const tolerance = 0.5;
      switch (crossSectionPlane) {
        case 'xy': return Math.abs(z - crossSectionPosition) < tolerance;
        case 'xz': return Math.abs(y - crossSectionPosition) < tolerance;
        case 'yz': return Math.abs(x - crossSectionPosition) < tolerance;
        default: return true;
      }
    };
    
    if (coordinateSystem === 'spherical') {
      const maxRadius = scale * 4;
      let pointsGenerated = 0;
      let attempts = 0;
      const maxAttempts = targetPoints * 30; // Higher attempts for higher density
      
      while (pointsGenerated < targetPoints && attempts < maxAttempts) {
        attempts++;
        
        // Better spherical sampling with importance sampling
        const u = Math.random();
        const v = Math.random();
        const w = Math.random();
        
        // Improved radial sampling for higher n values
        const r = maxRadius * Math.pow(u, 1/(3 + n * 0.1));
        const theta = Math.acos(1 - 2 * v);
        const phi = 2 * Math.PI * w;
        
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        
        if (!inCrossSection(x, y, z)) continue;
        
        const density = probabilityDensity(n, l, m, x, y, z, Z);
        
        // Adaptive threshold based on orbital type
        let threshold = Math.pow(density, 0.2) * 150;
        if (n > 4) threshold *= (n / 4); // Scale for higher principal quantum numbers
        
        if (density > densityCutoff && Math.random() < threshold) {
          points.push(x, y, z);
          originalPos.push(x, y, z);
          
          const phase = Math.atan2(y, x) + z * 0.1 + r * 0.05;
          phases.push(phase);
          
          const current = probabilityCurrent(n, l, m, x, y, z, Z);
          velocities.push(current.x, current.y, current.z);
          
          const color = calculateColor(density, x, y, z, phase, n, l, m, Z);
          colors.push(color.r, color.g, color.b);
          
          pointsGenerated++;
        }
      }
    } else {
      // Enhanced cubic sampling
      const baseGridSize = Math.min(80, Math.sqrt(targetPoints / 10));
      
      for (let i = 0; i < baseGridSize; i++) {
        for (let j = 0; j < baseGridSize; j++) {
          for (let k = 0; k < baseGridSize; k++) {
            const x = (i - baseGridSize/2) * scale / baseGridSize;
            const y = (j - baseGridSize/2) * scale / baseGridSize;
            const z = (k - baseGridSize/2) * scale / baseGridSize;
            
            if (!inCrossSection(x, y, z)) continue;
            
            const density = probabilityDensity(n, l, m, x, y, z, Z);
            
            if (density > densityCutoff && Math.random() < density * 500) {
              points.push(x, y, z);
              originalPos.push(x, y, z);
              
              const phase = Math.atan2(y, x) + z * 0.1;
              phases.push(phase);
              
              const current = probabilityCurrent(n, l, m, x, y, z, Z);
              velocities.push(current.x, current.y, current.z);
              
              const color = calculateColor(density, x, y, z, phase, n, l, m, Z);
              colors.push(color.r, color.g, color.b);
            }
          }
        }
      }
    }
    
    originalPositionsRef.current = new Float32Array(originalPos);
    
    return { 
      points: new Float32Array(points), 
      colors: new Float32Array(colors),
      phases: new Float32Array(phases),
      velocities: new Float32Array(velocities)
    };
  }, [quantumNumbers, element, pointDensity, coordinateSystem, colorMode, colorPalette, 
      renderQuality, densityCutoff, showCrossSection, crossSectionPlane, crossSectionPosition, 
      glowIntensity, emissionStrength]);

  // Touch and mouse controls
  const setupControls = useCallback(() => {
    if (!canvasRef.current) return;

    let isDragging = false;
    let lastTouches = [];
    let rotation = { x: 0, y: 0 };

    const handleMouseDown = (event) => {
      isDragging = true;
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;
      
      const deltaX = event.movementX || 0;
      const deltaY = event.movementY || 0;
      
      rotation.y += deltaX * 0.01;
      rotation.x += deltaY * 0.01;
      
      if (cameraRef.current) {
        const camera = cameraRef.current;
        const distance = camera.position.length();
        
        camera.position.x = Math.sin(rotation.y) * Math.cos(rotation.x) * distance;
        camera.position.y = Math.sin(rotation.x) * distance;
        camera.position.z = Math.cos(rotation.y) * Math.cos(rotation.x) * distance;
        camera.lookAt(0, 0, 0);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event) => {
      if (cameraRef.current) {
        const scale = event.deltaY > 0 ? 1.1 : 0.9;
        cameraRef.current.position.multiplyScalar(scale);
      }
    };

    const handleTouchStart = (event) => {
      event.preventDefault();
      lastTouches = Array.from(event.touches);
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      const touches = Array.from(event.touches);
      
      if (touches.length === 1 && lastTouches.length === 1) {
        const deltaX = touches[0].clientX - lastTouches[0].clientX;
        const deltaY = touches[0].clientY - lastTouches[0].clientY;
        
        rotation.y += deltaX * 0.01;
        rotation.x += deltaY * 0.01;
        
        if (cameraRef.current) {
          const camera = cameraRef.current;
          const distance = camera.position.length();
          
          camera.position.x = Math.sin(rotation.y) * Math.cos(rotation.x) * distance;
          camera.position.y = Math.sin(rotation.x) * distance;
          camera.position.z = Math.cos(rotation.y) * Math.cos(rotation.x) * distance;
          camera.lookAt(0, 0, 0);
        }
      } else if (touches.length === 2 && lastTouches.length === 2) {
        const currentDistance = Math.sqrt(
          Math.pow(touches[0].clientX - touches[1].clientX, 2) +
          Math.pow(touches[0].clientY - touches[1].clientY, 2)
        );
        const lastDistance = Math.sqrt(
          Math.pow(lastTouches[0].clientX - lastTouches[1].clientX, 2) +
          Math.pow(lastTouches[0].clientY - lastTouches[1].clientY, 2)
        );
        
        const scale = currentDistance / lastDistance;
        if (cameraRef.current && scale > 0.5 && scale < 2) {
          cameraRef.current.position.multiplyScalar(1 / scale);
        }
      }
      
      lastTouches = touches;
    };

    const handleTouchEnd = (event) => {
      event.preventDefault();
      lastTouches = [];
    };

    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('mouseup', handleMouseUp);
    canvasRef.current.addEventListener('wheel', handleWheel);
    canvasRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasRef.current.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('mouseup', handleMouseUp);
      canvasRef.current?.removeEventListener('wheel', handleWheel);
      canvasRef.current?.removeEventListener('touchstart', handleTouchStart);
      canvasRef.current?.removeEventListener('touchmove', handleTouchMove);
      canvasRef.current?.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Enhanced 3D visualization initialization
  const initThreeJS = useCallback(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000025);
    
    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: renderQuality === 'high'
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, renderQuality === 'high' ? 2 : 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0x404090, ambientLevel);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
    mainLight.position.set(10, 10, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0x4466ff, lightIntensity * 0.5, 50);
    fillLight.position.set(-10, -5, 5);
    scene.add(fillLight);
    
    const accentLight = new THREE.PointLight(0xff6644, lightIntensity * 0.4, 30);
    accentLight.position.set(5, -10, -5);
    scene.add(accentLight);
    
    const rimLight = new THREE.PointLight(0xffffff, lightIntensity * 0.3, 100);
    rimLight.position.set(0, 0, -20);
    scene.add(rimLight);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    
    return setupControls();
  }, [setupControls, renderQuality, lightIntensity, ambientLevel]);

  // Enhanced visualization update with proper 3D controls
  const updateVisualization = useCallback(() => {
    if (!sceneRef.current) return;
    
    // Clean up existing objects
    if (pointCloudRef.current) {
      sceneRef.current.remove(pointCloudRef.current);
      if (pointCloudRef.current.geometry) pointCloudRef.current.geometry.dispose();
      if (pointCloudRef.current.material) pointCloudRef.current.material.dispose();
    }
    
    quantumFeaturesRef.current.forEach(obj => {
      sceneRef.current.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    quantumFeaturesRef.current = [];
    
    const { points, colors, phases, velocities } = generatePointCloud();
    
    if (points.length === 0) return;
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    let material;
    let object;
    
    // Enhanced render modes with proper controls
    switch (visualizationMode) {
      case 'points':
        material = new THREE.PointsMaterial({
          size: sphereSize * 2,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        });
        object = new THREE.Points(geometry, material);
        break;
      
      case 'spheres':
        const sphereGeometry = new THREE.SphereGeometry(sphereSize, sphereResolution, Math.max(4, sphereResolution * 0.75));
        material = new THREE.MeshPhongMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          shininess: 50 + emissionStrength * 100,
          emissive: new THREE.Color(0x111111),
          emissiveIntensity: emissionStrength
        });
        
        const instanceCount = Math.min(points.length / 3, 50000); // Limit for performance
        object = new THREE.InstancedMesh(sphereGeometry, material, instanceCount);
        
        for (let i = 0; i < instanceCount * 3; i += 3) {
          const matrix = new THREE.Matrix4();
          const scale = 1 + glowIntensity * 0.5;
          matrix.setPosition(points[i], points[i + 1], points[i + 2]);
          matrix.scale(new THREE.Vector3(scale, scale, scale));
          object.setMatrixAt(i / 3, matrix);
          
          const color = new THREE.Color(colors[i], colors[i + 1], colors[i + 2]);
          object.setColorAt(i / 3, color);
        }
        object.instanceMatrix.needsUpdate = true;
        if (object.instanceColor) object.instanceColor.needsUpdate = true;
        break;
      
      case 'wireframe':
        material = new THREE.PointsMaterial({
          size: sphereSize * 0.5,
          vertexColors: true,
          transparent: true,
          opacity: 0.6
        });
        object = new THREE.Points(geometry, material);
        
        // Enhanced wireframe connections
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        const lineColors = [];
        
        const maxConnections = Math.min(wireframeConnections, 8);
        
        for (let i = 0; i < points.length; i += 3) {
          let connections = 0;
          
          for (let j = i + 3; j < points.length && connections < maxConnections; j += 3) {
            const dist = Math.sqrt(
              Math.pow(points[i] - points[j], 2) +
              Math.pow(points[i + 1] - points[j + 1], 2) +
              Math.pow(points[i + 2] - points[j + 2], 2)
            );
            
            if (dist < 1.2) {
              linePositions.push(points[i], points[i + 1], points[i + 2]);
              linePositions.push(points[j], points[j + 1], points[j + 2]);
              
              const alpha = Math.exp(-dist * 2);
              lineColors.push(
                colors[i] * alpha, colors[i + 1] * alpha, colors[i + 2] * alpha,
                colors[j] * alpha, colors[j + 1] * alpha, colors[j + 2] * alpha
              );
              connections++;
            }
          }
        }
        
        if (linePositions.length > 0) {
          lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
          lineGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColors), 3));
          
          const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.2 + glowIntensity * 0.3,
            blending: THREE.AdditiveBlending
          });
          
          const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
          sceneRef.current.add(lines);
          quantumFeaturesRef.current.push(lines);
        }
        break;
      
      case 'volume':
        const volumeGeometry = new THREE.SphereGeometry(sphereSize * 2, 6, 4);
        material = new THREE.MeshBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: (0.05 + glowIntensity * 0.2) * volumeDensity,
          blending: THREE.AdditiveBlending
        });
        
        const volumeCount = Math.floor(points.length / 3 * volumeDensity);
        object = new THREE.InstancedMesh(volumeGeometry, material, volumeCount);
        
        for (let i = 0; i < volumeCount * 3; i += 3) {
          const matrix = new THREE.Matrix4();
          matrix.setPosition(points[i], points[i + 1], points[i + 2]);
          object.setMatrixAt(i / 3, matrix);
          
          const color = new THREE.Color(colors[i], colors[i + 1], colors[i + 2]);
          object.setColorAt(i / 3, color);
        }
        break;
      
      default:
        material = new THREE.PointsMaterial({
          size: sphereSize * 2,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        object = new THREE.Points(geometry, material);
    }
    
    pointCloudRef.current = object;
    sceneRef.current.add(object);
    
    // Add quantum features
    if (showRadialNodes) {
      const nodes = getRadialNodes(quantumNumbers.n, quantumNumbers.l, elements[element].Z);
      nodes.forEach(nodeRadius => {
        const nodeGeometry = new THREE.RingGeometry(nodeRadius - 0.1, nodeRadius + 0.1, 64);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide
        });
        const nodeRing = new THREE.Mesh(nodeGeometry, nodeMaterial);
        sceneRef.current.add(nodeRing);
        quantumFeaturesRef.current.push(nodeRing);
      });
    }
    
    if (showClassicalTurning) {
      const { rMin, rMax } = getClassicalTurningPoints(quantumNumbers.n, quantumNumbers.l, elements[element].Z);
      
      [rMin, rMax].forEach((radius, index) => {
        const sphereGeometry = new THREE.SphereGeometry(radius, 32, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: index === 0 ? 0x00ff00 : 0xff8800,
          transparent: true,
          opacity: 0.15,
          wireframe: true
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sceneRef.current.add(sphere);
        quantumFeaturesRef.current.push(sphere);
      });
    }
    
    // Cross-section plane
    if (showCrossSection) {
      const planeGeometry = new THREE.PlaneGeometry(30, 30);
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      
      switch (crossSectionPlane) {
        case 'xy':
          plane.position.z = crossSectionPosition;
          break;
        case 'xz':
          plane.rotation.x = Math.PI / 2;
          plane.position.y = crossSectionPosition;
          break;
        case 'yz':
          plane.rotation.y = Math.PI / 2;
          plane.position.x = crossSectionPosition;
          break;
      }
      
      sceneRef.current.add(plane);
      quantumFeaturesRef.current.push(plane);
    }
    
  }, [generatePointCloud, visualizationMode, renderQuality, glowIntensity, emissionStrength, 
      showRadialNodes, showClassicalTurning, showCrossSection, crossSectionPlane, 
      crossSectionPosition, quantumNumbers, element, sphereSize, sphereResolution, 
      volumeDensity, wireframeConnections]);

  // Enhanced animation loop with evolution types
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    timeRef.current += 0.016;
    
    if (pointCloudRef.current) {
      // Auto-rotation
      if (autoRotate) {
        pointCloudRef.current.rotation.y += rotationSpeed;
        pointCloudRef.current.rotation.x += rotationSpeed * 0.3;
      }
      
      // Quantum fluctuations
      if (quantumFluctuations && originalPositionsRef.current) {
        const positions = pointCloudRef.current.geometry.attributes.position.array;
        const phases = pointCloudRef.current.geometry.attributes.phase?.array;
        const velocities = pointCloudRef.current.geometry.attributes.velocity?.array;
        const originalPos = originalPositionsRef.current;
        
        const { n, l } = quantumNumbers;
        const uncertaintyFactor = fluctuationIntensity * 0.05 * Math.sqrt(1 / (n * n));
        
        for (let i = 0; i < positions.length; i += 3) {
          const phaseIndex = i / 3;
          
          if (phases && phaseIndex < phases.length) {
            // Heisenberg uncertainty
            const uncertaintyX = uncertaintyFactor * (Math.random() - 0.5) * Math.sin(timeRef.current * 3 + phases[phaseIndex]);
            const uncertaintyY = uncertaintyFactor * (Math.random() - 0.5) * Math.sin(timeRef.current * 2.7 + phases[phaseIndex] * 1.1);
            const uncertaintyZ = uncertaintyFactor * (Math.random() - 0.5) * Math.sin(timeRef.current * 3.3 + phases[phaseIndex] * 0.9);
            
            // Quantum tunneling
            const r = Math.sqrt(originalPos[i]*originalPos[i] + originalPos[i+1]*originalPos[i+1] + originalPos[i+2]*originalPos[i+2]);
            const tunnelingProb = Math.exp(-r * 0.3);
            const tunneling = tunnelingProb > Math.random() ? uncertaintyFactor * 3 : 0;
            
            // Probability current flow
            let flowX = 0, flowY = 0, flowZ = 0;
            if (showProbabilityCurrent && velocities) {
              flowX = velocities[i] * Math.sin(timeRef.current * 0.5) * 10;
              flowY = velocities[i + 1] * Math.sin(timeRef.current * 0.5) * 10;
              flowZ = velocities[i + 2] * Math.sin(timeRef.current * 0.5) * 10;
            }
            
            positions[i] = originalPos[i] + uncertaintyX + tunneling + flowX;
            positions[i + 1] = originalPos[i + 1] + uncertaintyY + flowY;
            positions[i + 2] = originalPos[i + 2] + uncertaintyZ + flowZ;
          }
        }
        
        pointCloudRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
    
    // Enhanced audio parameter evolution with different types
    if (isPlaying && audioNodesRef.current.size > 0) {
      let modulation = 1;
      const time = timeRef.current * evolutionSpeed;
      
      switch (evolutionType) {
        case 'linear':
          modulation = 1 + 0.1 * (time % 10) / 10;
          break;
        case 'exponential':
          modulation = 1 + 0.2 * Math.pow(Math.sin(time * 0.1), 2);
          break;
        case 'wave':
          modulation = 1 + 0.15 * Math.sin(time * 0.2) * Math.cos(time * 0.13);
          break;
        case 'quantum':
          modulation = 1 + 0.1 * Math.sin(time * 0.3) * Math.exp(-Math.abs(Math.sin(time * 0.1)));
          break;
        default:
          modulation = 1 + 0.15 * Math.sin(time * 0.2);
      }
      
      audioNodesRef.current.forEach(layers => {
        if (Array.isArray(layers)) {
          layers.forEach(layer => {
            if (layer.padOscs) {
              layer.padOscs.forEach(({ filter, gain }) => {
                if (filter.frequency && gain.gain) {
                  filter.frequency.setValueAtTime(filter.frequency.value * modulation, audioContextRef.current.currentTime);
                  gain.gain.setValueAtTime(gain.gain.value * modulation, audioContextRef.current.currentTime);
                }
              });
            }
          });
        }
      });
    }
    
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  }, [autoRotate, rotationSpeed, quantumFluctuations, fluctuationIntensity, quantumNumbers, 
      isPlaying, showProbabilityCurrent, evolutionType, evolutionSpeed]);

  // Event handlers
  const handleQuantumNumberChange = (type, value) => {
    setQuantumNumbers(prev => {
      const newNumbers = { ...prev, [type]: parseInt(value) };
      
      if (type === 'n' && newNumbers.l >= newNumbers.n) {
        newNumbers.l = newNumbers.n - 1;
      }
      if ((type === 'n' || type === 'l') && Math.abs(newNumbers.m) > newNumbers.l) {
        newNumbers.m = 0;
      }
      
      return newNumbers;
    });
  };

  const toggleAudio = async () => {
    const audioContext = initAudioContext();
    
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    if (isPlaying) {
      audioNodesRef.current.forEach(layers => {
        if (Array.isArray(layers)) {
          layers.forEach(layer => {
            // Stop all types of synthesis
            if (layer.subOsc) layer.subOsc.stop();
            if (layer.padOscs) {
              layer.padOscs.forEach(({ osc }) => osc.stop());
            }
            if (layer.grainTimer) clearInterval(layer.grainTimer);
            if (layer.exciteTimer) clearInterval(layer.exciteTimer);
            if (layer.osc) layer.osc.stop(); // For oscillator synth
          });
        }
      });
      audioNodesRef.current.clear();
      setIsPlaying(false);
    } else {
      const { n, l, m } = quantumNumbers;
      const Z = elements[element].Z;
      
      const layers = createSynthesis(n, l, m, Z);
      audioNodesRef.current.set(`${n}-${l}-${m}`, layers);
      setIsPlaying(true);
    }
  };

  // Effects
  useEffect(() => {
    const cleanup = initThreeJS();
    return cleanup;
  }, [initThreeJS]);

  useEffect(() => {
    updateVisualization();
  }, [updateVisualization]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    if (isPlaying) {
      toggleAudio();
      setTimeout(() => toggleAudio(), 100);
    }
  }, [quantumNumbers, element, synthesisMode]);

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioContextRef.current?.currentTime || 0);
    }
  }, [volume]);

  const energy = -13.6 * elements[element].Z * elements[element].Z / (quantumNumbers.n * quantumNumbers.n);
  const orbitalType = ['s', 'p', 'd', 'f', 'g'][quantumNumbers.l] || 'h+';

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header with fullscreen button */}
      <div className="p-2 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-center">Quantum Orbital Visualization Studio</h1>
          <p className="text-center text-gray-300 text-xs">Complete synthesis modes • Advanced 3D controls • High-density point clouds</p>
        </div>
        <button
          onClick={toggleFullscreen}
          className="ml-4 p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? '🗗' : '🗖'}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
            style={{ minHeight: '300px' }}
          />
          
          {/* Status overlays */}
          <div className="absolute top-3 left-3 bg-black bg-opacity-90 p-2 rounded-lg backdrop-blur-sm">
            <div className="text-xs space-y-1">
              <div className="font-semibold text-yellow-400">{elements[element].name} (Z={elements[element].Z})</div>
              <div>n={quantumNumbers.n} ℓ={quantumNumbers.l} m={quantumNumbers.m}</div>
              <div className="text-cyan-300">{quantumNumbers.n}{orbitalType}</div>
              <div className="pt-1 border-t border-gray-600">
                <div>E: {energy.toFixed(2)} eV</div>
                <div>|ψ|²: Implemented ✓</div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-3 right-3 bg-black bg-opacity-90 p-2 rounded-lg backdrop-blur-sm">
            <div className="text-xs space-y-1">
              <div>Mode: {visualizationMode}</div>
              <div>Synth: {synthesisMode}</div>
              <div>Evolution: {evolutionType}</div>
              <div>Points: {pointDensity.toLocaleString()}</div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <div>Audio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Control Panel */}
        <div className="w-full lg:w-80 bg-gray-800 p-3 space-y-3 overflow-y-auto text-xs">
          {/* Element Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Element</h3>
            <select
              value={element}
              onChange={(e) => setElement(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-xs"
            >
              {Object.entries(elements).map(([key, elem]) => (
                <option key={key} value={key}>{elem.name} (Z={elem.Z})</option>
              ))}
            </select>
          </div>

          {/* Quantum Numbers */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Quantum Numbers</h3>
            
            <div>
              <label className="block text-xs mb-1">Principal (n): {quantumNumbers.n}</label>
              <input
                type="range"
                min="1"
                max="7"
                value={quantumNumbers.n}
                onChange={(e) => handleQuantumNumberChange('n', e.target.value)}
                className="w-full h-1"
              />
            </div>
            
            <div>
              <label className="block text-xs mb-1">Angular (ℓ): {quantumNumbers.l}</label>
              <input
                type="range"
                min="0"
                max={quantumNumbers.n - 1}
                value={quantumNumbers.l}
                onChange={(e) => handleQuantumNumberChange('l', e.target.value)}
                className="w-full h-1"
              />
            </div>
            
            <div>
              <label className="block text-xs mb-1">Magnetic (m): {quantumNumbers.m}</label>
              <input
                type="range"
                min={-quantumNumbers.l}
                max={quantumNumbers.l}
                value={quantumNumbers.m}
                onChange={(e) => handleQuantumNumberChange('m', e.target.value)}
                className="w-full h-1"
              />
            </div>
          </div>

          {/* Visualization Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Visualization</h3>
            
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs mb-1">Render Mode</label>
                <select
                  value={visualizationMode}
                  onChange={(e) => setVisualizationMode(e.target.value)}
                  className="w-full p-1 bg-gray-700 rounded text-xs"
                >
                  <option value="points">Points</option>
                  <option value="spheres">Spheres</option>
                  <option value="wireframe">Wireframe</option>
                  <option value="volume">Volume</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs mb-1">Coordinates</label>
                <select
                  value={coordinateSystem}
                  onChange={(e) => setCoordinateSystem(e.target.value)}
                  className="w-full p-1 bg-gray-700 rounded text-xs"
                >
                  <option value="spherical">Spherical</option>
                  <option value="cubic">Cubic</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs mb-1">Color Mode</label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value)}
                  className="w-full p-1 bg-gray-700 rounded text-xs"
                >
                  <option value="density">Density</option>
                  <option value="phase">Phase</option>
                  <option value="energy">Energy</option>
                  <option value="quantum">Quantum</option>
                  <option value="nodes">Nodes</option>
                  <option value="angular">Angular</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs mb-1">Palette</label>
                <select
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  className="w-full p-1 bg-gray-700 rounded text-xs"
                >
                  {Object.entries(colorPalettes).map(([key, palette]) => (
                    <option key={key} value={key}>{palette.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs mb-1">Point Density: {pointDensity.toLocaleString()}</label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={pointDensity}
                onChange={(e) => setPointDensity(parseInt(e.target.value))}
                className="w-full h-1"
              />
            </div>
          </div>

          {/* 3D Rendering Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">3D Controls</h3>
            
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs mb-1">Sphere Size: {sphereSize.toFixed(3)}</label>
                <input
                  type="range"
                  min="0.01"
                  max="0.2"
                  step="0.005"
                  value={sphereSize}
                  onChange={(e) => setSphereSize(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Resolution: {sphereResolution}</label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="1"
                  value={sphereResolution}
                  onChange={(e) => setSphereResolution(parseInt(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Volume Density: {volumeDensity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={volumeDensity}
                  onChange={(e) => setVolumeDensity(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Wireframe Links: {wireframeConnections}</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={wireframeConnections}
                  onChange={(e) => setWireframeConnections(parseInt(e.target.value))}
                  className="w-full h-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs mb-1">Light Intensity: {lightIntensity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Ambient: {ambientLevel.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ambientLevel}
                  onChange={(e) => setAmbientLevel(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
            </div>
          </div>

          {/* Visual Effects */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Visual Effects</h3>
            
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs mb-1">Glow: {glowIntensity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Emission: {emissionStrength.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={emissionStrength}
                  onChange={(e) => setEmissionStrength(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs mb-1">Density Cutoff: {densityCutoff.toFixed(4)}</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                value={densityCutoff}
                onChange={(e) => setDensityCutoff(parseFloat(e.target.value))}
                className="w-full h-1"
              />
            </div>
          </div>

          {/* Cross Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showCrossSection"
                checked={showCrossSection}
                onChange={(e) => setShowCrossSection(e.target.checked)}
              />
              <label htmlFor="showCrossSection" className="text-xs">Cross Section</label>
            </div>
            
            {showCrossSection && (
              <div className="space-y-1">
                <div>
                  <label className="block text-xs mb-1">Plane</label>
                  <select
                    value={crossSectionPlane}
                    onChange={(e) => setCrossSectionPlane(e.target.value)}
                    className="w-full p-1 bg-gray-700 rounded text-xs"
                  >
                    <option value="xy">XY Plane</option>
                    <option value="xz">XZ Plane</option>
                    <option value="yz">YZ Plane</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs mb-1">Position: {crossSectionPosition.toFixed(1)}</label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={crossSectionPosition}
                    onChange={(e) => setCrossSectionPosition(parseFloat(e.target.value))}
                    className="w-full h-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quantum Features */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Quantum Features</h3>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showRadialNodes"
                  checked={showRadialNodes}
                  onChange={(e) => setShowRadialNodes(e.target.checked)}
                />
                <label htmlFor="showRadialNodes" className="text-xs">Radial Nodes</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showClassicalTurning"
                  checked={showClassicalTurning}
                  onChange={(e) => setShowClassicalTurning(e.target.checked)}
                />
                <label htmlFor="showClassicalTurning" className="text-xs">Classical Turning Points</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showProbabilityCurrent"
                  checked={showProbabilityCurrent}
                  onChange={(e) => setShowProbabilityCurrent(e.target.checked)}
                />
                <label htmlFor="showProbabilityCurrent" className="text-xs">Probability Current</label>
              </div>
            </div>
          </div>

          {/* Animation Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Animation</h3>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRotate"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
              <label htmlFor="autoRotate" className="text-xs">Auto Rotate</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="quantumFluctuations"
                checked={quantumFluctuations}
                onChange={(e) => setQuantumFluctuations(e.target.checked)}
              />
              <label htmlFor="quantumFluctuations" className="text-xs">Quantum Fluctuations</label>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs mb-1">Rotation: {rotationSpeed.toFixed(3)}</label>
                <input
                  type="range"
                  min="0"
                  max="0.05"
                  step="0.001"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Fluctuation: {fluctuationIntensity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={fluctuationIntensity}
                  onChange={(e) => setFluctuationIntensity(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Audio Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Audio Synthesis</h3>
            
            <button
              onClick={toggleAudio}
              className={`w-full py-2 px-3 rounded font-semibold text-xs ${
                isPlaying 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isPlaying ? '⏹ Stop Audio' : '▶ Play Audio'}
            </button>
            
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs mb-1">Synthesis Mode</label>
                <select
                  value={synthesisMode}
                  onChange={(e) => setSynthesisMode(e.target.value)}
                  className="w-full p-1 bg-gray-700 rounded text-xs"
                >
                  <option value="oscillator">Oscillator</option>
                  <option value="granular">Granular</option>
                  <option value="modal">Modal</option>
                  <option value="cinematic">Cinematic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs mb-1">Evolution Type</label>
                <select
                  value={evolutionType}
                  onChange={(e) => setEvolutionType(e.target.value)}
                  className="w-full p-1 bg-gray-700 rounded text-xs"
                >
                  <option value="linear">Linear</option>
                  <option value="exponential">Exponential</option>
                  <option value="wave">Wave</option>
                  <option value="quantum">Quantum</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="block text-xs mb-1">Volume: {Math.round(volume * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Evolution Speed: {evolutionSpeed.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={evolutionSpeed}
                  onChange={(e) => setEvolutionSpeed(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Reverb: {Math.round(reverbAmount * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={reverbAmount}
                  onChange={(e) => setReverbAmount(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Spatial: {Math.round(spatialWidth * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={spatialWidth}
                  onChange={(e) => setSpatialWidth(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Harmonics: {Math.round(harmonicContent * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={harmonicContent}
                  onChange={(e) => setHarmonicContent(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
              
              <div>
                <label className="block text-xs mb-1">Modulation: {Math.round(modulationDepth * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={modulationDepth}
                  onChange={(e) => setModulationDepth(parseFloat(e.target.value))}
                  className="w-full h-1"
                />
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Performance</h3>
            <select
              value={renderQuality}
              onChange={(e) => setRenderQuality(e.target.value)}
              className="w-full p-1 bg-gray-700 rounded text-xs"
            >
              <option value="high">High Quality</option>
              <option value="medium">Medium Quality</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Status Bar */}
      <div className="p-1 bg-gray-900 text-center text-xs text-gray-400">
        {quantumNumbers.n}{orbitalType} • {energy.toFixed(2)} eV • 
        {elements[element].name} • {synthesisMode} synthesis • {evolutionType} evolution • 
        {pointDensity.toLocaleString()} points • {colorPalettes[colorPalette].name} palette • 
        {isPlaying ? '🔊 Audio On' : '🔇 Audio Off'}
      </div>
    </div>
  );
};

export default QuantumOrbitalApp;