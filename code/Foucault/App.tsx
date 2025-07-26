import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PendulumVisualizer } from './components/PendulumVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { useFoucaultPendulum } from './hooks/useFoucaultPendulum';
import { useAudioEngine } from './hooks/useAudioEngine';
import type { PhysicsParams, AudioParams, SynthType, PendulumState, StorablePreset } from './types';
import { DEFAULT_PHYSICS_PARAMS, DEFAULT_AUDIO_PARAMS } from './constants';
import { PRESETS } from './presets';
import type { Preset } from './presets';

const CUSTOM_PRESETS_KEY = 'foucault_terraphone_presets';

export default function App(): React.ReactNode {
  const [physicsParams, setPhysicsParams] = useState<PhysicsParams>(DEFAULT_PHYSICS_PARAMS);
  const [audioParams, setAudioParams] = useState<AudioParams>(DEFAULT_AUDIO_PARAMS);
  const [customPresets, setCustomPresets] = useState<StorablePreset[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    try {
      const storedPresets = localStorage.getItem(CUSTOM_PRESETS_KEY);
      if (storedPresets) {
        setCustomPresets(JSON.parse(storedPresets));
      }
    } catch (e) {
      console.error("Failed to load custom presets:", e);
      localStorage.removeItem(CUSTOM_PRESETS_KEY);
    }
  }, []);
  
  const { 
    pendulums, 
    addPendulum, 
    clearPendulums 
  } = useFoucaultPendulum(physicsParams, audioParams);

  const { 
    initAudio,
    addPendulumAudio,
    removePendulumAudio,
    updateAudio, 
    setSynthType, 
    setMasterVolume,
    setReverb,
    loadSample,
    isSampleLoaded,
    testAudio,
    isInitialized,
    startRecording,
    stopRecording,
  } = useAudioEngine();

  const prevPendulumsRef = useRef<PendulumState[]>([]);

  useEffect(() => {
    const prevIds = new Set(prevPendulumsRef.current.map(p => p.id));
    const currentIds = new Set(pendulums.map(p => p.id));

    // Handle new and removed pendulums for audio
    for (const p of pendulums) {
        if (!prevIds.has(p.id)) {
            addPendulumAudio(p);
        }
    }
    for (const p of prevPendulumsRef.current) {
        if (!currentIds.has(p.id)) {
            removePendulumAudio(p.id);
        }
    }
    
    // Update all active audio voices
    if (pendulums.length > 0) {
      updateAudio(pendulums, physicsParams, audioParams);
    }
    
    prevPendulumsRef.current = pendulums;
  }, [pendulums, physicsParams, audioParams, addPendulumAudio, removePendulumAudio, updateAudio]);

  const handleStart = useCallback((x: number, y: number, scale: number) => {
    if (!isInitialized) {
      initAudio();
    }
    addPendulum(x, y, scale);
  }, [addPendulum, isInitialized, initAudio]);

  const handleStop = useCallback(() => {
    clearPendulums();
  }, [clearPendulums]);
  
  const handleSetPreset = useCallback((preset: Preset) => {
    handleStop();
    setPhysicsParams(preset.params);
    // Presets could eventually have audio params too
  }, [handleStop]);
  
  const handleLoadCustomPreset = useCallback((preset: StorablePreset) => {
    handleStop();
    setPhysicsParams(preset.physics);
    setAudioParams(preset.audio);
    // Update audio engine with loaded params
    setSynthType(preset.audio.synthType);
    setMasterVolume(preset.audio.volume);
    setReverb(preset.audio.reverb);
  }, [handleStop, setSynthType, setMasterVolume, setReverb]);

  const handleSavePreset = useCallback((name: string) => {
    const newPreset: StorablePreset = {
      id: `custom_${Date.now()}`,
      name: name || `Preset ${customPresets.length + 1}`,
      physics: physicsParams,
      audio: audioParams
    };
    const updatedPresets = [...customPresets, newPreset];
    setCustomPresets(updatedPresets);
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updatedPresets));
  }, [customPresets, physicsParams, audioParams]);

  const handleDeletePreset = useCallback((id: string) => {
    const updatedPresets = customPresets.filter(p => p.id !== id);
    setCustomPresets(updatedPresets);
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(updatedPresets));
  }, [customPresets]);


  const handleReset = useCallback(() => {
    handleStop();
    setPhysicsParams(DEFAULT_PHYSICS_PARAMS);
    setAudioParams(DEFAULT_AUDIO_PARAMS);
    setSynthType(DEFAULT_AUDIO_PARAMS.synthType);
    setMasterVolume(DEFAULT_AUDIO_PARAMS.volume);
    setReverb(DEFAULT_AUDIO_PARAMS.reverb);
  }, [handleStop, setSynthType, setMasterVolume, setReverb]);

  const handleSynthChange = useCallback((type: SynthType) => {
    setAudioParams(p => ({ ...p, synthType: type }));
    setSynthType(type);
  }, [setSynthType]);

  const handleVolumeChange = useCallback((volume: number) => {
    setAudioParams(p => ({...p, volume}));
    setMasterVolume(volume);
  }, [setMasterVolume]);

  const handleDopplerChange = useCallback((dopplerEffect: number) => {
    setAudioParams(p => ({...p, dopplerEffect }));
  }, []);

  const handleReverbChange = useCallback((reverb: number) => {
    setAudioParams(p => ({...p, reverb }));
    setReverb(reverb);
  }, [setReverb]);

  const handleSampleLoad = useCallback(async (file: File) => {
    await loadSample(file);
  }, [loadSample]);

  const handleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  }, [isRecording, startRecording, stopRecording]);
  
  const isSwinging = pendulums.length > 0;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
        <header className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">Foucault Terraphone</h1>
          <p className="text-sm md:text-base text-gray-400">Sonifying Celestial Mechanics Through Virtual Pendulums</p>
        </header>
        <div className="flex-1 relative rounded-lg">
          <PendulumVisualizer 
            pendulums={pendulums} 
            onStart={handleStart} 
            pivotRotationSpeed={physicsParams.pivotRotationSpeed}
          />
        </div>
      </div>

      <aside className="w-full md:w-80 lg:w-96 bg-gray-800/50 p-4 md:p-6 lg:p-8 shadow-2xl overflow-y-auto">
        <ControlPanel
          physicsParams={physicsParams}
          setPhysicsParams={setPhysicsParams}
          isSwinging={isSwinging}
          onReset={handleReset}
          onStop={handleStop}
          onSetPreset={handleSetPreset}
          audioParams={audioParams}
          onSynthChange={handleSynthChange}
          onVolumeChange={handleVolumeChange}
          onDopplerChange={handleDopplerChange}
          onReverbChange={handleReverbChange}
          onTestAudio={testAudio}
          onSampleLoad={handleSampleLoad}
          isAudioReady={isInitialized}
          isSampleLoaded={isSampleLoaded}
          customPresets={customPresets}
          onSavePreset={handleSavePreset}
          onLoadCustomPreset={handleLoadCustomPreset}
          onDeletePreset={handleDeletePreset}
          isRecording={isRecording}
          onToggleRecording={handleRecording}
        />
      </aside>
    </div>
  );
}