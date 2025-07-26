
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { GeometryVisualizer } from './components/GeometryVisualizer';
import { presets, PresetKey } from './constants';
import { Preset, EuclidI47Data, CircleData, EuclidIData, GoldenRatioSquareData, ThalesData, SonificationRules, SonificationSelection, FibonacciData, FibonacciCirclesData, SilverRatioData, EyeOfHorusData, FlowerOfLifeData, LituusSpiralData, Sample, SourceAssignments, EuclidI1Data, EuclidII5Data, FxAssignments, ThemeName, PlaybackMode, SourceParameters, SonificationPatch, GeometryData, AIStyle, InteractionMode, RhythmSettings, RhythmSourceMapping, MasterPatch, RhythmPresetMapping, BlendAssignments, BlendMode } from './types';
import { descriptions } from './descriptions';
import { SonificationEngine, SourceData } from './services/sonificationService';
import { generateSonificationPatch } from './services/geminiService';

const themes: Record<ThemeName, Record<string, string>> = {
  dark: {
    '--bg-primary': '#111827',
    '--bg-secondary': '#1F2937',
    '--bg-tertiary': '#374151',
    '--text-primary': '#F9FAFB',
    '--text-secondary': '#9CA3AF',
    '--border-primary': '#374151',
    '--accent-primary': '#3B82F6',
    '--accent-secondary': '#EF4444',
    '--accent-tertiary': '#10B981',
    '--font-family': "'Inter', sans-serif",
  },
  byrne: {
    '--bg-primary': '#F0EAD6', // Darker ivory
    '--bg-secondary': '#F8F5EC',
    '--bg-tertiary': '#DCD5C6',
    '--text-primary': '#2A2A2A',
    '--text-secondary': '#5A5A5A',
    '--border-primary': '#C9C1B2',
    '--accent-primary': '#3B82F6',
    '--accent-secondary': '#E23636',
    '--accent-tertiary': '#B58B00', // Muted gold
    '--font-family': "'Inter', sans-serif", // Switched font
  }
};

