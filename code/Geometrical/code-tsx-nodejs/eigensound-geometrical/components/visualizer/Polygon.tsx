import React, { useMemo, useState, useEffect } from 'react';
import { SVG_CENTER, SHAPE_COLORS } from '../../constants.js';
import { getPolygonVertices, getPathLength, getPointOnPath, verticesToPathData, reorderVerticesForStar } from '../../utils/geometry.js';
import { audioService } from '../../services/audioService.js';

const Polygon = ({ shape, progress, radius, renderMode, scaleFrequencies, circleCircumference }) => {
  const { sides, speed, isStar, instrument } = shape;
  const [lastTotalBeats, setLastTotalBeats] = useState(-1);

  const vertices = useMemo(() => {
    const regularVertices = getPolygonVertices(sides, radius, SVG_CENTER, SVG_CENTER);
    return isStar ? reorderVerticesForStar(regularVertices, sides) : regularVertices;
  }, [sides, radius, isStar]);

  const pathData = useMemo(() => verticesToPathData(vertices), [vertices]);
  const totalPathLength = useMemo(() => getPathLength(vertices), [vertices]);

  const pathLengthRatio = useMemo(() => {
    if (renderMode === 'inscribed' && totalPathLength > 0) {
      return circleCircumference / totalPathLength;
    }
    return 1;
  }, [renderMode, circleCircumference, totalPathLength]);

  const adjustedProgress = progress * speed * pathLengthRatio;
  const localProgress = adjustedProgress % 1;
  const totalBeats = Math.floor(adjustedProgress * sides);

  const dotPosition = useMemo(() => {
    const distance = localProgress * totalPathLength;
    return getPointOnPath(vertices, distance);
  }, [localProgress, totalPathLength, vertices]);

  const color = SHAPE_COLORS[sides] || '#ffffff';
  
  useEffect(() => {
    // Reset beat counter if progress has reset (new cycle starts)
    if (progress < 0.01 && lastTotalBeats !== -1) {
        setLastTotalBeats(-1);
    }

    if (totalBeats > lastTotalBeats) {
      setLastTotalBeats(totalBeats);
      
      const isAccent = (totalBeats % sides) === 0;
      const gain = isAccent ? 0.7 : 0.4;
      
      let noteFrequency = 440;
      if (scaleFrequencies.length > 0) {
        // Use the shape's own vertices count for the note index
        const noteIndex = (totalBeats % sides) % scaleFrequencies.length;
        noteFrequency = scaleFrequencies[noteIndex];
      }
      
      audioService.play(instrument, noteFrequency, gain);
    }
  }, [progress, lastTotalBeats, totalBeats, instrument, sides, speed, scaleFrequencies, pathLengthRatio]);


  return (
    <g style={{ filter: 'url(#glow)' }}>
      <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.6" />
      <circle cx={dotPosition.x} cy={dotPosition.y} r="8" fill={color} />
    </g>
  );
};

export default Polygon;
