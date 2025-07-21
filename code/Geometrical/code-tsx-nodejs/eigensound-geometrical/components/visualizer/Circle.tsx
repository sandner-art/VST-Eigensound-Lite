import React, { useState, useEffect, useMemo } from 'react';
import { SVG_CENTER } from '../../constants.js';
import { audioService } from '../../services/audioService.js';

const Circle = ({ shape, progress, radius }) => {
  const { speed, instrument } = shape;
  const [lastTotalBeats, setLastTotalBeats] = useState(-1);
  const color = '#60a5fa'; // blue-400

  // The circle has 4 beats per full rotation at 1x speed
  const totalBeats = Math.floor(progress * speed * 4);
  
  const dotPosition = useMemo(() => {
    const angle = (progress * speed * 2 * Math.PI) - (Math.PI / 2); // Start from top
    return {
      x: SVG_CENTER + radius * Math.cos(angle),
      y: SVG_CENTER + radius * Math.sin(angle),
    };
  }, [progress, speed, radius]);

  useEffect(() => {
    // Reset beat counter if progress has reset (new cycle starts)
    if (progress < 0.01 && lastTotalBeats !== -1) {
      setLastTotalBeats(-1);
    }

    if (totalBeats > lastTotalBeats) {
      setLastTotalBeats(totalBeats);
      
      const isAccent = (totalBeats % 4) === 0;
      const gain = isAccent ? 0.8 : 0.5;
      
      // Frequency doesn't matter for non-pitched instruments, but provide a default for samples
      audioService.play(instrument, 110, gain);
    }
  }, [progress, speed, lastTotalBeats, totalBeats, instrument]);

  return (
    <g style={{ filter: 'url(#glow)' }}>
      <circle
        cx={SVG_CENTER}
        cy={SVG_CENTER}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.4"
      />
      <circle cx={dotPosition.x} cy={dotPosition.y} r="8" fill={color} />
    </g>
  );
};

export default Circle;
