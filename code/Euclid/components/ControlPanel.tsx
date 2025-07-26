
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { presets, PresetKey } from '../constants';
import { EuclidI47Data, CircleData, EuclidIData, GoldenRatioSquareData, ThalesData, SonificationRules, Waveform, MusicalScale, FibonacciData, FibonacciCirclesData, SilverRatioData, EyeOfHorusData, FlowerOfLifeData, LituusSpiralData, Sample, SonificationMode, EuclidI1Data, EuclidII5Data, SonificationFx, ThemeName, NoiseType, SourceType, PlaybackMode, FmParams, GranularParams, GranularModulationTarget, NormalizationMode, SourceParameterKey, PresetSourceParameters, LfoTarget, LfoModulationTarget, DelayParams, DistortionParams, ReverbParams, AIStyle, InteractionMode, RhythmSettings, DrumType, RhythmParameter, RhythmPresetMapping, BlendMode, BlendAssignments } from '../types';
import { SonificationEngine } from '../services/sonificationService';

// Get a singleton audio context
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

interface ControlPanelProps {
    isMobileView: boolean;
    visualizerComponent: React.ReactNode;
    sonificationEngine: SonificationEngine;
    theme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
    activePresetKey: PresetKey;
    onPresetChange: (key: PresetKey) => void;
    description: string;
    
    euclidI47Data: EuclidI47Data; onEuclidI47Change: (data: EuclidI47Data) => void;
    euclidI1Data: EuclidI1Data; onEuclidI1Change: (data: EuclidI1Data) => void;
    euclidII5Data: EuclidII5Data; onEuclidII5Change: (data: EuclidII5Data) => void;
    circleData: CircleData; onCircleChange: (data: CircleData) => void;
    euclidIData: EuclidIData; onEuclidIChange: (data: EuclidIData) => void;
    goldenRatioSquareData: GoldenRatioSquareData; onGoldenRatioSquareChange: (data: GoldenRatioSquareData) => void;
    thalesData: ThalesData; onThalesChange: (data: ThalesData) => void;
    fibonacciData: FibonacciData; onFibonacciChange: (data: FibonacciData) => void;
    fibonacciCirclesData: FibonacciCirclesData; onFibonacciCirclesChange: (data: FibonacciCirclesData) => void;
    silverRatioData: SilverRatioData; onSilverRatioChange: (data: SilverRatioData) => void;
    eyeOfHorusData: EyeOfHorusData; onEyeOfHorusChange: (data: EyeOfHorusData) => void;
    flowerOfLifeData: FlowerOfLifeData; onFlowerOfLifeChange: (data: FlowerOfLifeData) => void;
    lituusSpiralData: LituusSpiralData; onLituusSpiralChange: (data: LituusSpiralData) => void;

    playbackMode: PlaybackMode;
    onPlaybackModeChange: (mode: PlaybackMode) => void;
    fadeoutTime: number;
    onFadeoutTimeChange: (time: number) => void;

    sonificationRules: SonificationRules;
    onSonificationRulesChange: (rules: SonificationRules) => void;
    sonificationSelection: { [key: string]: boolean };
    onSonificationSelectionChange: (key: string, value: boolean) => void;
    
    samples: Sample[];
    onSamplesChange: (samples: Sample[]) => void;
    fxAssignments: { [key: string]: SonificationFx };
    onFxAssignmentChange: (valueKey: string, fx: SonificationFx) => void;
    sourceAssignments: { [key: string]: string };
    onSourceAssignmentChange: (valueKey: string, sourceId: string) => void;
    blendAssignments: { [key: string]: BlendMode };
    onBlendAssignmentChange: (valueKey: string, blendMode: BlendMode) => void;
    sourceParameters: PresetSourceParameters;
    onSourceParameterChange: (valueKey: string, paramKey: SourceParameterKey, params: any) => void;

    showLabels: boolean;
    onShowLabelsChange: (show: boolean) => void;
    isMuted: boolean;
    onIsMutedChange: (muted: boolean) => void;
    activePreset: typeof presets[PresetKey];
    interactionMode: InteractionMode;
    onInteractionModeChange: (mode: InteractionMode) => void;
    
    isFullScreen: boolean;
    onToggleFullScreen: () => void;

    // AI Distiller Props
    aiStyle: AIStyle;
    onAiStyleChange: (style: AIStyle) => void;
    aiNotes: string;
    onAiNotesChange: (notes: string) => void;
    isGenerating: boolean;
    generationError: string | null;
    generatedExplanation: string | null;
    onGenerate: () => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    
    // Rhythm Module Props
    rhythmSettings: RhythmSettings;
    onRhythmSettingsChange: (settings: RhythmSettings) => void;
    rhythmSourceMapping: RhythmPresetMapping;
    onRhythmSourceMappingChange: (mapping: RhythmPresetMapping) => void;
    sonifiableValues: string[];
}

const InfoModal: React.FC<{title: string, description: string, onClose: () => void}> = ({ title, description, onClose }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-bg-secondary rounded-lg shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-accent-primary">{title}</h3>
                <button onClick={onClose} className="text-text-secondary hover:text-text-primary">&times;</button>
            </div>
            <p className="text-text-primary whitespace-pre-wrap">{description}</p>
        </div>
    </div>
);


