import React from 'react';
import { MIN_SIDES, MAX_SIDES, SHAPE_COLORS, NOTES, SCALES } from '../../constants.js';
import IconButton from './IconButton.js';
import Slider from '../ui/Slider.js';

const PlayIcon = ({className}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.018 14.386A1.723 1.723 0 0 0 6.277 16h7.446a1.723 1.723 0 0 0 2.26-1.614l-1.378-6.892a1.724 1.724 0 0 0-1.705-1.429H7.12a1.724 1.724 0 0 0-1.705 1.429L4.018 14.386Z"></path></svg>
);

const PauseIcon = ({className}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.75 3a.75.75 0 0 0-.75.75v12.5a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 5.75 3Zm8.5 0a.75.75 0 0 0-.75.75v12.5a.75.75 0 0 0 1.5 0V3.75a.75.75 0 0 0-.75-.75Z"></path></svg>
);

const TrashIcon = ({className}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];
const NOTE_OPTIONS = Object.keys(NOTES);
const SCALE_OPTIONS = Object.keys(SCALES);
const CYCLE_LENGTH_OPTIONS = [1, 2, 4, 8, Infinity];


const Select = (props) => (
    <select {...props} className="w-full bg-gray-700/80 border border-gray-600/70 text-gray-200 rounded-md px-2 py-1 text-sm focus:ring-cyan-500 focus:border-cyan-500 transition-colors" />
);

