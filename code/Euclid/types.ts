
import { PresetKey, presets } from './constants';

export type ThemeName = 'dark' | 'byrne';
export type Preset = (typeof presets)[PresetKey];
export type PlaybackMode = 'continuous' | 'fadeout' | 'interactive';
export type NormalizationMode = 'none' | 'global';
export type InteractionMode = 'touchpad' | 'direct' | 'freeform' | 'none';
export type BlendMode = '100' | '75' | '50' | '25' | 'dynamic';


export interface EuclidI47Data { // Formerly PythagorasData
    a: number;
    b: number;
}

export interface EuclidI1Data {
    size: number;
}

export interface EuclidII5Data {
    ab: number;
    c: number;
}

export interface CircleData {
    radius: number;
}

export interface EuclidIData {
    ab: number; // Length of the two equal sides
}

export interface GoldenRatioData {
    segmentA: number; // Length of the larger segment
}

export interface ThalesData {
    angle: number; // Angle of the point on the circumference
}

export interface FibonacciData {
    count: number; // Number of segments in the spiral
    size: number; // Base size of the first square
}

export interface FibonacciCirclesData {
    count: number; // Number of circles to draw
}

export interface GoldenRatioSquareData {
    size: number; // Size of the initial square
}

export interface SilverRatioData {
    size: number; // Size of the initial square
}

export interface EyeOfHorusData {
    fraction: number; // Index of the fraction to highlight
}

export interface FlowerOfLifeData {
    steps: number; // Number of steps/circles to draw
}

export interface LituusSpiralData {
    a: number; // 'a' constant in r^2 = a^2/theta
    rotations: number;
}


export type GeometryData = EuclidI47Data | CircleData | EuclidIData | GoldenRatioData | ThalesData | FibonacciData | FibonacciCirclesData | GoldenRatioSquareData | SilverRatioData | EyeOfHorusData | FlowerOfLifeData | LituusSpiralData | EuclidI1Data | EuclidII5Data;

export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'pulse' | 'fm';
export type MusicalScale = 'chromatic' | 'major' | 'minor_pentatonic' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'blues';
export type SonificationMode = 'pitch' | 'volume' | 'filter';
export type SonificationFx = 'none' | 'distortion' | 'delay' | 'reverb';
export type NoiseType = 'white_noise' | 'pink_noise' | 'brown_noise';
export type SourceType = 'oscillator' | NoiseType | 'granular' | 'rhythmic_pulse' | string; // string is sample.id
export type GranularModulationTarget = 'pitch' | 'rate' | 'duration';
export type LfoTarget = 'none' | 'pitch' | 'volume' | 'filter';
export type LfoModulationTarget = 'rate' | 'depth';


export interface FmParams {
    harmonicity: number; // ratio of modulator to carrier
    modIndex: number;    // modulation index
}

export interface GranularParams {
    grainRate: number;   // grains per second
    grainDuration: number; // in seconds
    jitter: number;      // 0-1 randomization of start position
}

export interface LfoParams {
    target: LfoTarget;
    waveform: Waveform;
    rate: number;
    depth: number;
}

export interface DelayParams {
    time: number;
    feedback: number;
}

export interface ReverbParams {
    mix: number;
}

export interface DistortionParams {
    amount: number;
}

export interface SonificationRules {
    baseFrequency: number;
    mapping: string;
    waveform: Waveform;
    scale: MusicalScale;
    mode: SonificationMode;
    normalization: NormalizationMode;
    granularModulationTarget: GranularModulationTarget;
    lfo: LfoParams;
    lfoModulationTarget: LfoModulationTarget;
    maxPolyphony: number;
}

export type SonificationSelection = {
    [key in PresetKey]?: { [valueKey: string]: boolean };
};

export type SourceAssignments = {
    [key in PresetKey]?: { [valueKey: string]: SourceType };
};

export type BlendAssignments = {
    [key in PresetKey]?: { [valueKey: string]: BlendMode };
};

export type FxAssignments = {
    [key in PresetKey]?: { [valueKey: string]: SonificationFx };
};

export type SourceParameterKey = 'fm' | 'granular' | 'delay' | 'reverb' | 'distortion';

export type PresetSourceParameters = {
    [valueKey: string]: {
        fm?: FmParams,
        granular?: GranularParams,
        delay?: DelayParams,
        reverb?: ReverbParams,
        distortion?: DistortionParams,
    }
};

export type SourceParameters = {
    [key in PresetKey]?: PresetSourceParameters;
};


export interface Sample {
    id: string;
    name: string;
    buffer: AudioBuffer;
}

export type AIStyle = 'ambient' | 'rhythmic' | 'melodic' | 'experimental';

export interface SonificationPatch {
    presetKey: PresetKey;
    geometryData: Partial<GeometryData>;
    sonificationRules: SonificationRules;
    sonificationSelection: { [valueKey: string]: boolean };
    sourceAssignments: { [valueKey: string]: SourceType };
    blendAssignments?: { [valueKey: string]: BlendMode };
    fxAssignments: { [valueKey: string]: SonificationFx };
    sourceParameters?: PresetSourceParameters;
    explanation: string | null;
}

// Rhythm Module Types
export type DrumType = 'kick' | 'snare' | 'hat';
export type RhythmParameter = 'pulses' | 'steps' | 'offset';

export interface RhythmSettings {
    isEnabled: boolean;
    bpm: number;
    kickVolume: number;
    snareVolume: number;
    hatVolume: number;
    harmonicBass: boolean;
}

export type RhythmPresetMapping = {
    [drum in DrumType]?: {
        [param in RhythmParameter]?: string; // a string key from geometry values
    }
};

export type RhythmSourceMapping = {
    [key in PresetKey]?: RhythmPresetMapping;
};

// Master Patch for unified Import/Export
export interface MasterPatch {
    presetKey: PresetKey;
    geometryData: Partial<GeometryData>;
    sonificationRules: SonificationRules;
    sonificationSelection: { [valueKey: string]: boolean };
    sourceAssignments: { [valueKey: string]: SourceType };
    blendAssignments: { [valueKey: string]: BlendMode };
    fxAssignments: { [valueKey: string]: SonificationFx };
    sourceParameters?: PresetSourceParameters;
    rhythmSettings: RhythmSettings;
    rhythmSourceMapping: RhythmPresetMapping;
    explanation: string | null;
    theme: ThemeName;
    interactionMode: InteractionMode;
}
