
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { Preset, SonificationRules, Sample, GeometryData, EuclidI47Data, CircleData, EuclidIData, GoldenRatioSquareData, ThalesData, FibonacciData, FibonacciCirclesData, SilverRatioData, EyeOfHorusData, FlowerOfLifeData, LituusSpiralData, EuclidI1Data, EuclidII5Data, FxAssignments, SonificationFx, ThemeName, SourceType, NoiseType, PlaybackMode, PresetSourceParameters, InteractionMode, RhythmSettings, RhythmPresetMapping, BlendMode } from '../types';
import { SonificationEngine, SourceData } from '../services/sonificationService';

interface GeometryVisualizerProps {
    sonificationEngine: SonificationEngine;
    themeName: ThemeName;
    preset: Preset;
    data: GeometryData;
    onGeometryChange: (newData: Partial<GeometryData>) => void;
    sonificationRules: SonificationRules;
    sonificationSelection: { [key: string]: boolean };
    sourceAssignments: { [key: string]: string };
    blendAssignments: { [key: string]: BlendMode };
    fxAssignments: { [key:string]: SonificationFx };
    sourceParameters: PresetSourceParameters;
    samples: Sample[];
    showLabels: boolean;
    isMuted: boolean;
    xy: { x: number, y: number };
    onXYChange: (x: number, y: number) => void;
    playbackMode: PlaybackMode;
    fadeoutTime: number;
    interactionMode: InteractionMode;
    rhythmSettings: RhythmSettings;
    rhythmSourceMapping: RhythmPresetMapping;
    sourcesToSonify: SourceData[];
}

interface VisualizerComponentProps<T extends GeometryData> {
    data: T;
    onDataChange?: (newData: Partial<T>) => void;
    colors: Preset['colorPalette'];
    showLabels: boolean;
    themeName: ThemeName;
    interactionMode: InteractionMode;
    svgRef?: React.RefObject<SVGSVGElement>;
}


const Label: React.FC<React.SVGProps<SVGTextElement>> = (props) => (
    <text {...props} fontSize="14" fontWeight="bold" className="transition-opacity duration-300 fill-current text-text-primary" style={{...props.style, pointerEvents: 'none', userSelect: 'none'}} />
);

const DraggableCircle: React.FC<{ cx: number, cy: number, onDrag: (svgX: number, svgY: number) => void, cursor: string, svgRef: React.RefObject<SVGSVGElement> | null}> = ({ cx, cy, onDrag, cursor, svgRef }) => {
    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!svgRef?.current) return;
        const target = e.target as SVGCircleElement;
        target.setPointerCapture(e.pointerId);
        const svg = svgRef.current;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            moveEvent.preventDefault();
            const ctm = svg.getScreenCTM()?.inverse();
            if (!ctm) return;
            let pt = svg.createSVGPoint();
            pt.x = moveEvent.clientX;
            pt.y = moveEvent.clientY;
            pt = pt.matrixTransform(ctm);
            onDrag(pt.x, pt.y);
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            target.releasePointerCapture(upEvent.pointerId);
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            document.removeEventListener('pointercancel', handlePointerUp);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointercancel', handlePointerUp);
    };
    return <circle cx={cx} cy={cy} r="12" fill="var(--accent-primary)" fillOpacity="0.4" stroke="var(--text-primary)" strokeWidth="1.5" cursor={cursor} onPointerDown={handlePointerDown} style={{pointerEvents: 'auto', touchAction: 'none'}}/>;
}


