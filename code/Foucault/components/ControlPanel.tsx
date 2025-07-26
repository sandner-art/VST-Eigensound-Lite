import React, { useRef, useState } from 'react';
import type { PhysicsParams, AudioParams, SynthType, StorablePreset } from '../types';
import { PRESETS } from '../presets';
import type { Preset } from '../presets';
import { GlobeIcon } from './icons/GlobeIcon';
import { LengthIcon } from './icons/LengthIcon';
import { ClockIcon } from './icons/ClockIcon';
import { WaveIcon } from './icons/WaveIcon';
import { VolumeIcon } from './icons/VolumeIcon';
import { SynthIcon } from './icons/SynthIcon';
import { SampleIcon } from './icons/SampleIcon';
import { DopplerIcon } from './icons/DopplerIcon';
import { PivotIcon } from './icons/PivotIcon';
import { GravityIcon } from './icons/GravityIcon';
import { ReverbIcon } from './icons/ReverbIcon';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';
import { RecordIcon } from './icons/RecordIcon';
import { PerformanceIcon } from './icons/PerformanceIcon';

interface ControlPanelProps {
  physicsParams: PhysicsParams;
  setPhysicsParams: React.Dispatch<React.SetStateAction<PhysicsParams>>;
  isSwinging: boolean;
  onReset: () => void;
  onStop: () => void;
  onSetPreset: (preset: Preset) => void;
  audioParams: AudioParams;
  onSynthChange: (type: SynthType) => void;
  onVolumeChange: (volume: number) => void;
  onDopplerChange: (value: number) => void;
  onReverbChange: (value: number) => void;
  onTestAudio: () => void;
  onSampleLoad: (file: File) => void;
  isAudioReady: boolean;
  isSampleLoaded: boolean;
  customPresets: StorablePreset[];
  onSavePreset: (name: string) => void;
  onLoadCustomPreset: (preset: StorablePreset) => void;
  onDeletePreset: (id: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  unit?: string;
  disabled?: boolean;
}> = ({ label, value, min, max, step, onChange, icon, unit, disabled }) => (
  <div className="mb-4">
    <label className={`flex items-center text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-300'} mb-2`}>
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <div className="flex items-center space-x-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:accent-gray-500 disabled:cursor-not-allowed"
      />
      <span className={`text-sm font-mono ${disabled ? 'text-gray-500' : 'text-cyan-400'} w-20 text-right`}>{value.toFixed(2)} {unit}</span>
    </div>
  </div>
);

const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen=false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="py-2 border-b border-gray-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-lg font-semibold text-gray-300">
                <span>{title}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>&#9660;</span>
            </button>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
}