const Slider: React.FC<{ label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void; onMouseDown?: () => void; onMouseUp?: () => void; }> = ({ label, value, min, max, step = 1, onChange, onMouseDown, onMouseUp }) => (
    <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-text-secondary flex justify-between">
            <span>{label}</span>
            <span className="font-bold text-text-primary">{typeof value === 'number' ? value.toFixed(2) : value}</span>
        </label>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchStart={onMouseDown} onTouchEnd={onMouseUp} className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer range-slider" style={{ accentColor: 'var(--accent-primary)' }} />
    </div>
);

const Select: React.FC<{ label?: string; value: string; onChange: (value: any) => void; options: {value: string, label: string}[] }> = ({ label, value, onChange, options }) => (
    <div className="flex flex-col space-y-1">
        {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
        <div className="relative">
            <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none bg-bg-primary border border-border-primary text-text-primary py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:border-accent-primary text-sm">
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

const Switch: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, checked, onChange }) => (
    <div className="flex justify-between items-center bg-bg-secondary p-3 rounded-lg">
        <label htmlFor={`${label}-toggle`} className="text-sm font-semibold text-text-primary">{label}</label>
        <button id={`${label}-toggle`} onClick={() => onChange(!checked)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-accent-primary' : 'bg-bg-tertiary'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const SonificationSourceControl: React.FC<{ 
    label: string; 
    isChecked: boolean; onCheckChange: (c: boolean) => void; 
    assignedSource: SourceType; onSourceChange: (id: SourceType) => void; 
    assignedBlend: BlendMode; onBlendChange: (mode: BlendMode) => void;
    assignedFx: SonificationFx; onFxChange: (fx: SonificationFx) => void;
    params: { fm?: FmParams; granular?: GranularParams, delay?: DelayParams, reverb?: ReverbParams, distortion?: DistortionParams };
    onParamChange: (paramKey: SourceParameterKey, newParams: any) => void;
    samples: Sample[]; 
    waveform: Waveform;
}> = ({ label, isChecked, onCheckChange, assignedSource, onSourceChange, assignedBlend, onBlendChange, assignedFx, onFxChange, samples, waveform, params, onParamChange }) => {
    const [isAdvanced, setIsAdvanced] = useState(false);
    
    const sourceOptions = [
        {value: 'oscillator', label: 'Oscillator'}, 
        {value: 'white_noise', label: 'White Noise'}, 
        {value: 'pink_noise', label: 'Pink Noise'}, 
        {value: 'brown_noise', label: 'Brown Noise'},
        {value: 'rhythmic_pulse', label: 'Rhythmic Pulse'},
    ];
    if (samples.length > 0) {
        sourceOptions.push({value: 'granular', label: 'Granular'});
    }
    sourceOptions.push(...samples.map(s => ({ value: s.id, label: s.name })));

    const blendOptions = [
        {value: '100', label: '100%'}, {value: '75', label: '75%'},
        {value: '50', label: '50%'}, {value: '25', label: '25%'},
        {value: 'dynamic', label: 'Dynamic'},
    ];

    const showFm = waveform === 'fm' && assignedSource === 'oscillator';
    const showGranular = assignedSource === 'granular';
    const showDelay = assignedFx === 'delay';
    const showReverb = assignedFx === 'reverb';
    const showDistortion = assignedFx === 'distortion';
    const hasAdvanced = showFm || showGranular || showDelay || showReverb || showDistortion;
    
    const fmParams = params.fm || { harmonicity: 1.5, modIndex: 5 };
    const granularParams = params.granular || { grainRate: 30, grainDuration: 0.08, jitter: 0.5 };
    const delayParams = params.delay || { time: 0.3, feedback: 0.5 };
    const reverbParams = params.reverb || { mix: 0.5 };
    const distortionParams = params.distortion || { amount: 0.5 };


    return (
        <div className="bg-bg-primary/50 rounded-md p-2 space-y-2">
            <div className="grid grid-cols-6 items-center gap-2">
                <div className="col-span-2 flex items-center space-x-2">
                    <input type="checkbox" checked={isChecked} onChange={(e) => onCheckChange(e.target.checked)} className="form-checkbox h-5 w-5 rounded bg-bg-tertiary border-border-primary focus:ring-accent-primary" style={{ color: 'var(--accent-primary)' }}/>
                    <span className="text-text-primary text-sm font-semibold flex-grow">{label}</span>
                </div>
                <div className="w-full col-span-2">
                     <Select 
                        value={assignedSource || 'oscillator'} 
                        onChange={onSourceChange} 
                        options={sourceOptions}
                    />
                </div>
                <div className="w-full col-span-1">
                     <Select 
                        value={assignedBlend || '100'} 
                        onChange={onBlendChange} 
                        options={blendOptions}
                    />
                </div>
                 <div className="w-full col-span-1">
                     <Select 
                        value={assignedFx || 'none'} 
                        onChange={onFxChange} 
                        options={[ {value: 'none', label: 'FX'}, {value: 'distortion', label: 'Distort'}, {value: 'delay', label: 'Delay'}, {value: 'reverb', label: 'Reverb'} ]}
                    />
                </div>
            </div>
            {hasAdvanced && (
                <div className="text-right">
                    <button onClick={() => setIsAdvanced(!isAdvanced)} className="text-xs text-accent-primary hover:underline">
                        {isAdvanced ? 'Hide' : 'Show'} Advanced
                    </button>
                </div>
            )}
            {isAdvanced && isChecked && (
                <div className="bg-bg-primary p-3 rounded-md mt-2 space-y-3">
                    {showFm && (
                        <>
                            <h5 className="text-sm font-bold text-text-secondary">FM Settings</h5>
                            <Slider label="Harmonicity" value={fmParams.harmonicity} min={0.1} max={8} step={0.05} onChange={v => onParamChange('fm', {...fmParams, harmonicity: v})} />
                            <Slider label="Mod Index" value={fmParams.modIndex} min={0} max={20} step={0.1} onChange={v => onParamChange('fm', {...fmParams, modIndex: v})} />
                        </>
                    )}
                     {showGranular && (
                        <>
                            <h5 className="text-sm font-bold text-text-secondary">Granular Settings</h5>
                            <Slider label="Grain Rate (hz)" value={granularParams.grainRate} min={5} max={100} step={1} onChange={v => onParamChange('granular', {...granularParams, grainRate: v})} />
                            <Slider label="Grain Duration (s)" value={granularParams.grainDuration} min={0.01} max={0.2} step={0.005} onChange={v => onParamChange('granular', {...granularParams, grainDuration: v})} />
                            <Slider label="Jitter" value={granularParams.jitter} min={0} max={1} step={0.01} onChange={v => onParamChange('granular', {...granularParams, jitter: v})} />
                        </>
                    )}
                     {showDelay && (
                        <>
                            <h5 className="text-sm font-bold text-text-secondary">Delay Settings</h5>
                            <Slider label="Time (s)" value={delayParams.time} min={0.01} max={1.0} step={0.01} onChange={v => onParamChange('delay', {...delayParams, time: v})} />
                            <Slider label="Feedback" value={delayParams.feedback} min={0} max={0.95} step={0.01} onChange={v => onParamChange('delay', {...delayParams, feedback: v})} />
                        </>
                    )}
                    {showReverb && (
                        <>
                            <h5 className="text-sm font-bold text-text-secondary">Reverb Settings</h5>
                            <Slider label="Mix" value={reverbParams.mix} min={0} max={1} step={0.01} onChange={v => onParamChange('reverb', {...reverbParams, mix: v})} />
                        </>
                    )}
                    {showDistortion && (
                        <>
                            <h5 className="text-sm font-bold text-text-secondary">Distortion Settings</h5>
                            <Slider label="Amount" value={distortionParams.amount} min={0} max={1} step={0.01} onChange={v => onParamChange('distortion', {...distortionParams, amount: v})} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const SampleManager: React.FC<{ samples: Sample[]; onSamplesChange: (s: Sample[]) => void }> = ({ samples, onSamplesChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const newSample: Sample = {
                id: crypto.randomUUID(),
                name: file.name.replace(/\.[^/.]+$/, "").slice(0, 20),
                buffer: audioBuffer,
            };
            onSamplesChange([...samples, newSample]);
        } catch (e) {
            console.error("Error loading sample:", e);
            setError("Failed to load audio file. Please use a valid format (e.g., wav, mp3).");
        } finally {
            setIsLoading(false);
            event.target.value = ''; // Reset file input
        }
    }, [samples, onSamplesChange]);
    
    return (
        <div className="space-y-3">
             <h4 className="text-md font-semibold text-text-primary">Custom Samples</h4>
            <div>
                <label className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-secondary bg-accent-primary hover:bg-accent-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    {isLoading ? 'Loading...' : 'Upload Audio Sample'}
                    <input type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} disabled={isLoading} />
                </label>
            </div>
            {error && <p className="text-sm text-accent-secondary">{error}</p>}
            <div className="space-y-2">
                {samples.map(sample => (
                    <div key={sample.id} className="text-xs bg-bg-primary p-2 rounded text-text-secondary">{sample.name}</div>
                ))}
                 {samples.length === 0 && <p className="text-xs text-text-secondary text-center py-2">No custom samples loaded.</p>}
            </div>
        </div>
    );
};


export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const { isMobileView, visualizerComponent, sonificationEngine, onThemeChange, activePresetKey, onPresetChange, sonificationRules, onSonificationRulesChange, sonificationSelection, onSonificationSelectionChange, showLabels, onShowLabelsChange, isMuted, onIsMutedChange, samples, onSamplesChange, sourceAssignments, onSourceAssignmentChange, blendAssignments, onBlendAssignmentChange, fxAssignments, onFxAssignmentChange, sourceParameters, onSourceParameterChange, description, playbackMode, onPlaybackModeChange, fadeoutTime, onFadeoutTimeChange, aiStyle, onAiStyleChange, aiNotes, onAiNotesChange, isGenerating, generationError, generatedExplanation, onGenerate, onExport, onImport, interactionMode, onInteractionModeChange, isFullScreen, onToggleFullScreen, rhythmSettings, onRhythmSettingsChange, rhythmSourceMapping, onRhythmSourceMappingChange, sonifiableValues } = props;
    
    const activePreset = presets[activePresetKey];
    const [activeTab, setActiveTab] = useState<'geometry' | 'synthesis' | 'rhythm' | 'distiller' | 'settings'>('geometry');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const importFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (generatedExplanation && activeTab !== 'distiller') {
            setActiveTab('distiller');
        }
    }, [generatedExplanation, activeTab]);
    
    const handleInteractionStart = useCallback(() => {
        if (playbackMode === 'interactive' && !rhythmSettings.isEnabled) {
            sonificationEngine.start();
        }
    }, [playbackMode, sonificationEngine, rhythmSettings.isEnabled]);

    const handleInteractionEnd = useCallback(() => {
        if (playbackMode === 'interactive' && !rhythmSettings.isEnabled) {
            sonificationEngine.stop();
        }
    }, [playbackMode, sonificationEngine, rhythmSettings.isEnabled]);

    const InteractiveSlider: React.FC<Omit<React.ComponentProps<typeof Slider>, 'onMouseDown' | 'onMouseUp'>> = (sliderProps) => (
        <Slider {...sliderProps} onMouseDown={handleInteractionStart} onMouseUp={handleInteractionEnd} />
    );
    
    const handleRhythmMappingChange = (drum: DrumType, param: RhythmParameter, value: string) => {
        const newMapping = { ...rhythmSourceMapping };
        if (!newMapping[drum]) newMapping[drum] = {};
        newMapping[drum]![param] = value;
        onRhythmSourceMappingChange(newMapping);
    };

    const renderPresetControls = () => {
        const Ssc: React.FC<{ label: string; valueKey: string }> = ({ valueKey, label }) => {
            return (<SonificationSourceControl 
                label={label}
                isChecked={!!sonificationSelection[valueKey]}
                assignedSource={sourceAssignments[valueKey]}
                assignedBlend={blendAssignments[valueKey]}
                assignedFx={fxAssignments[valueKey]}
                onCheckChange={(c) => onSonificationSelectionChange(valueKey, c)}
                onSourceChange={(id) => onSourceAssignmentChange(valueKey, id)}
                onBlendChange={(mode) => onBlendAssignmentChange(valueKey, mode)}
                onFxChange={(fx) => onFxAssignmentChange(valueKey, fx)}
                params={sourceParameters[valueKey] || {}}
                onParamChange={(paramKey, newParams) => onSourceParameterChange(valueKey, paramKey, newParams)}
                samples={samples}
                waveform={sonificationRules.waveform}
            />);
        };

        switch (activePresetKey) {
            case 'euclid_I_47':
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Side A" value={props.euclidI47Data.a} min={10} max={150} onChange={(val) => props.onEuclidI47Change({ ...props.euclidI47Data, a: val })} />
                        <InteractiveSlider label="Side B" value={props.euclidI47Data.b} min={10} max={150} onChange={(val) => props.onEuclidI47Change({ ...props.euclidI47Data, b: val })} />
                        <div className="pt-4 space-y-2">
                            <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                            <Ssc label="Side A" valueKey="a" />
                            <Ssc label="Side B" valueKey="b" />
                            <Ssc label="Hypotenuse C" valueKey="c" />
                        </div>
                    </div>
                );
            case 'euclid_I_1':
                 return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Line Length" value={props.euclidI1Data.size} min={50} max={250} onChange={(val) => props.onEuclidI1Change({ size: val })} />
                         <div className="pt-4 space-y-2">
                            <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                            <Ssc label="Side Length" valueKey="side" />
                            <Ssc label="Height" valueKey="height" />
                        </div>
                    </div>
                );
            case 'euclid_II_5':
                 return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Line AB Length" value={props.euclidII5Data.ab} min={50} max={250} onChange={(val) => props.onEuclidII5Change({ ...props.euclidII5Data, ab: val })} />
                        <InteractiveSlider label="Point C Position" value={props.euclidII5Data.c} min={1} max={props.euclidII5Data.ab -1} onChange={(val) => props.onEuclidII5Change({ ...props.euclidII5Data, c: val })} />
                         <div className="pt-4 space-y-2">
                            <h4 className="text-md font-semibold text-text-primary mb-2">Sonify Areas:</h4>
                            <Ssc label="Gnomon (g)" valueKey="g" />
                            <Ssc label="Inner Square (h)" valueKey="h" />
                            <Ssc label="Rectangle (a)" valueKey="a" />
                        </div>
                    </div>
                );
            case 'circle_ratios':
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Radius" value={props.circleData.radius} min={10} max={150} onChange={(val) => props.onCircleChange({ radius: val })} />
                        <div className="pt-4 space-y-2">
                           <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                            <Ssc label="Radius" valueKey="radius" />
                            <Ssc label="Circumference" valueKey="circumference" />
                            <Ssc label="Area" valueKey="area" />
                        </div>
                    </div>
                );
            case 'euclid_I_5':
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Side Length" value={props.euclidIData.ab} min={50} max={200} onChange={(val) => props.onEuclidIChange({ ab: val })} />
                        <div className="pt-4 space-y-2">
                           <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                            <Ssc label="Equal Sides" valueKey="side" />
                            <Ssc label="Base" valueKey="base" />
                        </div>
                    </div>
                );
            case 'thales_theorem':
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Angle" value={props.thalesData.angle} min={5} max={175} onChange={(val) => props.onThalesChange({ angle: val })} />
                         <div className="pt-4 space-y-2">
                           <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                            <Ssc label="Side A" valueKey="a" />
                            <Ssc label="Side B" valueKey="b" />
                            <Ssc label="Diameter" valueKey="diameter" />
                        </div>
                    </div>
                );
            case 'fibonacci_spiral':
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Count" value={props.fibonacciData.count} min={1} max={11} onChange={(val) => props.onFibonacciChange({ ...props.fibonacciData, count: val })} />
                        <InteractiveSlider label="Base Size" value={props.fibonacciData.size} min={1} max={20} onChange={(val) => props.onFibonacciChange({ ...props.fibonacciData, size: val })} />
                        
                        <div className="pt-2 space-y-2 overflow-y-auto max-h-48 pr-2">
                            <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                             <Ssc label="Total Length" valueKey="length" />
                            {Array.from({ length: 11 }, (_, i) => (
                                <Ssc 
                                    key={i}
                                    label={`Step ${i + 1}`} 
                                    valueKey={`step${i + 1}`} 
                                />
                            ))}
                        </div>
                    </div>
                );
             case 'fibonacci_circles':
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Count" value={props.fibonacciCirclesData.count} min={1} max={11} onChange={(val) => props.onFibonacciCirclesChange({ count: val })} />
                        <div className="pt-4 space-y-2 overflow-y-auto max-h-48 pr-2">
                            <h4 className="text-md font-semibold text-text-primary mb-2">Sonify Radii:</h4>
                            {Array.from({ length: 11 }, (_, i) => (
                                <Ssc 
                                    key={i}
                                    label={`Radius ${i + 1}`} 
                                    valueKey={`radius${i + 1}`} 
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'golden_ratio_from_square':
                 return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Square Size" value={props.goldenRatioSquareData.size} min={20} max={150} onChange={(val) => props.onGoldenRatioSquareChange({ size: val })} />
                        <div className="pt-4 space-y-2">
                           <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                            <Ssc label="Square Side (a)" valueKey="size" />
                            <Ssc label="Segment (b)" valueKey="segment_b" />
                            <Ssc label="Total (a+b)" valueKey="total" />
                        </div>
                    </div>
                );
            case 'silver_ratio':
                 return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Base Size" value={props.silverRatioData.size} min={20} max={120} onChange={(val) => props.onSilverRatioChange({ size: val })} />
                        <div className="pt-4 space-y-2">
                           <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                            <Ssc label="Side a" valueKey="a" />
                            <Ssc label="Side b" valueKey="b" />
                            <Ssc label="Total" valueKey="total" />
                        </div>
                    </div>
                );
             case 'flower_of_life':
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Steps" value={props.flowerOfLifeData.steps} min={1} max={7} onChange={(val) => props.onFlowerOfLifeChange({ steps: val })} />
                        <div className="pt-4 space-y-2">
                           <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                            <Ssc label="Circle Count" valueKey="circles" />
                            <Ssc label="Vesica Piscis" valueKey="vesicaPiscis" />
                        </div>
                    </div>
                );
            case 'eye_of_horus':
                const fractions = ["1/2", "1/4", "1/8", "1/16", "1/32", "1/64"];
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label={`Fraction: ${fractions[props.eyeOfHorusData.fraction]}`} value={props.eyeOfHorusData.fraction} min={0} max={5} onChange={(val) => props.onEyeOfHorusChange({ fraction: val })} />
                        <div className="pt-4 space-y-2">
                           <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                             <Ssc label="Selected Fraction" valueKey={`fraction`} />
                        </div>
                    </div>
                );
             case 'lituus_spiral':
                return (
                    <div className="space-y-4">
                        <InteractiveSlider label="Constant 'a'" value={props.lituusSpiralData.a} min={20} max={150} onChange={(val) => props.onLituusSpiralChange({...props.lituusSpiralData, a: val })} />
                        <InteractiveSlider label="Rotations" value={props.lituusSpiralData.rotations} min={1} max={10} onChange={(val) => props.onLituusSpiralChange({...props.lituusSpiralData, rotations: val })} />
                        <div className="pt-4 space-y-2">
                           <h4 className="text-md font-semibold text-text-primary mb-2">Sonify:</h4>
                             <Ssc label="Radius" valueKey="radius" />
                             <Ssc label="Angle" valueKey="angle" />
                        </div>
                    </div>
                );
            default:
                return <div className="text-text-secondary">Controls not available.</div>;
        }
    };
    
    const TabButton: React.FC<{label?: string, target: 'geometry' | 'synthesis' | 'rhythm' | 'distiller' | 'settings', icon?: React.ReactNode}> = ({label, icon, target}) => (
        <button onClick={() => setActiveTab(target)} className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-x-2 ${activeTab === target ? 'bg-accent-primary text-white' : 'bg-bg-tertiary/50 text-text-primary hover:bg-bg-primary'}`}>
            {icon}
            {label && <span className="hidden sm:inline">{label}</span>}
        </button>
    );
    
    const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734-2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
    const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
    const FullScreenEnterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 1v-4m0 0h-4m4 0l-5 5" /></svg>;
    const FullScreenExitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4H8a2 2 0 00-2 2v2m4-4h4m-4 0l-5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 1v-4m0 0h-4m4 0l-5 5" /></svg>;
    const MusicNoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3z" /></svg>;
    const GeometryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16.5A1.5 1.5 0 014 15V5a1.5 1.5 0 011.5-1.5h1.75a.75.75 0 010 1.5H5.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V8.75a.75.75 0 011.5 0V15a1.5 1.5 0 01-1.5 1.5h-10z" /><path d="M16 3.5a1.5 1.5 0 01-1.5 1.5h-1a.75.75 0 010-1.5h1A1.5 1.5 0 0116 3.5zM12.5 5a.75.75 0 010-1.5h3a.75.75 0 010 1.5h-3zM9 11.5a.75.75 0 01-.53-1.28l5-5a.75.75 0 011.06 1.06l-5 5A.75.75 0 019 11.5z" /></svg>;
    const SynthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>;

    return (
        <div className="p-4 lg:p-6 h-full flex flex-col">
            {isInfoModalOpen && <InfoModal title={activePreset.name} description={description} onClose={() => setIsInfoModalOpen(false)} />}
            
            {/* --- FIXED HEADER --- */}
            <header className="flex-shrink-0 space-y-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">Euclid Sonifier</h1>
                    <p className="text-text-secondary">Exploring math through sound</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="preset-select" className="text-sm font-medium text-text-secondary">Preset</label>
                        <button onClick={() => setIsInfoModalOpen(true)} className="text-text-secondary hover:text-accent-primary" title="About this preset">
                             <InfoIcon />
                        </button>
                    </div>
                     <Select 
                        value={activePresetKey} 
                        onChange={onPresetChange} 
                        options={(Object.keys(presets) as PresetKey[]).map(key => ({value: key, label: presets[key].name}))}
                    />
                </div>
                 <div className="bg-bg-secondary rounded-lg p-1 flex space-x-1 border border-border-primary">
                    <TabButton label="Geometry" target="geometry" icon={<GeometryIcon />} />
                    <TabButton label="Synthesis" target="synthesis" icon={<SynthIcon />} />
                    <TabButton target="rhythm" icon={<MusicNoteIcon />} />
                    <TabButton target="distiller" icon={<AiIcon />} />
                    <TabButton target="settings" icon={<GearIcon />} />
                </div>
            </header>
            
            {/* --- MOBILE VISUALIZER (Conditional) --- */}
            {isMobileView && (
                <div className="flex-shrink-0 h-1/2 lg:h-auto my-4 border-y border-border-primary bg-bg-secondary">
                    {visualizerComponent}
                </div>
            )}
            
            {/* --- SCROLLABLE CONTENT AREA --- */}
            <div className="flex-grow overflow-y-auto mt-4 pr-2 -mr-4">
                 <div className="space-y-6">
                    {activeTab === 'geometry' && (
                        <div className="space-y-4">
                            {renderPresetControls()}
                        </div>
                    )}
                    {activeTab === 'synthesis' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-text-primary">Global Synthesis</h3>
                                 <Select 
                                    label="Waveform"
                                    value={sonificationRules.waveform}
                                    onChange={(val: Waveform) => onSonificationRulesChange({ ...sonificationRules, waveform: val })}
                                    options={[ { value: 'sine', label: 'Sine' }, { value: 'square', label: 'Square' }, { value: 'sawtooth', label: 'Sawtooth' }, { value: 'triangle', label: 'Triangle' }, { value: 'pulse', label: 'Pulse' }, { value: 'fm', label: 'FM Synthesis' } ]}
                                />
                                <Select 
                                    label="Sonification Mode"
                                    value={sonificationRules.mode}
                                    onChange={(val: SonificationMode) => onSonificationRulesChange({ ...sonificationRules, mode: val })}
                                    options={[ { value: 'pitch', label: 'Pitch / Rate' }, { value: 'volume', label: 'Amplitude' }, { value: 'filter', label: 'Filter Cutoff' } ]}
                                />
                                <InteractiveSlider label="Base Frequency (Hz)" value={sonificationRules.baseFrequency} min={55} max={880} onChange={(val) => onSonificationRulesChange({ ...sonificationRules, baseFrequency: val })} />
                                <Select 
                                    label="Musical Scale"
                                    value={sonificationRules.scale}
                                    onChange={(val: MusicalScale) => onSonificationRulesChange({ ...sonificationRules, scale: val })}
                                    options={[ { value: 'major', label: 'Major' }, { value: 'minor_pentatonic', label: 'Minor Pentatonic' }, { value: 'chromatic', label: 'Chromatic' }, { value: 'dorian', label: 'Dorian' }, { value: 'phrygian', label: 'Phrygian' }, { value: 'lydian', label: 'Lydian' }, { value: 'mixolydian', label: 'Mixolydian' }, { value: 'blues', label: 'Blues' } ]}
                                />
                                <Select 
                                    label="Granular Mod Target"
                                    value={sonificationRules.granularModulationTarget}
                                    onChange={(val: GranularModulationTarget) => onSonificationRulesChange({ ...sonificationRules, granularModulationTarget: val })}
                                    options={[ { value: 'pitch', label: 'Pitch / Playback Rate' }, { value: 'rate', label: 'Grain Rate' }, { value: 'duration', label: 'Grain Duration' } ]}
                                />
                            </div>

                            <div className="space-y-4 border-t border-border-primary pt-4">
                                <h3 className="text-lg font-bold text-text-primary">LFO Modulation</h3>
                                <Select label="LFO Target" value={sonificationRules.lfo.target} onChange={(v: LfoTarget) => onSonificationRulesChange({...sonificationRules, lfo: {...sonificationRules.lfo, target: v}})} options={[ {value: 'none', label: 'None'}, {value: 'pitch', label: 'Pitch (Vibrato)'}, {value: 'volume', label: 'Volume (Tremolo)'}, {value: 'filter', label: 'Filter Cutoff'} ]} />
                                <Select label="LFO Waveform" value={sonificationRules.lfo.waveform} onChange={(v: Waveform) => onSonificationRulesChange({...sonificationRules, lfo: {...sonificationRules.lfo, waveform: v}})} options={[ { value: 'sine', label: 'Sine' }, { value: 'square', label: 'Square' }, { value: 'sawtooth', label: 'Sawtooth' }, { value: 'triangle', label: 'Triangle' } ]} />
                                <InteractiveSlider label="LFO Rate (Hz)" value={sonificationRules.lfo.rate} min={0.1} max={20} step={0.1} onChange={v => onSonificationRulesChange({...sonificationRules, lfo: {...sonificationRules.lfo, rate: v}})} />
                                <InteractiveSlider label="LFO Depth" value={sonificationRules.lfo.depth} min={0} max={1} step={0.01} onChange={v => onSonificationRulesChange({...sonificationRules, lfo: {...sonificationRules.lfo, depth: v}})} />
                                <Select label="Geometric Value Modulates" value={sonificationRules.lfoModulationTarget} onChange={(v: LfoModulationTarget) => onSonificationRulesChange({...sonificationRules, lfoModulationTarget: v})} options={[ {value: 'rate', label: 'LFO Rate'}, {value: 'depth', label: 'LFO Depth'} ]} />
                            </div>

                            <div className="border-t border-border-primary pt-4">
                                <SampleManager samples={samples} onSamplesChange={onSamplesChange} />
                            </div>
                        </div>
                    )}
                     {activeTab === 'rhythm' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-text-primary">Rhythm Engine</h3>
                            <Switch label="Enable Rhythm" checked={rhythmSettings.isEnabled} onChange={c => onRhythmSettingsChange({...rhythmSettings, isEnabled: c})}/>
                             <Slider label={`BPM: ${rhythmSettings.bpm.toFixed(0)}`} value={rhythmSettings.bpm} min={40} max={240} step={1} onChange={v => onRhythmSettingsChange({...rhythmSettings, bpm: v})} />
                            
                            <div className="space-y-4 border-t border-border-primary pt-4">
                                <h4 className="text-md font-semibold text-text-primary">Mixer</h4>
                                <Slider label="Kick Vol" value={rhythmSettings.kickVolume} min={0} max={1.5} step={0.05} onChange={v => onRhythmSettingsChange({...rhythmSettings, kickVolume: v})} />
                                <Slider label="Snare Vol" value={rhythmSettings.snareVolume} min={0} max={1.5} step={0.05} onChange={v => onRhythmSettingsChange({...rhythmSettings, snareVolume: v})} />
                                <Slider label="Hat Vol" value={rhythmSettings.hatVolume} min={0} max={1.5} step={0.05} onChange={v => onRhythmSettingsChange({...rhythmSettings, hatVolume: v})} />
                                <Switch label="Harmonic Bass" checked={rhythmSettings.harmonicBass} onChange={c => onRhythmSettingsChange({...rhythmSettings, harmonicBass: c})} />
                            </div>

                             <div className="space-y-4 border-t border-border-primary pt-4">
                                <h4 className="text-md font-semibold text-text-primary">Euclidean Patterns</h4>
                                <p className="text-xs text-text-secondary">Map geometric values to control the number of pulses and total steps for each drum part.</p>
                                <div className="bg-bg-secondary p-2 rounded-lg">
                                    <div className="grid grid-cols-4 gap-2 text-center items-center">
                                        <div className="text-sm font-bold text-text-secondary">Drum</div>
                                        <div className="text-sm font-bold text-text-secondary">Pulses</div>
                                        <div className="text-sm font-bold text-text-secondary">Steps</div>
                                        <div className="text-sm font-bold text-text-secondary">Offset</div>
                                        
                                        {(['kick', 'snare', 'hat'] as DrumType[]).map(drum => (
                                            <React.Fragment key={drum}>
                                                <div className="font-bold text-text-primary capitalize text-sm">{drum}</div>
                                                <Select value={rhythmSourceMapping[drum]?.pulses || 'none'} onChange={v => handleRhythmMappingChange(drum, 'pulses', v)} options={[{value: 'none', label:'None'}, ...sonifiableValues.map(s => ({value: s, label: s}))]} />
                                                <Select value={rhythmSourceMapping[drum]?.steps || 'none'} onChange={v => handleRhythmMappingChange(drum, 'steps', v)} options={[{value: 'none', label:'None'}, ...sonifiableValues.map(s => ({value: s, label: s}))]} />
                                                <Select value={rhythmSourceMapping[drum]?.offset || 'none'} onChange={v => handleRhythmMappingChange(drum, 'offset', v)} options={[{value: 'none', label:'None'}, ...sonifiableValues.map(s => ({value: s, label: s}))]} />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'distiller' && (
                        <div className="space-y-5">
                            <h3 className="text-lg font-bold text-text-primary">AI Distiller</h3>
                            <p className="text-sm text-text-secondary">Let the AI creatively interpret the current mathematical concept and generate a complete sound patch for you.</p>
                            
                            <Select 
                                label="Creative Style"
                                value={aiStyle}
                                onChange={onAiStyleChange}
                                options={[
                                    { value: 'ambient', label: 'Ambient & Atmospheric' },
                                    { value: 'rhythmic', label: 'Rhythmic & Pulsating' },
                                    { value: 'melodic', label: 'Melodic & Harmonic' },
                                    { value: 'experimental', label: 'Experimental & Abstract' },
                                ]}
                            />
                            <div>
                                <label className="text-sm font-medium text-text-secondary">Creative Notes (Optional)</label>
                                <textarea
                                    value={aiNotes}
                                    onChange={e => onAiNotesChange(e.target.value)}
                                    rows={3}
                                    placeholder="e.g., 'make it sound like space', 'use a dark, minor key', 'focus on the rhythm'"
                                    className="mt-1 w-full bg-bg-primary border border-border-primary text-text-primary p-2 rounded-md text-sm focus:outline-none focus:border-accent-primary"
                                />
                            </div>

                            <button onClick={onGenerate} disabled={isGenerating} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-secondary bg-accent-primary hover:bg-accent-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                                {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Generate Sound Patch'}
                            </button>

                            {(generationError || generatedExplanation) && (
                                <div className="border-t border-border-primary pt-4 space-y-2">
                                     <h4 className="text-md font-semibold text-text-primary">AI Rationale</h4>
                                     {generationError && <p className="text-sm text-accent-secondary bg-accent-secondary/10 p-3 rounded-md">{generationError}</p>}
                                     {generatedExplanation && <p className="text-sm text-text-secondary bg-bg-tertiary/40 p-3 rounded-md whitespace-pre-wrap">{generatedExplanation}</p>}
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'settings' && (
                         <div className="space-y-6">
                            <div className='space-y-4'>
                                <h3 className="text-lg font-bold text-text-primary">Engine Settings</h3>
                                 <Select
                                     label="Playback Mode"
                                     value={playbackMode}
                                     onChange={onPlaybackModeChange}
                                     options={[
                                         { value: 'continuous', label: 'Continuous' },
                                         { value: 'fadeout', label: 'Fadeout' },
                                         { value: 'interactive', label: 'Interactive' },
                                     ]}
                                 />
                                 {playbackMode === 'fadeout' && (
                                     <InteractiveSlider
                                         label="Fadeout Time (s)"
                                         value={fadeoutTime}
                                         min={1}
                                         max={10}
                                         step={0.5}
                                         onChange={onFadeoutTimeChange}
                                     />
                                 )}
                                 <Select
                                     label="Normalization Mode"
                                     value={sonificationRules.normalization}
                                     onChange={(v: NormalizationMode) => onSonificationRulesChange({...sonificationRules, normalization: v})}
                                     options={[
                                         { value: 'none', label: 'None' },
                                         { value: 'global', label: 'Global' },
                                     ]}
                                 />
                                <InteractiveSlider 
                                    label="Max Polyphony"
                                    value={sonificationRules.maxPolyphony}
                                    min={1}
                                    max={20}
                                    step={1}
                                    onChange={(v) => onSonificationRulesChange({...sonificationRules, maxPolyphony: v})}
                                />
                            </div>
                            <div className='space-y-4 border-t border-border-primary pt-4'>
                                 <h3 className="text-lg font-bold text-text-primary">Interaction Settings</h3>
                                  <Select
                                     label="Interaction Mode"
                                     value={interactionMode}
                                     onChange={onInteractionModeChange}
                                     options={[
                                         { value: 'touchpad', label: 'Touchpad (Filter Control)' },
                                         { value: 'direct', label: 'Direct Manipulation' },
                                         { value: 'freeform', label: 'Freeform (Drag Anywhere)' },
                                         { value: 'none', label: 'None' },
                                     ]}
                                 />
                            </div>
                             <div className='space-y-4 border-t border-border-primary pt-4'>
                                 <h3 className="text-lg font-bold text-text-primary">Manage Preset</h3>
                                 <div className="flex space-x-2">
                                     <input type="file" ref={importFileRef} className="hidden" accept=".json" onChange={onImport} />
                                     <button onClick={() => importFileRef.current?.click()} className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-bg-tertiary hover:bg-border-primary transition-colors">Import Preset</button>
                                     <button onClick={onExport} className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-bg-tertiary hover:bg-border-primary transition-colors">Export Preset</button>
                                 </div>
                            </div>
                         </div>
                    )}
                 </div>
            </div>

            {/* --- FIXED FOOTER --- */}
            <footer className="flex-shrink-0 flex justify-between items-center pt-4 border-t border-border-primary">
                 <div className="flex items-center space-x-4">
                    <Switch label="Show Labels" checked={showLabels} onChange={onShowLabelsChange} />
                     <Select 
                        value={props.theme}
                        onChange={onThemeChange}
                        options={[{value: 'dark', label: 'Dark'}, {value: 'byrne', label: `Byrne`}]}
                    />
                 </div>
                <div className="flex items-center space-x-2">
                    <button onClick={props.onToggleFullScreen} className="p-2 bg-bg-tertiary hover:bg-border-primary rounded-full transition-colors" aria-label={props.isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}>
                        {props.isFullScreen ? <FullScreenExitIcon /> : <FullScreenEnterIcon />}
                    </button>
                    <button onClick={() => onIsMutedChange(!isMuted)} className="p-2 bg-bg-tertiary hover:bg-border-primary rounded-full transition-colors self-center" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
};