const EuclidI47Visualizer: React.FC<VisualizerComponentProps<EuclidI47Data>> = ({ data, onDataChange, colors, showLabels, themeName, interactionMode, svgRef }) => {
    const { a, b } = data;
    const c = Math.sqrt(a * a + b * b);

    const viewBoxSize = Math.max(a, b) * 2 + 100;
    const cx = viewBoxSize / 2;
    const cy = viewBoxSize / 2;

    // Triangle vertices
    const pA = { x: cx, y: cy - a };
    const pB = { x: cx, y: cy };
    const pC = { x: cx + b, y: cy };
    
    const v_hyp = { x: pC.x - pA.x, y: pC.y - pA.y };
    const v_perp = { x: -v_hyp.y, y: v_hyp.x };

    const pD = { x: pA.x + v_perp.x, y: pA.y + v_perp.y };
    const pE = { x: pC.x + v_perp.x, y: pC.y + v_perp.y };

    const handleDragA = (svgX: number, svgY: number) => onDataChange?.({ a: Math.max(10, Math.min(150, cy - svgY)) });
    const handleDragB = (svgX: number, svgY: number) => onDataChange?.({ b: Math.max(10, Math.min(150, svgX - cx)) });

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g style={{ vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round', pointerEvents: 'none' }}>
                <rect x={cx - a} y={cy - a} width={a} height={a} fill={colors.secondary} fillOpacity={0.2} stroke={colors.secondary} strokeWidth="2" />
                <rect x={cx} y={cy} width={b} height={b} fill={colors.primary} fillOpacity={0.2} stroke={colors.primary} strokeWidth="2" />
                <polygon points={`${pA.x},${pA.y} ${pC.x},${pC.y} ${pE.x},${pE.y} ${pD.x},${pD.y}`} fill={colors.tertiary} fillOpacity={0.2} stroke={colors.tertiary} strokeWidth="2" />
                <polygon points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`} fill={colors.background} stroke={themeName === 'byrne' ? colors.accent : 'currentColor'} strokeWidth="3" />
                 {showLabels && <>
                    <Label x={cx - 5} y={cy - a/2} textAnchor="end" fill={colors.secondary}>{a.toFixed(0)}</Label>
                    <Label x={cx + b/2} y={cy + 15} textAnchor="middle" fill={colors.primary}>{b.toFixed(0)}</Label>
                    <g transform={`translate(${(pA.x+pE.x)/2}, ${(pA.y+pE.y)/2}) rotate(${Math.atan2(v_hyp.y, v_hyp.x) * 180 / Math.PI}) translate(0, -10)`}>
                        <Label x="0" y="0" textAnchor="middle" fill={colors.tertiary}>{c.toFixed(0)}</Label>
                    </g>
                </>}
            </g>
            {interactionMode === 'direct' && svgRef && (
                <>
                    <DraggableCircle cx={pA.x} cy={pA.y} onDrag={handleDragA} cursor="ns-resize" svgRef={svgRef} />
                    <DraggableCircle cx={pC.x} cy={pC.y} onDrag={handleDragB} cursor="ew-resize" svgRef={svgRef} />
                </>
            )}
        </svg>
    );
};


const EuclidI1Visualizer: React.FC<VisualizerComponentProps<EuclidI1Data>> = ({ data, onDataChange, colors, showLabels, themeName, interactionMode, svgRef }) => {
    const { size } = data;
    const height = (Math.sqrt(3) / 2) * size;
    const viewBoxSize = size * 1.5;
    const strokeColor = themeName === 'byrne' ? colors.accent : 'currentColor';

    const gTransform = { x: viewBoxSize/2 - size/2, y: viewBoxSize/2 + height/3 };
    const topVertex = { x: gTransform.x + size/2, y: gTransform.y - height };

    const handleDrag = (svgX: number, svgY: number) => {
        const newHeight = gTransform.y - svgY;
        const newSize = Math.max(50, Math.min(250, newHeight * 2 / Math.sqrt(3)));
        onDataChange?.({ size: newSize });
    };

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${gTransform.x}, ${gTransform.y})`} style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                <line x1="0" y1="0" x2={size} y2="0" stroke={strokeColor} strokeWidth="3" />
                <path d={`M 0,0 A ${size},${size} 0 0 1 ${size/2},-${height}`} stroke={colors.secondary} strokeDasharray="4 4" strokeWidth="1.5" fill="none" />
                <path d={`M ${size},0 A ${size},${size} 0 0 0 ${size/2},-${height}`} stroke={colors.tertiary} strokeDasharray="4 4" strokeWidth="1.5" fill="none" />
                <polygon points={`0,0 ${size},0 ${size/2},-${height}`} fill={colors.background} stroke="none" />
                <line x1="0" y1="0" x2={size/2} y2={-height} stroke={colors.secondary} strokeWidth="2" />
                <line x1={size} y1="0" x2={size/2} y2={-height} stroke={colors.tertiary} strokeWidth="2" />

                {showLabels && <>
                    <Label x={size/2} y="20" textAnchor="middle" >Side: {size.toFixed(0)}</Label>
                </>}
            </g>
            {interactionMode === 'direct' && svgRef && (
                <DraggableCircle cx={topVertex.x} cy={topVertex.y} onDrag={handleDrag} cursor="ns-resize" svgRef={svgRef} />
            )}
        </svg>
    );
};

const EuclidII5Visualizer: React.FC<VisualizerComponentProps<EuclidII5Data>> = ({ data, onDataChange, colors, showLabels, themeName, interactionMode, svgRef }) => {
    const { ab, c } = data;
    const viewBoxSize = ab * 1.3;
    const half = ab / 2;
    const cd = Math.abs(half - c);
    const cb = ab - c;

    const gTransform = { x: viewBoxSize * 0.1, y: viewBoxSize * 0.4 };
    
    const handleDragC = (svgX: number, svgY: number) => {
        const newC = svgX - gTransform.x;
        const clampedC = Math.max(1, Math.min(ab - 1, newC));
        onDataChange?.({ c: clampedC });
    };

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${gTransform.x}, ${gTransform.y})`} style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                <rect x="0" y="0" width={half} height={half} fill={colors.primary} fillOpacity={0.2} stroke={colors.primary} strokeWidth="2" />
                <rect x={c} y={c} width={cd} height={cd} fill={colors.secondary} fillOpacity={0.3} stroke={colors.secondary} strokeWidth="2" />
                <rect x={0} y={half + 20} width={ab-c} height={c} fill={colors.tertiary} fillOpacity={0.3} stroke={colors.tertiary} strokeWidth="2" />
                
                {showLabels && <>
                    <Label x={c/2} y={-10} textAnchor="middle">a = {c.toFixed(0)}</Label>
                    <Label x={c+cd/2} y={-10} textAnchor="middle">h = {cd.toFixed(0)}</Label>
                    <Label x={half/2} y={half/2} textAnchor="middle" fill={themeName === 'byrne' ? 'white' : 'currentColor'}>g</Label>
                    <Label x={c+cd/2} y={c+cd/2} textAnchor="middle" fill={themeName === 'byrne' ? 'black' : 'currentColor'}>h</Label>
                    <Label x={(ab-c)/2} y={half+20+c/2} textAnchor="middle" fill={themeName === 'byrne' ? 'white' : 'currentColor'}>a</Label>
                    <Label x={ab/2} y={-30} textAnchor="middle" >g + h = (ab/2)²</Label>
                </>}
            </g>
             {interactionMode === 'direct' && svgRef && (
                <DraggableCircle cx={gTransform.x + c} cy={gTransform.y} onDrag={handleDragC} cursor="ew-resize" svgRef={svgRef} />
            )}
        </svg>
    );
};

const CircleVisualizer: React.FC<VisualizerComponentProps<CircleData>> = ({ data, onDataChange, colors, showLabels, interactionMode, svgRef }) => {
    const { radius } = data;
    const circumference = 2 * Math.PI * radius;
    const area = Math.PI * radius * radius;
    const viewBoxSize = radius * 2 + 40;
    const areaSide = Math.sqrt(area);
    const center = { x: viewBoxSize / 2, y: viewBoxSize / 2 };

    const handleDragRadius = (svgX: number, svgY: number) => {
        const newRadius = Math.max(10, Math.min(150, svgX - center.x));
        onDataChange?.({ radius: newRadius });
    }

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize + areaSide + 20}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${center.x}, ${center.y})`} strokeWidth="2" style={{ vectorEffect: 'non-scaling-stroke' }}>
                <circle cx="0" cy="0" r={radius} fill="transparent" stroke={colors.primary} strokeDasharray="8 4" style={{pointerEvents: 'none'}} />
                <line x1="0" y1="0" x2={radius} y2="0" stroke={colors.primary} strokeWidth="3" style={{pointerEvents: 'none'}} />
                {showLabels && <Label x={radius / 2} y="-8" textAnchor="middle">{`r = ${radius.toFixed(0)}`}</Label>}
                 {interactionMode === 'direct' && svgRef && (
                     <DraggableCircle cx={radius} cy={0} onDrag={handleDragRadius} cursor="ew-resize" svgRef={svgRef} />
                )}
            </g>
            <g transform={`translate(${(viewBoxSize - circumference)/2}, ${viewBoxSize})`}>
                 <line x1="0" y1="0" x2={circumference} y2="0" stroke={colors.secondary} strokeWidth="3" />
                 {showLabels && <Label x={circumference/2} y="20" textAnchor="middle">Circumference: {circumference.toFixed(0)}</Label>}
            </g>
             <g transform={`translate(${(viewBoxSize - areaSide)/2}, ${viewBoxSize + 40})`}>
                <rect x="0" y="0" width={areaSide} height={areaSide} stroke={colors.tertiary} fill="transparent" strokeWidth="2"/>
                 {showLabels && <Label x={areaSide/2} y={areaSide + 20} textAnchor="middle">Area: {area.toFixed(0)}</Label>}
            </g>
        </svg>
    );
};

