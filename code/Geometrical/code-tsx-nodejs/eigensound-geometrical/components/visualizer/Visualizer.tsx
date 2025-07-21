import React, { useState, useCallback } from 'react';
import { useAnimationFrame } from '../../hooks/useAnimationFrame.js';
import { SVG_SIZE, BASE_RADIUS, MIN_SIDES, MAX_SIDES } from '../../constants.js';
import Polygon from './Polygon.js';
import Circle from './Circle.js';

const Visualizer = ({ isPlaying, tempo, shapes, renderMode, scaleFrequencies, cycleLength }) => {
  const [progress, setProgress] = useState(0);
  
  const cycleDuration = (60 * 1000) / tempo * 4; // 4 beats per cycle

  const animationCallback = useCallback((elapsedTime) => {
    let currentProgress;
    if (cycleLength === Infinity) {
      currentProgress = elapsedTime / cycleDuration;
    } else {
      const totalCycleDuration = cycleDuration * cycleLength;
      // Use modulo to loop the progress within the total cycle duration
      currentProgress = (elapsedTime % totalCycleDuration) / cycleDuration;
    }
    setProgress(currentProgress);
  }, [cycleDuration, cycleLength]);


  useAnimationFrame(animationCallback, isPlaying);

  const getRadiusForStackedMode = (sides) => {
      const scale = (sides - MIN_SIDES) / (MAX_SIDES - MIN_SIDES);
      return BASE_RADIUS * (0.5 + scale * 0.4);
  };

  const circleCircumference = 2 * Math.PI * BASE_RADIUS;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="max-w-full max-h-full"
        style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.1))' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {shapes.map((shape) => {
            if (shape.sides === 0) {
                return (
                    <Circle
                        key={shape.id}
                        shape={shape}
                        progress={progress}
                        radius={BASE_RADIUS}
                    />
                );
            }
            
            const radius = renderMode === 'inscribed' 
                ? BASE_RADIUS 
                : getRadiusForStackedMode(shape.sides);

            return (
                <Polygon
                    key={shape.id}
                    shape={shape}
                    progress={progress}
                    radius={radius}
                    renderMode={renderMode}
                    scaleFrequencies={scaleFrequencies}
                    circleCircumference={circleCircumference}
                />
            );
        })}
      </svg>
    </div>
  );
};

export default Visualizer;