const App: React.FC = () => {
    // Core state
    const [theme, setTheme] = useState<ThemeName>('dark');
    const [activePresetKey, setActivePresetKey] = useState<PresetKey>('euclid_I_47');
    const activePreset: Preset = presets[activePresetKey];
    const sonificationEngine = useMemo(() => new SonificationEngine(), []);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const root = document.documentElement;
        const selectedTheme = themes[theme];
        for (const [key, value] of Object.entries(selectedTheme)) {
            root.style.setProperty(key, value);
        }
    }, [theme]);
    
    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        return () => sonificationEngine.stop(true);
    }, [sonificationEngine]);

    // Geometry data states
    const [euclidI47Data, setEuclidI47Data] = useState<EuclidI47Data>({ a: 60, b: 80 });
    const [circleData, setCircleData] = useState<CircleData>({ radius: 75 });
    const [euclidIData, setEuclidIData] = useState<EuclidIData>({ ab: 120 });
    const [goldenRatioSquareData, setGoldenRatioSquareData] = useState<GoldenRatioSquareData>({ size: 100 });
    const [thalesData, setThalesData] = useState<ThalesData>({ angle: 45 });
    const [fibonacciData, setFibonacciData] = useState<FibonacciData>({ count: 8, size: 5 });
    const [fibonacciCirclesData, setFibonacciCirclesData] = useState<FibonacciCirclesData>({ count: 8 });
    const [silverRatioData, setSilverRatioData] = useState<SilverRatioData>({ size: 80 });
    const [eyeOfHorusData, setEyeOfHorusData] = useState<EyeOfHorusData>({ fraction: 0 });
    const [flowerOfLifeData, setFlowerOfLifeData] = useState<FlowerOfLifeData>({ steps: 2 });
    const [lituusSpiralData, setLituusSpiralData] = useState<LituusSpiralData>({ a: 90, rotations: 4 });
    const [euclidI1Data, setEuclidI1Data] = useState<EuclidI1Data>({ size: 150 });
    const [euclidII5Data, setEuclidII5Data] = useState<EuclidII5Data>({ ab: 200, c: 120 });

    const geometryDataSetters = {
        euclid_I_47: setEuclidI47Data,
        circle_ratios: setCircleData,
        euclid_I_5: setEuclidIData,
        golden_ratio_from_square: setGoldenRatioSquareData,
        thales_theorem: setThalesData,
        fibonacci_spiral: setFibonacciData,
        fibonacci_circles: setFibonacciCirclesData,
        silver_ratio: setSilverRatioData,
        eye_of_horus: setEyeOfHorusData,
        flower_of_life: setFlowerOfLifeData,
        lituus_spiral: setLituusSpiralData,
        euclid_I_1: setEuclidI1Data,
        euclid_II_5: setEuclidII5Data,
    };

    const handleGeometryChange = useCallback((newData: Partial<GeometryData>) => {
        const setter = geometryDataSetters[activePresetKey];
        if (setter) {
            // @ts-ignore - we know the types match up due to the key
            setter(currentData => ({ ...currentData, ...newData }));
        }
    }, [activePresetKey, geometryDataSetters]);


    // UI & Sonification states
    const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('continuous');
    const [fadeoutTime, setFadeoutTime] = useState(3); // seconds
    const [sonificationRules, setSonificationRules] = useState<SonificationRules>({
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
    });
    const [sonificationSelection, setSonificationSelection] = useState<SonificationSelection>({
        euclid_I_47: { a: true, b: true, c: false },
        euclid_I_1: { side: true, height: false },
        euclid_II_5: { g: true, h: false, a: false },
        circle_ratios: { radius: true, circumference: false, area: false },
        euclid_I_5: { side: true, base: false },
        thales_theorem: { a: true, b: false, diameter: false },
        fibonacci_spiral: { length: true },
        fibonacci_circles: { radius1: true },
        golden_ratio_from_square: { size: true, segment_b: false, total: false },
        silver_ratio: { a: true, b: false, total: false },
        eye_of_horus: { fraction: true },
        flower_of_life: { circles: true, vesicaPiscis: false },
        lituus_spiral: { radius: true, angle: false },
    });
    const [sourceAssignments, setSourceAssignments] = useState<SourceAssignments>({});
    const [blendAssignments, setBlendAssignments] = useState<BlendAssignments>({});
    const [fxAssignments, setFxAssignments] = useState<FxAssignments>({});
    const [sourceParameters, setSourceParameters] = useState<SourceParameters>({});
    const [samples, setSamples] = useState<Sample[]>([]);
    const [showLabels, setShowLabels] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [xy, setXY] = useState<{x: number, y: number}>({x: 0, y: 0});
    const [interactionMode, setInteractionMode] = useState<InteractionMode>('direct');

    // AI Distiller State
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [generatedExplanation, setGeneratedExplanation] = useState<string | null>(null);
    const [aiStyle, setAiStyle] = useState<AIStyle>('ambient');
    const [aiNotes, setAiNotes] = useState('');

    // Rhythm Module State
    const [rhythmSettings, setRhythmSettings] = useState<RhythmSettings>({
        isEnabled: false,
        bpm: 120,
        kickVolume: 0.8,
        snareVolume: 0.7,
        hatVolume: 0.5,
        harmonicBass: false,
    });
    const [rhythmSourceMapping, setRhythmSourceMapping] = useState<RhythmSourceMapping>({});

    const handleApplyAIPatch = useCallback((patch: SonificationPatch) => {
        if (presets[patch.presetKey]) {
            setActivePresetKey(patch.presetKey);
            
            const setter = geometryDataSetters[patch.presetKey];
            if (setter && patch.geometryData) {
                // @ts-ignore - we know the types match up due to the key
                setter(currentData => ({ ...currentData, ...patch.geometryData }));
            }
            
            setSonificationRules(patch.sonificationRules);
            setSonificationSelection(prev => ({...prev, [patch.presetKey]: patch.sonificationSelection}));
            setSourceAssignments(prev => ({...prev, [patch.presetKey]: patch.sourceAssignments}));
            setBlendAssignments(prev => ({...prev, [patch.presetKey]: patch.blendAssignments || {}}));
            setFxAssignments(prev => ({...prev, [patch.presetKey]: patch.fxAssignments}));
            setSourceParameters(prev => ({...prev, [patch.presetKey]: patch.sourceParameters || {}}));
            setGeneratedExplanation(patch.explanation);
        } else {
            console.error("Attempted to apply patch for an unknown preset:", patch.presetKey);
        }
    }, [geometryDataSetters]);

    const handleGeneratePatch = useCallback(async () => {
        setIsGenerating(true);
        setGenerationError(null);
        setGeneratedExplanation(null);
        try {
            const patch = await generateSonificationPatch(
                activePresetKey,
                activePreset.name,
                descriptions[activePresetKey],
                aiStyle,
                aiNotes
            );
            handleApplyAIPatch(patch as SonificationPatch);
        } catch (error) {
            console.error("Error generating patch:", error);
            setGenerationError(error instanceof Error ? error.message : "An unknown error occurred during generation.");
        } finally {
            setIsGenerating(false);
        }
    }, [activePresetKey, activePreset.name, aiStyle, aiNotes, handleApplyAIPatch]);
    
    const handleApplyMasterPatch = useCallback((patch: MasterPatch) => {
        if (presets[patch.presetKey]) {
            setActivePresetKey(patch.presetKey);
            
            const setter = geometryDataSetters[patch.presetKey];
            if (setter && patch.geometryData) {
                // @ts-ignore - we know the types match up
                setter(currentData => ({ ...currentData, ...patch.geometryData }));
            }
            
            setSonificationRules(patch.sonificationRules);
            setSonificationSelection(p => ({...p, [patch.presetKey]: patch.sonificationSelection}));
            setSourceAssignments(p => ({...p, [patch.presetKey]: patch.sourceAssignments}));
            setBlendAssignments(p => ({...p, [patch.presetKey]: patch.blendAssignments || {}}));
            setFxAssignments(p => ({...p, [patch.presetKey]: patch.fxAssignments}));
            setSourceParameters(p => ({...p, [patch.presetKey]: patch.sourceParameters || {}}));
            setRhythmSettings(patch.rhythmSettings);
            setRhythmSourceMapping(p => ({...p, [patch.presetKey]: patch.rhythmSourceMapping}));
            setGeneratedExplanation(patch.explanation || null);
            setTheme(patch.theme || 'dark');
            setInteractionMode(patch.interactionMode || 'direct');
        } else {
            console.error("Attempted to apply patch for an unknown preset:", patch.presetKey);
        }
    }, [geometryDataSetters]);

    const handleExportMasterPatch = useCallback(() => {
        const geometryData = {
            euclid_I_47: euclidI47Data, circle_ratios: circleData, euclid_I_5: euclidIData,
            golden_ratio_from_square: goldenRatioSquareData, thales_theorem: thalesData,
            fibonacci_spiral: fibonacciData, fibonacci_circles: fibonacciCirclesData,
            silver_ratio: silverRatioData, eye_of_horus: eyeOfHorusData,
            flower_of_life: flowerOfLifeData, lituus_spiral: lituusSpiralData,
            euclid_I_1: euclidI1Data, euclid_II_5: euclidII5Data
        }[activePresetKey];

        const patch: MasterPatch = {
            presetKey: activePresetKey,
            geometryData,
            sonificationRules,
            sonificationSelection: sonificationSelection[activePresetKey] || {},
            sourceAssignments: sourceAssignments[activePresetKey] || {},
            blendAssignments: blendAssignments[activePresetKey] || {},
            fxAssignments: fxAssignments[activePresetKey] || {},
            sourceParameters: sourceParameters[activePresetKey] || {},
            rhythmSettings,
            rhythmSourceMapping: rhythmSourceMapping[activePresetKey] || {},
            explanation: generatedExplanation || null,
            theme,
            interactionMode
        };

        const blob = new Blob([JSON.stringify(patch, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activePreset.name.replace(/ /g, '_').toLowerCase()}_preset.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [
        activePresetKey, activePreset.name, sonificationRules, sonificationSelection, sourceAssignments, 
        blendAssignments, fxAssignments, sourceParameters, rhythmSettings, rhythmSourceMapping, generatedExplanation,
        theme, interactionMode, 
        euclidI47Data, circleData, euclidIData, goldenRatioSquareData, thalesData, fibonacciData, 
        fibonacciCirclesData, silverRatioData, eyeOfHorusData, flowerOfLifeData, lituusSpiralData, 
        euclidI1Data, euclidII5Data
    ]);

    const handleImportMasterPatch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File could not be read.");
                const patch = JSON.parse(text) as MasterPatch;
                
                if (patch.presetKey && patch.sonificationRules && patch.rhythmSettings) {
                    handleApplyMasterPatch(patch);
                } else {
                    throw new Error("Invalid master preset file format.");
                }
            } catch (error) {
                 setGenerationError(error instanceof Error ? error.message : "Failed to import preset.");
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }, [handleApplyMasterPatch]);

    const handleToggleFullScreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    const dataMap: Record<PresetKey, GeometryData> = {
        euclid_I_47: euclidI47Data,
        circle_ratios: circleData,
        euclid_I_5: euclidIData,
        golden_ratio_from_square: goldenRatioSquareData,
        thales_theorem: thalesData,
        fibonacci_spiral: fibonacciData,
        fibonacci_circles: fibonacciCirclesData,
        silver_ratio: silverRatioData,
        eye_of_horus: eyeOfHorusData,
        flower_of_life: flowerOfLifeData,
        lituus_spiral: lituusSpiralData,
        euclid_I_1: euclidI1Data,
        euclid_II_5: euclidII5Data,
    };
    
    const sourcesToSonify: SourceData[] = useMemo(() => {
        let rawSources: {key: string, value: number}[] = [];

        const addRawSource = (key: string, value: number) => {
            if (sonificationSelection[activePresetKey]?.[key] && isFinite(value)) {
                rawSources.push({key, value});
            }
        };
        
        const geometryData = dataMap[activePresetKey];

        if (activePreset.key === 'euclid_I_47' && 'a' in geometryData && 'b' in geometryData) {
            const { a, b } = geometryData as EuclidI47Data;
            addRawSource('a', a); addRawSource('b', b); addRawSource('c', Math.sqrt(a * a + b * b));
        } else if (activePreset.key === 'euclid_I_1' && 'size' in geometryData) {
            const { size } = geometryData as EuclidI1Data;
            addRawSource('side', size); addRawSource('height', (Math.sqrt(3)/2) * size);
        } else if (activePreset.key === 'euclid_II_5' && 'ab' in geometryData) {
            const { ab, c } = geometryData as EuclidII5Data;
            const half = ab / 2;
            const cd = Math.abs(half - c);
            addRawSource('g', Math.log1p(c * (ab - c)) * 10);
            addRawSource('h', Math.log1p(cd * cd) * 10);
            addRawSource('a', Math.log1p(c * (ab - c)) * 10);
        } else if (activePreset.key === 'circle_ratios' && 'radius' in geometryData) {
            const { radius } = geometryData as CircleData;
            addRawSource('radius', radius); addRawSource('circumference', 2 * Math.PI * radius); addRawSource('area', Math.PI * radius * radius / 10);
        } else if (activePreset.key === 'euclid_I_5' && 'ab' in geometryData) {
            const { ab } = geometryData as EuclidIData;
            const side = ab; const base = Math.min(side * 1.6, side * 2 - 1);
            addRawSource('side', side); addRawSource('base', base);
        } else if (activePreset.key === 'thales_theorem' && 'angle' in geometryData) {
            const { angle } = geometryData as ThalesData;
            const radius = 140; const angleRad = angle * Math.PI / 180;
            const pA = { x: -radius, y: 0 }; const pC = { x: radius, y: 0 };
            const pB = { x: radius * Math.cos(angleRad), y: -radius * Math.sin(angleRad) };
            const sideA = Math.hypot(pB.x - pC.x, pB.y - pC.y); const sideB = Math.hypot(pB.x - pA.x, pB.y - pA.y);
            addRawSource('a', sideA); addRawSource('b', sideB); addRawSource('diameter', 2 * radius);
        } else if (activePreset.key === 'fibonacci_spiral' && 'count' in geometryData) {
            const { count, size } = geometryData as FibonacciData;
            const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]; let totalLength = 0;
            for(let i=0; i < count; i++) {
                const stepValue = fib[i+1] * size; addRawSource(`step${i+1}`, stepValue);
                totalLength += (Math.PI * (fib[i+1] * size)) / 2;
            }
            addRawSource('length', Math.log2(totalLength + 1) * 25);
        } else if (activePreset.key === 'fibonacci_circles' && 'count' in geometryData) {
            const { count } = geometryData as FibonacciCirclesData;
            const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
            for(let i=0; i < count; i++) addRawSource(`radius${i+1}`, Math.log2(fib[i+1] + 1) * 50);
        } else if (activePreset.key === 'golden_ratio_from_square' && 'size' in geometryData) {
            const { size } = geometryData as GoldenRatioSquareData;
            const phi = (1 + Math.sqrt(5)) / 2;
            addRawSource('size', size); addRawSource('segment_b', size * (phi - 1)); addRawSource('total', size * phi);
        } else if (activePreset.key === 'silver_ratio' && 'size' in geometryData) {
            const { size } = geometryData as SilverRatioData;
            const delta_s = 1 + Math.sqrt(2);
            addRawSource('b', size); addRawSource('a', size * (delta_s - 2)); addRawSource('total', size * delta_s);
        } else if (activePreset.key === 'eye_of_horus' && 'fraction' in geometryData) {
             const { fraction } = geometryData as EyeOfHorusData;
             const value = 1 / (1 << (fraction + 1)); addRawSource('fraction', value * 1000);
        } else if (activePreset.key === 'flower_of_life' && 'steps' in geometryData) {
             const { steps } = geometryData as FlowerOfLifeData;
             const R = 50; const centers: [number, number][] = [[0, 0]];
             for (let i = 1; i < steps; i++) {
                 const newCenters: [number, number][] = [];
                 const existing = new Set(centers.map(c => `${c[0].toFixed(1)},${c[1].toFixed(1)}`));
                 centers.forEach(([cx,cy]) => {
                     [[cx+R,cy],[cx-R,cy],[cx+R*0.5,cy+R*Math.sqrt(3)/2],[cx-R*0.5,cy+R*Math.sqrt(3)/2],[cx+R*0.5,cy-R*Math.sqrt(3)/2],[cx-R*0.5,cy-R*Math.sqrt(3)/2]].forEach(nc => {
                         const key = `${nc[0].toFixed(1)},${nc[1].toFixed(1)}`;
                         if (!existing.has(key)) { newCenters.push(nc as [number,number]); existing.add(key); }
                     })
                 });
                 centers.push(...newCenters);
             }
             addRawSource('circles', Math.log2(centers.length + 1) * 40);
             addRawSource('vesicaPiscis', steps > 1 ? Math.log2( (steps-1)*6 + 1) * 40 : 0);
        } else if (activePreset.key === 'lituus_spiral' && 'a' in geometryData) {
             const { a, rotations } = geometryData as LituusSpiralData;
             addRawSource('radius', a); addRawSource('angle', rotations * 50);
        }
        
        let finalValues = rawSources;
        if (sonificationRules.normalization === 'global' && rawSources.length > 0) {
            const maxVal = Math.max(...rawSources.map(s => s.value), 0);
            if (maxVal > 0) finalValues = rawSources.map(s => ({ ...s, value: (s.value / maxVal) * 200 }));
        }
        
        return finalValues.map(({ key, value }) => {
            const assignment = sourceAssignments[activePresetKey]?.[key] || 'oscillator';
            const fx = fxAssignments[activePresetKey]?.[key] || 'none';
            const params = sourceParameters[activePresetKey]?.[key] || {};
            const isSample = !['oscillator', 'white_noise', 'pink_noise', 'brown_noise', 'granular', 'rhythmic_pulse'].includes(assignment);
            
            let sourceData: Partial<SourceData> = { key, value: Math.max(0.001, value), fx, fm: params.fm, granular: params.granular };

            if (isSample) {
                const sample = samples.find(s => s.id === assignment);
                sourceData = {...sourceData, type: sample ? 'sample' : 'oscillator', buffer: sample?.buffer };
            } else if (assignment === 'granular') {
                const sample = samples[0];
                sourceData = {...sourceData, type: sample ? 'granular' : 'oscillator', buffer: sample?.buffer };
            } else {
                sourceData = {...sourceData, type: assignment as any };
            }
            return sourceData as SourceData;
        });
    }, [activePresetKey, dataMap, sonificationSelection, sourceAssignments, fxAssignments, sourceParameters, samples, sonificationRules.normalization, activePreset.key]);

    const visualizerComponent = (
        <GeometryVisualizer
            sonificationEngine={sonificationEngine}
            themeName={theme}
            preset={activePreset}
            data={dataMap[activePresetKey]}
            onGeometryChange={handleGeometryChange}
            sonificationRules={sonificationRules}
            sonificationSelection={sonificationSelection[activePresetKey] || {}}
            sourceAssignments={sourceAssignments[activePresetKey] || {}}
            blendAssignments={blendAssignments[activePresetKey] || {}}
            fxAssignments={fxAssignments[activePresetKey] || {}}
            sourceParameters={sourceParameters[activePresetKey] || {}}
            samples={samples}
            showLabels={showLabels}
            isMuted={isMuted}
            xy={xy}
            onXYChange={(x, y) => setXY({ x, y })}
            playbackMode={playbackMode}
            fadeoutTime={fadeoutTime}
            interactionMode={interactionMode}
            rhythmSettings={rhythmSettings}
            rhythmSourceMapping={rhythmSourceMapping[activePresetKey] || {}}
            sourcesToSonify={sourcesToSonify}
        />
    );


    return (
        <div className="flex flex-col lg:flex-row h-screen bg-bg-primary text-text-primary overflow-hidden">
            <div className="w-full lg:w-5/12 xl:w-[30rem] h-full border-r border-border-primary">
                 <ControlPanel
                    isMobileView={isMobileView}
                    visualizerComponent={visualizerComponent}
                    sonificationEngine={sonificationEngine}
                    theme={theme}
                    onThemeChange={setTheme}
                    activePresetKey={activePresetKey}
                    onPresetChange={key => { setActivePresetKey(key); setGeneratedExplanation(null); }}
                    description={descriptions[activePresetKey]}
                    
                    euclidI47Data={euclidI47Data} onEuclidI47Change={setEuclidI47Data}
                    euclidI1Data={euclidI1Data} onEuclidI1Change={setEuclidI1Data}
                    euclidII5Data={euclidII5Data} onEuclidII5Change={setEuclidII5Data}
                    circleData={circleData} onCircleChange={setCircleData}
                    euclidIData={euclidIData} onEuclidIChange={setEuclidIData}
                    goldenRatioSquareData={goldenRatioSquareData} onGoldenRatioSquareChange={setGoldenRatioSquareData}
                    thalesData={thalesData} onThalesChange={setThalesData}
                    fibonacciData={fibonacciData} onFibonacciChange={setFibonacciData}
                    fibonacciCirclesData={fibonacciCirclesData} onFibonacciCirclesChange={setFibonacciCirclesData}
                    silverRatioData={silverRatioData} onSilverRatioChange={setSilverRatioData}
                    eyeOfHorusData={eyeOfHorusData} onEyeOfHorusChange={setEyeOfHorusData}
                    flowerOfLifeData={flowerOfLifeData} onFlowerOfLifeChange={setFlowerOfLifeData}
                    lituusSpiralData={lituusSpiralData} onLituusSpiralChange={setLituusSpiralData}

                    playbackMode={playbackMode}
                    onPlaybackModeChange={setPlaybackMode}
                    fadeoutTime={fadeoutTime}
                    onFadeoutTimeChange={setFadeoutTime}

                    sonificationRules={sonificationRules} onSonificationRulesChange={setSonificationRules}
                    sonificationSelection={sonificationSelection[activePresetKey] || {}}
                    onSonificationSelectionChange={(key, value) => setSonificationSelection(p => ({...p, [activePresetKey]: {...p[activePresetKey], [key]: value}}))}
                    
                    samples={samples} onSamplesChange={setSamples}
                    sourceAssignments={sourceAssignments[activePresetKey] || {}}
                    onSourceAssignmentChange={(key, source) => setSourceAssignments(p => ({...p, [activePresetKey]: {...p[activePresetKey], [key]: source}}))}
                    blendAssignments={blendAssignments[activePresetKey] || {}}
                    onBlendAssignmentChange={(key, blend) => setBlendAssignments(p => ({...p, [activePresetKey]: {...p[activePresetKey], [key]: blend}}))}
                    fxAssignments={fxAssignments[activePresetKey] || {}}
                    onFxAssignmentChange={(key, fx) => setFxAssignments(p => ({...p, [activePresetKey]: {...p[activePresetKey], [key]: fx}}))}
                    sourceParameters={sourceParameters[activePresetKey] || {}}
                    onSourceParameterChange={(valueKey, paramKey, params) => setSourceParameters(p => ({...p, [activePresetKey]: {...p[activePresetKey], [valueKey]: {...(p[activePresetKey]?.[valueKey] || {}), [paramKey]: params}}}))}

                    showLabels={showLabels} onShowLabelsChange={setShowLabels}
                    isMuted={isMuted} onIsMutedChange={setIsMuted}
                    activePreset={activePreset}
                    interactionMode={interactionMode}
                    onInteractionModeChange={setInteractionMode}

                    isFullScreen={isFullScreen}
                    onToggleFullScreen={handleToggleFullScreen}

                    aiStyle={aiStyle}
                    onAiStyleChange={setAiStyle}
                    aiNotes={aiNotes}
                    onAiNotesChange={setAiNotes}
                    isGenerating={isGenerating}
                    generationError={generationError}
                    generatedExplanation={generatedExplanation}
                    onGenerate={handleGeneratePatch}
                    onExport={handleExportMasterPatch}
                    onImport={handleImportMasterPatch}
                    
                    rhythmSettings={rhythmSettings}
                    onRhythmSettingsChange={setRhythmSettings}
                    rhythmSourceMapping={rhythmSourceMapping[activePresetKey] || {}}
                    onRhythmSourceMappingChange={(mapping: RhythmPresetMapping) => setRhythmSourceMapping(p => ({...p, [activePresetKey]: mapping}))}
                    sonifiableValues={sourcesToSonify.map(s => s.key)}
                />
            </div>
            <main className="hidden lg:flex w-full lg:w-7/12 xl:w-[calc(100%-30rem)] h-full bg-bg-secondary items-center justify-center p-4">
                {visualizerComponent}
            </main>
        </div>
    );
};

export default App;