const EuclidVisualizer: React.FC<VisualizerComponentProps<EuclidIData>> = ({ data, onDataChange, colors, showLabels, themeName, interactionMode, svgRef }) => {
    const { ab } = data;
    const viewBoxSize = 250;
    const scale = 0.8;
    const side = ab * scale;
    const base = Math.min(side * 1.6, side * 2 - 1);
    const height = Math.sqrt(side * side - (base / 2) * (base / 2));
    if (!isFinite(height)) return <text>Invalid triangle</text>;

    const gTransform = { x: viewBoxSize/2, y: viewBoxSize/2 + height/2 };
    const topVertex = { x: gTransform.x, y: gTransform.y - height };
    
    const handleDrag = (svgX: number, svgY: number) => {
        const newHeight = gTransform.y - svgY;
        const h_over_s = Math.sqrt(1 - Math.pow(Math.min(side * 1.6, side * 2 - 1) / (2 * side), 2));
        const newSide = newHeight / (isFinite(h_over_s) ? h_over_s : 0.6);
        const newAb = Math.max(50, Math.min(200, newSide / scale));
        onDataChange?.({ ab: newAb });
    };

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${gTransform.x}, ${gTransform.y})`} style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                <polygon points={`${-base/2},0 ${base/2},0 0,-${height}`} fill={colors.background} stroke={themeName === 'byrne' ? colors.accent : 'currentColor'} strokeWidth="1" />
                <line x1={-base/2} y1="0" x2={0} y2={-height} stroke={colors.primary} strokeWidth="2" />
                <line x1={base/2} y1="0" x2={0} y2={-height} stroke={colors.primary} strokeWidth="2" />
                <line x1={-base/2} y1="0" x2={base/2} y2="0" stroke={colors.secondary} strokeWidth="2" />
                
                {showLabels && <>
                    <Label x={-base/4 - 10} y={-height/2} textAnchor="end" fill={colors.primary}>{ab.toFixed(0)}</Label>
                    <Label x={base/4 + 10} y={-height/2} textAnchor="start" fill={colors.primary}>{ab.toFixed(0)}</Label>
                    <Label x="0" y="15" textAnchor="middle" fill={colors.secondary}>Base</Label>
                </>}
            </g>
            {interactionMode === 'direct' && svgRef && (
                <DraggableCircle cx={topVertex.x} cy={topVertex.y} onDrag={handleDrag} cursor="ns-resize" svgRef={svgRef} />
            )}
        </svg>
    );
};

const ThalesVisualizer: React.FC<VisualizerComponentProps<ThalesData>> = ({ data, onDataChange, colors, showLabels, themeName, interactionMode, svgRef }) => {
    const { angle } = data;
    const viewBoxSize = 300;
    const radius = viewBoxSize / 2 - 20;
    const angleRad = angle * Math.PI / 180;
    
    const center = { x: viewBoxSize/2, y: viewBoxSize/2 };
    const pA = { x: -radius, y: 0 };
    const pC = { x: radius, y: 0 };
    const pB = { x: radius * Math.cos(angleRad), y: -radius * Math.sin(angleRad) };
    const strokeColor = themeName === 'byrne' ? colors.accent : 'currentColor';

    const vBA = { x: pA.x - pB.x, y: pA.y - pB.y };
    const vBC = { x: pC.x - pB.x, y: pC.y - pB.y };

    const magBA = Math.sqrt(vBA.x * vBA.x + vBA.y * vBA.y);
    const uBA = { x: vBA.x / magBA, y: vBA.y / magBA };
    const magBC = Math.sqrt(vBC.x * vBC.x + vBC.y * vBC.y);
    const uBC = { x: vBC.x / magBC, y: vBC.y / magBC };
    
    const symbolSize = 12;
    const p1 = { x: pB.x + symbolSize * uBA.x, y: pB.y + symbolSize * uBA.y };
    const p2 = { x: pB.x + symbolSize * (uBA.x + uBC.x), y: pB.y + symbolSize * (uBA.y + uBC.y) };
    const p3 = { x: pB.x + symbolSize * uBC.x, y: pB.y + symbolSize * uBC.y };

    const handleDragAngle = (svgX: number, svgY: number) => {
        const relativeX = svgX - center.x;
        const relativeY = svgY - center.y;
        const newAngleRad = Math.atan2(-relativeY, relativeX);
        let newAngleDeg = newAngleRad * 180 / Math.PI;
        if (newAngleDeg < 0) newAngleDeg += 360;

        const clampedAngle = Math.max(5, Math.min(175, newAngleDeg));
        onDataChange?.({ angle: clampedAngle });
    };

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${center.x}, ${center.y})`} style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                <path d={`M ${-radius},0 A ${radius},${radius} 0 0 1 ${radius},0`} stroke={strokeColor} strokeDasharray="4 2" fill="none" strokeWidth="1.5" />
                 <path d={`M ${-radius},0 A ${radius},${radius} 0 1 0 ${radius},0`} stroke={strokeColor} strokeDasharray="2 6" fill="none" strokeOpacity="0.3" strokeWidth="1.5"/>
                <line x1={pA.x} y1={pA.y} x2={pC.x} y2={pC.y} stroke={colors.tertiary} strokeWidth="2" />
                
                <line x1={pB.x} y1={pB.y} x2={pC.x} y2={pC.y} stroke={colors.primary} strokeWidth="2.5" />
                <line x1={pB.x} y1={pB.y} x2={pA.x} y2={pA.y} stroke={colors.secondary} strokeWidth="2.5" />

                <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} stroke={strokeColor} fill="none" strokeWidth="1.5" />

                {showLabels && <>
                    <Label x={(pB.x + pC.x) / 2 + 5} y={(pB.y + pC.y) / 2} fill={colors.primary}>a</Label>
                    <Label x={(pB.x + pA.x) / 2 - 5} y={(pB.y + pA.y) / 2} fill={colors.secondary}>b</Label>
                    <Label x="0" y="15" textAnchor="middle" fill={colors.tertiary}>diameter</Label>
                </>}
            </g>
            {interactionMode === 'direct' && svgRef && (
                <DraggableCircle cx={center.x + pB.x} cy={center.y + pB.y} onDrag={handleDragAngle} cursor="pointer" svgRef={svgRef} />
            )}
        </svg>
    );
};

