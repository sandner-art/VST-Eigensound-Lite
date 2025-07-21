import React, { useState, useCallback, useMemo } from 'react';
import { INITIAL_TEMPO } from './constants.js';
import { audioService } from './services/audioService.js';
import { getScaleFrequencies } from './services/musicTheory.js';
import Visualizer from './components/visualizer/Visualizer.js';
import ControlsPanel from './components/controls/ControlsPanel.js';

function App() {
  const [shapes, setShapes] = useState([
    { id: 'shape-0', sides: 0, speed: 1, isStar: false, instrument: 'kick' },
    { id: 'shape-3', sides: 3, speed: 1, isStar: false, instrument: 'sine' },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(INITIAL_TEMPO);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  
  // Global settings state
  const [renderMode, setRenderMode] = useState('inscribed');
  const [rootNote, setRootNote] = useState('C4');
  const [scale, setScale] = useState('PENTATONIC_MAJOR');
  const [cycleLength, setCycleLength] = useState(1);
  const [instrumentOptions, setInstrumentOptions] = useState(['sine', 'kick', 'snare', 'hihat']);


  const scaleFrequencies = useMemo(() => getScaleFrequencies(rootNote, scale), [rootNote, scale]);

  const handleTogglePlay = useCallback(async () => {
    if (!isAudioInitialized) {
      audioService.init();
      setIsAudioInitialized(true);
    }
    
    if (audioService.getContextState() === 'suspended') {
      await audioService.resumeContext();
    }
    
    setIsPlaying(prev => !prev);
  }, [isAudioInitialized]);

  const addShape = useCallback((sides) => {
    setShapes(prevShapes => {
      if (prevShapes.find(s => s.sides === sides)) {
        return prevShapes;
      }
      const newShape = { 
        id: `shape-${Date.now()}-${sides}`, 
        sides,
        speed: 1,
        isStar: false,
        instrument: sides === 0 ? 'kick' : 'sine',
      };
      return [...prevShapes, newShape].sort((a,b) => a.sides - b.sides);
    });
  }, []);

  const removeShape = useCallback((id) => {
    setShapes(prevShapes => prevShapes.filter(s => s.id !== id));
  }, []);

  const updateShape = useCallback((id, newProps) => {
    setShapes(prevShapes =>
      prevShapes.map(s => (s.id === id ? { ...s, ...newProps } : s))
    );
  }, []);

  const handleLoadSample = async (file) => {
    if (!isAudioInitialized) {
      audioService.init();
      setIsAudioInitialized(true);
    }
    if (!file) return;
    try {
      const sampleName = await audioService.loadSample(file);
      if (sampleName && !instrumentOptions.includes(sampleName)) {
        setInstrumentOptions(prev => [...prev, sampleName]);
      }
    } catch (error) {
      console.error("Error loading sample:", error);
      alert("Failed to load audio sample. Please check the file format.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900 text-gray-100 font-sans">
      <div className="flex-grow flex items-center justify-center p-4 overflow-hidden relative">
        <Visualizer 
          isPlaying={isPlaying} 
          tempo={tempo} 
          shapes={shapes} 
          renderMode={renderMode}
          scaleFrequencies={scaleFrequencies}
          cycleLength={cycleLength}
        />
      </div>
      <div className="w-full md:w-96 bg-gray-900/80 backdrop-blur-sm border-t md:border-t-0 md:border-l border-gray-700/50 p-6 flex flex-col space-y-6 flex-shrink-0 overflow-y-auto">
        <header>
          <h1 className="text-3xl font-bold text-white tracking-wider">GEOMETRIC</h1>
          <h2 className="text-xl font-light text-cyan-400 tracking-widest">RHYTHM LAB</h2>
        </header>
        <ControlsPanel
          isPlaying={isPlaying}
          tempo={tempo}
          onTogglePlay={handleTogglePlay}
          onTempoChange={setTempo}
          onAddShape={addShape}
          onRemoveShape={removeShape}
          onUpdateShape={updateShape}
          activeShapes={shapes}
          renderMode={renderMode}
          onRenderModeChange={setRenderMode}
          rootNote={rootNote}
          onRootNoteChange={setRootNote}
          scale={scale}
          onScaleChange={setScale}
          cycleLength={cycleLength}
          onCycleLengthChange={setCycleLength}
          instrumentOptions={instrumentOptions}
          onLoadSample={handleLoadSample}
        />
      </div>
    </div>
  );
}

export default App;