const ControlsPanel = ({
  isPlaying, tempo, activeShapes,
  onTogglePlay, onTempoChange, onAddShape, onRemoveShape, onUpdateShape,
  renderMode, onRenderModeChange, rootNote, onRootNoteChange, scale, onScaleChange,
  cycleLength, onCycleLengthChange, instrumentOptions, onLoadSample
}) => {
  const availableSides = Array.from({ length: MAX_SIDES - MIN_SIDES + 1 }, (_, i) => i + MIN_SIDES);
  const circleExists = activeShapes.some(s => s.sides === 0);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onLoadSample(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <IconButton onClick={onTogglePlay}>
                    {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                </IconButton>
                <div className="w-full">
                     <label htmlFor="tempo" className="block text-sm font-medium text-gray-400">Tempo</label>
                     <div className="flex items-center space-x-3">
                        <Slider id="tempo" min={40} max={240} value={tempo} onChange={(e) => onTempoChange(Number(e.target.value))} />
                        <span className="text-lg font-mono w-16 text-right">{tempo} BPM</span>
                     </div>
                </div>
            </div>

            <div className="space-y-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-lg font-semibold text-gray-200">Global Settings</h3>
                 <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Render Mode</label>
                    <div className="flex items-center space-x-1 bg-gray-900/50 p-0.5 rounded-md">
                        {['inscribed', 'stacked'].map(mode => (
                             <button key={mode} onClick={() => onRenderModeChange(mode)} className={`w-full py-1 text-sm font-mono rounded transition-colors duration-200 capitalize ${renderMode === mode ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                {mode}
                             </button>
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Cycle Length</label>
                    <div className="flex items-center space-x-1 bg-gray-900/50 p-0.5 rounded-md">
                        {CYCLE_LENGTH_OPTIONS.map(len => (
                             <button key={len} onClick={() => onCycleLengthChange(len)} className={`w-full py-1 text-sm font-mono rounded transition-colors duration-200 ${cycleLength === len ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                {len === Infinity ? '∞' : len}
                             </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className='space-y-1'>
                        <label htmlFor="rootNote" className="block text-sm font-medium text-gray-400">Root Note</label>
                        <Select id="rootNote" value={rootNote} onChange={e => onRootNoteChange(e.target.value)}>
                            {NOTE_OPTIONS.map(note => <option key={note} value={note}>{note}</option>)}
                        </Select>
                    </div>
                    <div className='space-y-1'>
                        <label htmlFor="scale" className="block text-sm font-medium text-gray-400">Scale</label>
                        <Select id="scale" value={scale} onChange={e => onScaleChange(e.target.value)}>
                            {SCALE_OPTIONS.map(scaleKey => <option key={scaleKey} value={scaleKey}>{SCALES[scaleKey].name}</option>)}
                        </Select>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-lg font-semibold text-gray-200">Instruments</h3>
                <div className="space-y-3">
                    {activeShapes.map(shape => (
                        <div key={shape.id} className="flex flex-col bg-gray-800/70 p-3 rounded-lg space-y-3 border border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{backgroundColor: shape.sides > 0 ? SHAPE_COLORS[shape.sides] : '#60a5fa'}}></div>
                                    <span className="font-mono text-gray-300">{shape.sides > 0 ? `${shape.sides}-gon` : 'Circle'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                     { shape.sides > 0 && <button onClick={() => onUpdateShape(shape.id, { isStar: !shape.isStar })} disabled={shape.sides < 5} className={`px-2 py-1 text-xs font-mono rounded-md transition-colors duration-200 ${ shape.sides < 5 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : shape.isStar ? 'bg-cyan-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200' }`}>
                                        {shape.isStar ? 'STAR' : 'POLY'}
                                    </button>}
                                    <IconButton onClick={() => onRemoveShape(shape.id)} size="sm">
                                        <TrashIcon className="w-5 h-5" />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <label className="font-medium text-gray-400">Sound</label>
                                <div className="flex flex-wrap gap-1 bg-gray-900/50 p-1 rounded-md max-w-[70%] justify-end">
                                    {instrumentOptions.map(instrument => ( <button key={instrument} onClick={() => onUpdateShape(shape.id, { instrument })} className={`px-2 py-0.5 text-xs font-mono rounded transition-colors duration-200 capitalize ${ shape.instrument === instrument ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700' }`} > {instrument.replace(/\.[^/.]+$/, "")} </button> ))}
                                </div>
                            </div>
                             <div className="flex items-center justify-between text-sm">
                                <label className="font-medium text-gray-400">Speed</label>
                                <div className="flex items-center space-x-1 bg-gray-900/50 p-0.5 rounded-md">
                                    {SPEED_OPTIONS.map(speed => ( <button key={speed} onClick={() => onUpdateShape(shape.id, { speed })} className={`px-2 py-0.5 text-xs font-mono rounded transition-colors duration-200 ${ shape.speed === speed ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700' }`}> {speed}x </button> ))}
                                </div>
                            </div>
                        </div>
                    ))}
                     {activeShapes.length === 0 && <p className="text-gray-500 text-sm">Add an instrument to begin.</p>}
                </div>
                 <div className="space-y-2 pt-4">
                     <h4 className="text-sm font-medium text-gray-400">Add Instrument</h4>
                     <div className="grid grid-cols-4 gap-2">
                         <button onClick={() => onAddShape(0)} disabled={circleExists} className={`w-full py-2 text-center font-mono rounded-md transition-all duration-200 border ${circleExists ? 'bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed' : 'bg-cyan-900/50 border-cyan-800/80 hover:bg-cyan-800/80 hover:border-cyan-700 text-cyan-200' }`}>O</button>
                        {availableSides.map(sides => {
                             const isActive = activeShapes.some(s => s.sides === sides);
                             return ( <button key={sides} onClick={() => onAddShape(sides)} disabled={isActive} className={`w-full py-2 text-center font-mono rounded-md transition-all duration-200 border ${isActive ? 'bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed' : 'bg-cyan-900/50 border-cyan-800/80 hover:bg-cyan-800/80 hover:border-cyan-700 text-cyan-200' }`}> {sides} </button> )
                        })}
                     </div>
                 </div>
                 <div className="space-y-2 pt-4 border-t border-gray-700/50 mt-4">
                    <h4 className="text-sm font-medium text-gray-400">Custom Samples</h4>
                     <label htmlFor="sample-upload" className="w-full text-center block bg-cyan-900/50 border border-cyan-800/80 hover:bg-cyan-800/80 hover:border-cyan-700 text-cyan-200 font-mono py-2 rounded-md cursor-pointer transition-colors duration-200">
                        Load Sample
                     </label>
                     <input id="sample-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                 </div>
            </div>
        </div>
        <footer className="text-center text-xs text-gray-500 mt-4 flex-shrink-0">
            <p>An interactive rhythmic experiment. Daniel Sandner © 2025.</p>
        </footer>
    </div>
  );
};

export default ControlsPanel;