const FibonacciSpiralVisualizer: React.FC<VisualizerComponentProps<FibonacciData>> = ({ data, onDataChange, colors, showLabels, interactionMode, svgRef }) => {
    const { count, size } = data;
    const fib = useMemo(() => [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], []);

    const spiralData = useMemo(() => {
        let x = 0, y = 0;
        let direction = 0; // 0: Right, 1: Up, 2: Left, 3: Down
        let spiralPath = "M 0 0";
        const squares = [];
        
        let minX = 0, minY = 0, maxX = 0, maxY = 0;

        for (let i = 1; i <= count; i++) {
            const f_curr = fib[i] * size;
            if (f_curr <= 0) continue;

            const color = [colors.primary, colors.secondary, colors.tertiary, colors.accent][(i - 1) % 4];
            let squareX, squareY, arcX, arcY;
            const largeArc = 0, sweep = 1;

            switch (direction) {
                case 0: 
                    squareX = x; squareY = y - f_curr;
                    arcX = x + f_curr; arcY = y;
                    spiralPath += ` A ${f_curr} ${f_curr} 0 ${largeArc} ${sweep} ${arcX} ${arcY}`;
                    x = arcX; y = arcY; break;
                case 1: 
                    squareX = x; squareY = y;
                    arcX = x; arcY = y + f_curr;
                    spiralPath += ` A ${f_curr} ${f_curr} 0 ${largeArc} ${sweep} ${arcX} ${arcY}`;
                    x = arcX; y = arcY; break;
                case 2:
                    squareX = x - f_curr; squareY = y;
                    arcX = x - f_curr; arcY = y;
                    spiralPath += ` A ${f_curr} ${f_curr} 0 ${largeArc} ${sweep} ${arcX} ${arcY}`;
                    x = arcX; y = arcY; break;
                case 3:
                    squareX = x - f_curr; squareY = y - f_curr;
                    arcX = x; arcY = y - f_curr;
                    spiralPath += ` A ${f_curr} ${f_curr} 0 ${largeArc} ${sweep} ${arcX} ${arcY}`;
                    x = arcX; y = arcY; break;
            }
            
            squares.push({ x: squareX, y: squareY, size: f_curr, color });
            minX = Math.min(minX, squareX, squareX + f_curr);
            minY = Math.min(minY, squareY, squareY + f_curr);
            maxX = Math.max(maxX, squareX, squareX + f_curr);
            maxY = Math.max(maxY, squareY, squareY + f_curr);
            direction = (direction + 1) % 4;
        }
        return { path: spiralPath, squares, bounds: { minX, minY, width: maxX - minX, height: maxY - minY }};
    }, [count, size, fib, colors]);
    
    const { path, squares, bounds } = spiralData;
    const viewBoxSize = Math.max(bounds.width, bounds.height, 100) * 1.1;
    const cx = -bounds.minX + (viewBoxSize - bounds.width) / 2;
    const cy = -bounds.minY + (viewBoxSize - bounds.height) / 2;

    const handleDragCount = (svgX: number, svgY: number) => {
        const newCount = Math.round(1 + (svgX / viewBoxSize) * 10);
        onDataChange?.({ count: Math.max(1, Math.min(11, newCount))});
    };
     const handleDragSize = (svgX: number, svgY: number) => {
        const newSize = Math.round(1 + (svgY / viewBoxSize) * 19);
        onDataChange?.({ size: Math.max(1, Math.min(20, newSize))});
    };

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${cx}, ${cy})`} style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                {squares.map((s, i) => (
                    <rect key={i} x={s.x} y={s.y} width={s.size} height={s.size} fill={s.color} fillOpacity={0.1} stroke={s.color} strokeWidth="0.5" />
                ))}
                 <path d={path} stroke={colors.primary} strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
             {interactionMode === 'direct' && svgRef && (
                <>
                    <DraggableCircle cx={(count - 1) / 10 * viewBoxSize} cy={15} onDrag={handleDragCount} cursor="ew-resize" svgRef={svgRef} />
                    <DraggableCircle cx={15} cy={(size - 1) / 19 * viewBoxSize} onDrag={handleDragSize} cursor="ns-resize" svgRef={svgRef} />
                </>
            )}
        </svg>
    );
};

const FibonacciCirclesVisualizer: React.FC<VisualizerComponentProps<FibonacciCirclesData>> = ({ data, onDataChange, colors, showLabels, interactionMode, svgRef }) => {
    const { count } = data;
    const fibSequence = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const scaleFactor = 4;
    
    const elements: JSX.Element[] = [];
    let currentX = 0;
    let totalWidth = 0;
    let maxHeight = 0;

    for (let i = 1; i <= count; i++) {
        const f = fibSequence[i] * scaleFactor;
        if (f === 0) continue;
        const color = [colors.primary, colors.secondary, colors.tertiary, colors.accent][(i - 1) % 4];

        currentX += (fibSequence[i-1] ?? 0) * scaleFactor;
        const cx = currentX;
        const cy = 0;
        
        elements.push(<circle key={`c-${i}`} cx={cx} cy={cy} r={f} stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.1} style={{pointerEvents: 'none'}} />);
        
        currentX += f;
        totalWidth = currentX + f;
        maxHeight = Math.max(maxHeight, f * 2);
    }
    
    const viewBoxSize = Math.max(totalWidth, maxHeight) * 1.1;
    const handleDragCount = (svgX: number, svgY: number) => {
        const newCount = Math.round(1 + (svgX / viewBoxSize) * 10);
        onDataChange?.({ count: Math.max(1, Math.min(11, newCount))});
    };

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${(viewBoxSize - totalWidth) / 2}, ${viewBoxSize / 2})`} style={{ vectorEffect: 'non-scaling-stroke' }}>
                {elements}
            </g>
            {interactionMode === 'direct' && svgRef && (
                <DraggableCircle cx={(count - 1) / 10 * viewBoxSize} cy={viewBoxSize - 15} onDrag={handleDragCount} cursor="ew-resize" svgRef={svgRef} />
            )}
        </svg>
    );
};


