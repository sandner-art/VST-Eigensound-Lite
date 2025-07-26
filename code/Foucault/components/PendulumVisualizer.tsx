import React, { useRef, useEffect, useCallback } from 'react';
import type { PendulumState } from '../types';

interface PendulumVisualizerProps {
  pendulums: PendulumState[];
  onStart: (x: number, y: number, scale: number) => void;
  pivotRotationSpeed: number;
}

export const PendulumVisualizer: React.FC<PendulumVisualizerProps> = ({ pendulums, onStart, pivotRotationSpeed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSwinging = pendulums.length > 0;

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 4;

    onStart(x - centerX, y - centerY, scale);
  }, [onStart]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if(parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 4;

      const drawGuides = () => {
        context.save();
        context.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        context.lineWidth = 1;
        const radius = scale * 1.2;
        context.beginPath();
        context.setLineDash([2, 4]);
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
        context.setLineDash([]);
        context.restore();
      };
      drawGuides();

      for (const pendulum of pendulums) {
        // Draw rotating pivot if active
        if (pivotRotationSpeed !== 0) {
            const PIVOT_RADIUS = 0.1;
            const pivotX = centerX + PIVOT_RADIUS * Math.cos(pendulum.pivotAngle) * scale;
            const pivotY = centerY + PIVOT_RADIUS * Math.sin(pendulum.pivotAngle) * scale;
            context.beginPath();
            context.arc(pivotX, pivotY, 3, 0, 2 * Math.PI);
            context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            context.fill();
        }

        // Draw path with redshift/blueshift
        if (pendulum.path.length > 1) {
          context.lineWidth = 2.0;
          context.lineCap = 'round';
          
          let lastPoint = pendulum.path[0];
          for (let i = 1; i < pendulum.path.length; i++) {
            const pathPoint = pendulum.path[i];
            const opacity = i / pendulum.path.length;
            
            // Redshift/Blueshift calculation for color
            const shiftAmount = pathPoint.dopplerShift * 100; // Shift hue by up to 100 degrees
            const baseHue = parseInt(pendulum.color);
            const newHue = (baseHue - shiftAmount + 360) % 360;

            context.strokeStyle = `hsla(${newHue}, 100%, 75%, ${opacity * 0.6})`;
            context.beginPath();
            context.moveTo(centerX + lastPoint.x * scale, centerY + lastPoint.y * scale);
            context.lineTo(centerX + pathPoint.x * scale, centerY + pathPoint.y * scale);
            context.stroke();
            lastPoint = pathPoint;
          }
        }

        // Draw pendulum bob
        const bobX = centerX + pendulum.position.x * scale;
        const bobY = centerY + pendulum.position.y * scale;
        
        const bobGlow = context.createRadialGradient(bobX, bobY, 0, bobX, bobY, 12);
        bobGlow.addColorStop(0, `hsla(${pendulum.color}, 100%, 80%, 1)`);
        bobGlow.addColorStop(0.5, `hsla(${pendulum.color}, 100%, 60%, 0.8)`);
        bobGlow.addColorStop(1, `hsla(${pendulum.color}, 100%, 50%, 0)`);
        
        context.beginPath();
        context.arc(bobX, bobY, 12, 0, 2 * Math.PI);
        context.fillStyle = bobGlow;
        context.fill();
        
        context.beginPath();
        context.arc(bobX, bobY, 5, 0, 2 * Math.PI);
        context.fillStyle = `hsla(${pendulum.color}, 100%, 95%, 1)`;
        context.fill();
      }
      
      if (!isSwinging) {
        context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        context.font = '16px sans-serif';
        context.textAlign = 'center';
        context.fillText('Tap anywhere to create a pendulum', centerX, centerY);
      }
      
      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pendulums, pivotRotationSpeed]);

  return <canvas ref={canvasRef} onClick={handleClick} className="w-full h-full cursor-pointer bg-transparent" />;
};