const SYNTH_TYPES: SynthType[] = ['sine', 'square', 'sawtooth', 'triangle', 'noise', 'sample'];

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  physicsParams, setPhysicsParams, isSwinging, onReset, onStop, onSetPreset,
  audioParams, onSynthChange, onVolumeChange, onDopplerChange, onReverbChange, onTestAudio, onSampleLoad,
  isAudioReady, isSampleLoaded, customPresets, onSavePreset, onLoadCustomPreset, onDeletePreset,
  isRecording, onToggleRecording
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [presetName, setPresetName] = useState('');

  const handleParamChange = (field: keyof PhysicsParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhysicsParams(prev => ({ ...prev, [field]: parseFloat(e.target.value) }));
  };

  const handleSaveClick = () => {
    onSavePreset(presetName);
    setPresetName('');
  };

  return (
    <div className="flex flex-col h-full">
      <div>
        <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-600 pb-2">Controls</h2>
        
        <p className="text-xs text-gray-500 mb-4 text-center">
            Tap the canvas to create a pendulum. Parameters can be changed in real-time.
        </p>
        
        <Accordion title="Physics" defaultOpen={true}>
            <Slider
              label="Time Scale"
              icon={<ClockIcon />}
              value={physicsParams.timeScale}
              min={1} max={1000} step={1}
              onChange={handleParamChange('timeScale')}
              unit="x"
            />
            <Slider
              label="Launch Energy"
              icon={<WaveIcon />}
              value={physicsParams.launchEnergy}
              min={0} max={2} step={0.05}
              onChange={handleParamChange('launchEnergy')}
              unit="v"
            />
             <Slider
              label="Damping"
              icon={<WaveIcon />}
              value={physicsParams.damping}
              min={0.001} max={0.05} step={0.001}
              onChange={handleParamChange('damping')}
            />
             <Slider
              label="Pendulum Length"
              icon={<LengthIcon />}
              value={physicsParams.length}
              min={5} max={100} step={1}
              onChange={handleParamChange('length')}
              unit="m"
            />
            <Slider
              label="Latitude"
              icon={<GlobeIcon />}
              value={physicsParams.latitude}
              min={-90} max={90} step={1}
              onChange={handleParamChange('latitude')}
              unit="°"
            />
        </Accordion>
        
        <Accordion title="Effects">
            <Slider
              label="Pivot Rotation"
              icon={<PivotIcon />}
              value={physicsParams.pivotRotationSpeed}
              min={0} max={0.5} step={0.005}
              onChange={handleParamChange('pivotRotationSpeed')}
              unit="rad/s"
            />
            <Slider
              label="Gravity Jitter"
              icon={<GravityIcon />}
              value={physicsParams.gravityJitter}
              min={0} max={10} step={0.1}
              onChange={handleParamChange('gravityJitter')}
              unit="m/s²"
            />
        </Accordion>

        <Accordion title="Audio">
          <Slider
            label="Master Volume"
            icon={<VolumeIcon />}
            value={audioParams.volume}
            min={0} max={1} step={0.01}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            disabled={!isAudioReady}
          />
           <Slider
            label="Doppler Effect"
            icon={<DopplerIcon />}
            value={audioParams.dopplerEffect}
            min={0} max={1} step={0.01}
            onChange={(e) => onDopplerChange(parseFloat(e.target.value))}
            disabled={!isAudioReady}
          />
           <Slider
            label="Reverb"
            icon={<ReverbIcon />}
            value={audioParams.reverb}
            min={0} max={1} step={0.01}
            onChange={(e) => onReverbChange(parseFloat(e.target.value))}
            disabled={!isAudioReady}
          />
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <SynthIcon />
              <span className="ml-2">Waveform</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SYNTH_TYPES.map(type => {
                const isSampleButton = type === 'sample';
                const isDisabled = !isAudioReady || (isSampleButton && !isSampleLoaded);
                return (
                  <button
                    key={type}
                    onClick={() => onSynthChange(type)}
                    disabled={isDisabled}
                    className={`py-2 px-2 text-sm font-semibold rounded-md transition-colors disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed capitalize ${audioParams.synthType === type ? 'bg-teal-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>
          <input type="file" accept="audio/*" ref={fileInputRef} onChange={(e) => e.target.files && onSampleLoad(e.target.files[0])} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={!isAudioReady} className="w-full mt-2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-800/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2">
            <SampleIcon /> <span>Load Sample</span>
          </button>
           <button onClick={onTestAudio} disabled={!isAudioReady} className="w-full mt-4 py-2 px-4 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 disabled:bg-cyan-800/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">Test Audio</button>
        </Accordion>
        
        <Accordion title="Presets">
          <h3 className="text-base font-semibold text-gray-300 mb-2">Celestial Bodies</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PRESETS.map((preset) => (
              <button key={preset.name} onClick={() => onSetPreset(preset)} className="py-2 px-2 text-sm bg-gray-700 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors">
                {preset.name}
              </button>
            ))}
          </div>
          <h3 className="text-base font-semibold text-gray-300 mb-2">My Presets</h3>
          {customPresets.length === 0 ? <p className="text-xs text-gray-500">No custom presets saved.</p> : (
            <div className="space-y-2 mb-4">
              {customPresets.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                  <span className="text-sm truncate">{p.name}</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onLoadCustomPreset(p)} className="text-cyan-400 hover:text-cyan-300">Load</button>
                    <button onClick={() => onDeletePreset(p.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex space-x-2 mt-4">
            <input type="text" value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="New preset name..." className="flex-grow bg-gray-900 border border-gray-600 text-white text-sm rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"/>
            <button onClick={handleSaveClick} className="p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"><SaveIcon /></button>
          </div>
        </Accordion>

        <Accordion title="Performance">
             <Slider
                label="Simulation Quality"
                icon={<PerformanceIcon />}
                value={physicsParams.simulationQuality}
                min={1} max={10} step={1}
                onChange={handleParamChange('simulationQuality')}
                unit=""
              />
        </Accordion>

      </div>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="flex flex-col space-y-3">
          <button onClick={onToggleRecording} disabled={!isAudioReady} className={`w-full py-2 px-4 font-semibold rounded-md transition-colors flex items-center justify-center space-x-2 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-fuchsia-600 hover:bg-fuchsia-700'} text-white disabled:bg-gray-800 disabled:text-gray-500`}>
            <RecordIcon /><span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>
          <button onClick={onStop} disabled={!isSwinging} className="w-full py-2 px-4 bg-red-600/50 text-white font-semibold rounded-md disabled:bg-red-800/50 disabled:text-gray-400 hover:bg-red-700/50 disabled:cursor-not-allowed transition-colors">
            Stop All
          </button>
          <button onClick={onReset} className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};