const GoldenRatioSquareVisualizer: React.FC<VisualizerComponentProps<GoldenRatioSquareData>> = ({ data, onDataChange, colors, showLabels, interactionMode, svgRef }) => {
    const { size } = data;
    const phi = (1 + Math.sqrt(5)) / 2;
    const totalWidth = size * phi;
    const viewBoxSize = totalWidth * 1.1;

    const handleDrag = (svgX: number, svgY: number) => {
        const newSize = Math.max(20, Math.min(150, Math.max(svgX, svgY)));
        onDataChange?.({size: newSize});
    }

    return (
        <svg ref={svgRef} viewBox={`-10 -20 ${viewBoxSize} ${size * 1.4}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                <rect x="0" y="0" width={totalWidth} height={size} fill={colors.background} />
                <rect x="0" y="0" width={size} height={size} stroke={colors.primary} fill={colors.primary} strokeWidth="2" fillOpacity="0.2"/>
                <rect x={size} y="0" width={size * (phi-1)} height={size} stroke={colors.secondary} fill={colors.secondary} strokeWidth="2" fillOpacity="0.2"/>
                
                <line x1={size/2} y1={size} x2={size} y2="0" stroke={colors.tertiary} strokeDasharray="3 2" strokeWidth="1.5" />
                <path d={`M ${size/2},${size} A ${size/2},${size/2} 0 0 1 ${size},${size}`} fill="none" stroke={colors.tertiary} strokeDasharray="3 2" strokeWidth="1.5" />

                {showLabels && <>
                    <Label x={size/2} y={-10} textAnchor="middle" fill={colors.primary}>a</Label>
                    <Label x={size + size*(phi-1)/2} y={-10} textAnchor="middle" fill={colors.secondary}>b</Label>
                    <Label x={totalWidth/2} y={size+20} textAnchor="middle" fill={colors.tertiary}>(a+b)/a = a/b ≈ 1.618</Label>
                </>}
            </g>
             {interactionMode === 'direct' && svgRef && (
                <DraggableCircle cx={size} cy={size} onDrag={handleDrag} cursor="nwse-resize" svgRef={svgRef} />
            )}
        </svg>
    );
};

const SilverRatioVisualizer: React.FC<VisualizerComponentProps<SilverRatioData>> = ({ data, onDataChange, colors, showLabels, interactionMode, svgRef }) => {
    const { size } = data;
    const delta_s = 1 + Math.sqrt(2);
    const totalWidth = size * delta_s;
    const viewBoxSize = totalWidth * 1.1;

     const handleDrag = (svgX: number, svgY: number) => {
        const newSize = Math.max(20, Math.min(120, svgX / 2));
        onDataChange?.({size: newSize});
    }

    return (
        <svg ref={svgRef} viewBox={`-10 -20 ${viewBoxSize} ${size * 1.4}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                <rect x="0" y="0" width={totalWidth} height={size} fill={colors.background} stroke={colors.tertiary} strokeWidth="1" />
                <rect x="0" y="0" width={size} height={size} stroke={colors.secondary} fill={colors.secondary} strokeWidth="2" fillOpacity="0.2"/>
                 <rect x={size} y="0" width={size} height={size} stroke={colors.secondary} fill={colors.secondary} strokeWidth="2" fillOpacity="0.2"/>
                 <rect x={2*size} y="0" width={totalWidth - 2*size} height={size} stroke={colors.primary} fill={colors.primary} strokeWidth="2" fillOpacity="0.2"/>

                {showLabels && <>
                    <Label x={size} y={-10} textAnchor="middle" fill={colors.secondary}>b ({size.toFixed(0)})</Label>
                    <Label x={2*size + (totalWidth - 2*size)/2} y={-10} textAnchor="middle" fill={colors.primary}>a</Label>
                    <Label x={totalWidth/2} y={size+20} textAnchor="middle" fill={colors.tertiary}>(2b+a)/b = b/a ≈ 2.414</Label>
                </>}
            </g>
             {interactionMode === 'direct' && svgRef && (
                <DraggableCircle cx={2 * size} cy={size} onDrag={handleDrag} cursor="ew-resize" svgRef={svgRef} />
            )}
        </svg>
    );
};

const EyeOfHorusVisualizer: React.FC<VisualizerComponentProps<EyeOfHorusData>> = ({ data, onDataChange, colors, showLabels, interactionMode, svgRef }) => {
    const viewBoxSize = 300;
    const parts = [
        { d: "M 150 100 A 50 50 0 0 1 150 200", val: "1/2" },
        { d: "M 150 100 A 50 50 0 0 0 150 200", val: "1/4" },
        { d: "M 100 80 Q 150 60 200 80", val: "1/8" },
        { d: "M 100 200 L 50 250", val: "1/16" },
        { d: "M 50 250 C 70 230, 100 230, 120 250 S 150 280, 150 250", val: "1/32" },
        { d: "M 200 200 L 250 250", val: "1/64" }
    ];

    return (
        <svg ref={svgRef} viewBox={`-50 0 ${viewBoxSize + 100} ${viewBoxSize}`} className="w-full h-full" >
            <g transform="translate(20, -50)" strokeWidth="8" strokeLinecap="round" fill="none" style={{ vectorEffect: 'non-scaling-stroke' }}>
                {parts.map((part, index) => (
                    <path 
                        key={index}
                        d={part.d}
                        stroke={index === data.fraction ? colors.primary : colors.secondary}
                        strokeOpacity={index === data.fraction ? 1 : 0.4}
                         style={{ 
                            transition: 'stroke 0.3s, stroke-opacity 0.3s',
                            cursor: interactionMode === 'direct' ? 'pointer' : 'default',
                            pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'
                        }}
                        onClick={() => {
                            if (interactionMode === 'direct') {
                                onDataChange?.({ fraction: index });
                            }
                        }}
                    />
                ))}
                {showLabels && 
                     <Label x={130} y={340} textAnchor="middle" >
                         {`Value: ${parts[data.fraction].val}`}
                     </Label>
                }
            </g>
        </svg>
    );
};

const FlowerOfLifeVisualizer: React.FC<VisualizerComponentProps<FlowerOfLifeData>> = ({ data, onDataChange, colors, showLabels, interactionMode, svgRef }) => {
    const { steps } = data;
    const radius = 50;
    const viewBoxSize = (steps * 2 + 1) * radius;
    const centers: [number, number][] = [[0, 0]];
    const circleElems: {cx: number, cy: number}[] = [{cx:0, cy:0}];

    const R = radius;
    const H = R * Math.sqrt(3) / 2;

    for (let i = 1; i < steps; i++) {
        const newCenters: [number, number][] = [];
        const existingCenterKeys = new Set(centers.map(([x,y]) => `${x.toFixed(3)},${y.toFixed(3)}`));

        centers.forEach(([cx, cy]) => {
            const neighbors: [number, number][] = [
                [cx + R, cy], [cx - R, cy],
                [cx + R/2, cy + H], [cx - R/2, cy + H],
                [cx + R/2, cy - H], [cx - R/2, cy - H],
            ];
            neighbors.forEach(([nx, ny]) => {
                const key = `${nx.toFixed(3)},${ny.toFixed(3)}`;
                if (!existingCenterKeys.has(key)) {
                    newCenters.push([nx, ny]);
                    existingCenterKeys.add(key);
                }
            });
        });
        newCenters.forEach(([nx, ny]) => circleElems.push({cx: nx, cy: ny}));
        centers.push(...newCenters);
    }
    
     const handleDragSteps = (svgX: number, svgY: number) => {
        const newSteps = Math.round(1 + (svgX / viewBoxSize) * 6);
        const clampedSteps = Math.max(1, Math.min(7, newSteps));
        if (clampedSteps !== data.steps) {
            onDataChange?.({ steps: clampedSteps });
        }
    };

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${viewBoxSize / 2}, ${viewBoxSize / 2})`}
               strokeWidth="1.5" fill="none" style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                <circle cx="0" cy="0" r={radius * steps} stroke="var(--border-primary)" strokeDasharray="8 4" strokeOpacity="0.5"/>
                {circleElems.map(({cx, cy}, i) => 
                    <circle key={i} cx={cx} cy={cy} r={radius} stroke={ i%3 === 0 ? colors.primary : i%3 === 1 ? colors.secondary : colors.tertiary } />
                )}
            </g>
            {showLabels && <Label x={10} y={20}>Circles: {circleElems.length}</Label>}
             {interactionMode === 'direct' && svgRef && (
                <DraggableCircle cx={(data.steps - 1) / 6 * viewBoxSize} cy={viewBoxSize - 15} onDrag={handleDragSteps} cursor="ew-resize" svgRef={svgRef} />
            )}
        </svg>
    );
};

const LituusSpiralVisualizer: React.FC<VisualizerComponentProps<LituusSpiralData>> = ({ data, onDataChange, colors, showLabels, interactionMode, svgRef }) => {
    const viewBoxSize = 350;
    const { a, rotations } = data;
    const points: string[] = [];
    const maxTheta = rotations * 2 * Math.PI;

    for (let theta = 0.1; theta < maxTheta; theta += 0.05) {
        const r = a / Math.sqrt(theta);
        if(!isFinite(r)) continue;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        points.push(`${x},${y}`);
    }
    
    const handleDragA = (svgX: number, svgY: number) => {
        const newA = Math.max(20, Math.min(150, svgY));
        onDataChange?.({ a: newA });
    };

    const handleDragRotations = (svgX: number, svgY: number) => {
        const newRotations = Math.max(1, Math.min(10, Math.round(svgX / (viewBoxSize / 10))));
        onDataChange?.({ rotations: newRotations });
    };

    return (
        <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full" style={{pointerEvents: interactionMode === 'direct' ? 'auto' : 'none'}}>
            <g transform={`translate(${viewBoxSize / 2}, ${viewBoxSize / 2})`} strokeWidth="2" style={{ vectorEffect: 'non-scaling-stroke', pointerEvents: 'none' }}>
                <polyline points={points.join(' ')} stroke={colors.primary} fill="none" />
            </g>
            {showLabels && <Label x={10} y={20}>r² = {a*a}/{'θ'}</Label>}
            {interactionMode === 'direct' && svgRef && (
                <>
                    <DraggableCircle cx={15} cy={a} onDrag={handleDragA} cursor="ns-resize" svgRef={svgRef} />
                    <DraggableCircle cx={rotations * (viewBoxSize / 10)} cy={viewBoxSize - 15} onDrag={handleDragRotations} cursor="ew-resize" svgRef={svgRef} />
                </>
            )}
        </svg>
    );
};


export const GeometryVisualizer: React.FC<GeometryVisualizerProps> = ({ sonificationEngine, preset, data, onGeometryChange, sonificationRules, sonificationSelection, sourceAssignments, blendAssignments, fxAssignments, sourceParameters, samples, showLabels, isMuted, themeName, xy, onXYChange, playbackMode, fadeoutTime, interactionMode, rhythmSettings, rhythmSourceMapping, sourcesToSonify }) => {
    const visualizerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    useEffect(() => {
        sonificationEngine.setMuted(isMuted);
    }, [isMuted, sonificationEngine]);
    
    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging || !visualizerRef.current) return;
        const rect = visualizerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const clampedX = Math.max(0, Math.min(1, x));
        const clampedY = Math.max(0, Math.min(1, y));

        onXYChange(clampedX, clampedY);

        if (interactionMode !== 'freeform') return;

        // Freeform geometry manipulation logic
        switch (preset.key) {
            case 'euclid_I_47': {
                const newA = 150 - (clampedY * 140); // Map Y to Side A
                const newB = 10 + (clampedX * 140);  // Map X to Side B
                onGeometryChange({ a: newA, b: newB });
                break;
            }
            case 'circle_ratios': {
                const newRadius = 10 + (clampedX * 140); // Map X to Radius
                onGeometryChange({ radius: newRadius });
                break;
            }
            case 'euclid_I_1': {
                const newSize = 250 - (clampedY * 200); // Map Y to Size
                onGeometryChange({ size: newSize });
                break;
            }
            case 'euclid_II_5': {
                const currentData = data as EuclidII5Data;
                const newAb = 250 - (clampedY * 200); // Map Y to Line AB Length
                const newC = 1 + (clampedX * (newAb - 2)); // Map X to Point C position relative to AB
                onGeometryChange({ ab: newAb, c: newC });
                break;
            }
            case 'euclid_I_5': {
                const newAb = 200 - (clampedY * 150); // Map Y to Side Length
                onGeometryChange({ ab: newAb });
                break;
            }
            case 'thales_theorem': {
                const newAngle = 5 + (clampedX * 170); // Map X to Angle
                onGeometryChange({ angle: newAngle });
                break;
            }
            case 'fibonacci_spiral': {
                const newCount = Math.round(11 - (clampedY * 10));
                const newSize = Math.round(1 + (clampedX * 19));
                onGeometryChange({ count: newCount, size: newSize });
                break;
            }
            case 'fibonacci_circles': {
                const newCount = Math.round(1 + (clampedX * 10));
                onGeometryChange({ count: newCount });
                break;
            }
            case 'golden_ratio_from_square': {
                const newSize = 20 + (clampedX * 130); // Map X to Size
                onGeometryChange({ size: newSize });
                break;
            }
            case 'silver_ratio': {
                const newSize = 20 + (clampedX * 100); // Map X to Size
                onGeometryChange({ size: newSize });
                break;
            }
            case 'eye_of_horus': {
                const newFraction = Math.min(5, Math.floor(clampedX * 6));
                onGeometryChange({ fraction: newFraction });
                break;
            }
            case 'flower_of_life': {
                const newSteps = Math.round(1 + (clampedX * 6));
                onGeometryChange({ steps: newSteps });
                break;
            }
            case 'lituus_spiral': {
                const newA = 150 - (clampedY * 130);
                const newRotations = Math.round(1 + (clampedX * 9));
                onGeometryChange({ a: newA, rotations: newRotations });
                break;
            }
        }
    }, [isDragging, onXYChange, interactionMode, preset.key, onGeometryChange, data]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        setIsDragging(true);
        if (playbackMode === 'interactive' && !rhythmSettings.isEnabled) {
            sonificationEngine.start();
        }
        const rect = visualizerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        onXYChange(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)));
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, [playbackMode, sonificationEngine, onXYChange, rhythmSettings.isEnabled]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        setIsDragging(false);
         if (playbackMode === 'interactive' && !rhythmSettings.isEnabled) {
            sonificationEngine.stop();
        }
        try {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch(err) {
            // This can happen if the pointer capture was lost for another reason, it's safe to ignore.
        }
    }, [playbackMode, sonificationEngine, rhythmSettings.isEnabled]);


    useEffect(() => {
        // Stop ambient sounds if rhythm is enabled
        if (rhythmSettings.isEnabled) {
            sonificationEngine.stop(true);
            sonificationEngine.updateRhythm(rhythmSettings, rhythmSourceMapping, sourcesToSonify, sonificationRules);
        } else {
            sonificationEngine.stopRhythm();
            const isCurrentlyDragging = isDragging && (interactionMode === 'touchpad' || interactionMode === 'freeform');
            sonificationEngine.update(sourcesToSonify, sonificationRules, samples, blendAssignments, isCurrentlyDragging, xy);

            switch(playbackMode) {
                case 'continuous':
                    sonificationEngine.start();
                    break;
                case 'fadeout':
                    sonificationEngine.playWithFadeout(fadeoutTime);
                    break;
                case 'interactive':
                    if (!isCurrentlyDragging) {
                        sonificationEngine.stop();
                    }
                    break;
            }
        }
    }, [sourcesToSonify, sonificationRules, sonificationEngine, playbackMode, fadeoutTime, isDragging, interactionMode, samples, xy, rhythmSettings, rhythmSourceMapping, blendAssignments]);


    const renderVisualizer = () => {
        const commonProps = { colors: preset.colorPalette, showLabels, themeName, interactionMode, svgRef, onDataChange: onGeometryChange };
        switch (preset.key) {
            case 'euclid_I_47':
                return <EuclidI47Visualizer data={data as EuclidI47Data} {...commonProps} />;
            case 'euclid_I_1':
                return <EuclidI1Visualizer data={data as EuclidI1Data} {...commonProps} />;
            case 'euclid_II_5':
                return <EuclidII5Visualizer data={data as EuclidII5Data} {...commonProps} />;
            case 'circle_ratios':
                return <CircleVisualizer data={data as CircleData} {...commonProps} />;
            case 'euclid_I_5':
                return <EuclidVisualizer data={data as EuclidIData} {...commonProps} />;
            case 'thales_theorem':
                return <ThalesVisualizer data={data as ThalesData} {...commonProps} />;
            case 'fibonacci_spiral':
                return <FibonacciSpiralVisualizer data={data as FibonacciData} {...commonProps} />;
            case 'fibonacci_circles':
                return <FibonacciCirclesVisualizer data={data as FibonacciCirclesData} {...commonProps} />;
            case 'golden_ratio_from_square':
                return <GoldenRatioSquareVisualizer data={data as GoldenRatioSquareData} {...commonProps} />;
            case 'silver_ratio':
                return <SilverRatioVisualizer data={data as SilverRatioData} {...commonProps} />;
            case 'eye_of_horus':
                return <EyeOfHorusVisualizer data={data as EyeOfHorusData} {...commonProps} />;
            case 'flower_of_life':
                return <FlowerOfLifeVisualizer data={data as FlowerOfLifeData} {...commonProps} />;
            case 'lituus_spiral':
                return <LituusSpiralVisualizer data={data as LituusSpiralData} {...commonProps} />;
            default:
                return <div>Select a preset</div>;
        }
    };
    
    const containerCursor = useMemo(() => {
        if (interactionMode === 'touchpad' || interactionMode === 'freeform') return 'cursor-crosshair';
        if (interactionMode === 'direct') return 'cursor-default';
        return 'cursor-default';
    }, [interactionMode]);

    return (
        <div 
            ref={visualizerRef}
            className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden touch-none ${containerCursor}`}
            onPointerDown={interactionMode === 'touchpad' || interactionMode === 'freeform' ? handlePointerDown : undefined}
            onPointerMove={interactionMode === 'touchpad' || interactionMode === 'freeform' ? handlePointerMove : undefined}
            onPointerUp={interactionMode === 'touchpad' || interactionMode === 'freeform' ? handlePointerUp : undefined}
            onPointerCancel={interactionMode === 'touchpad' || interactionMode === 'freeform' ? handlePointerUp : undefined}
        >
            {renderVisualizer()}
        </div>
    );
};
