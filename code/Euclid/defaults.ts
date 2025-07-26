
import { SonificationRules, RhythmSettings, InteractionMode, PlaybackMode, ThemeName, AIStyle } from './types';
import { PresetKey } from './constants';

export const defaultSettings = {
    theme: 'dark' as ThemeName,
    activePresetKey: 'euclid_I_47' as PresetKey,
    
    // User-requested defaults
    playbackMode: 'interactive' as PlaybackMode,
    interactionMode: 'freeform' as InteractionMode,
    
    // Other practical defaults
    fadeoutTime: 3,
    showLabels: true,
    isMuted: false,
    aiStyle: 'ambient' as AIStyle,
    aiNotes: '',

    sonificationRules: {
        baseFrequency: 220,
        mapping: 'length_to_freq',
        waveform: 'sine',
        scale: 'major',
        mode: 'pitch',
        normalization: 'none',
        granularModulationTarget: 'pitch',
        lfo: {
            target: 'none',
            waveform: 'sine',
            rate: 2,
            depth: 0.25,
        },
        lfoModulationTarget: 'rate',
        maxPolyphony: 10,
    } as SonificationRules,
    
    rhythmSettings: {
        isEnabled: false,
        bpm: 120,
        kickVolume: 0.8,
        snareVolume: 0.7,
        hatVolume: 0.5,
        harmonicBass: false,
    } as RhythmSettings,
};
