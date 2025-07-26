import { useState, useRef, useCallback, useEffect } from 'react';
import type { PendulumState, PhysicsParams, AudioParams } from '../types';

const INITIAL_STATE: PendulumState[] = [];
const HUE_PALETTE = [180, 210, 300, 30, 0, 60]; // Teal, Blue, Purple, Yellow, Red, Orange
const PIVOT_RADIUS = 0.1; // The radius of the pivot's rotation, in simulation units.

export const useFoucaultPendulum = (params: PhysicsParams, audioParams: AudioParams) => {
  const [pendulums, setPendulums] = useState<PendulumState[]>(INITIAL_STATE);
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const colorIndexRef = useRef(0);
  
  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const audioParamsRef = useRef(audioParams);
  useEffect(() => {
    audioParamsRef.current = audioParams;
  }, [audioParams]);


  const simulationStep = useCallback((currentTime: number) => {
    setPendulums(prevPendulums => {
      if (prevPendulums.length === 0) {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        lastTimeRef.current = null;
        return [];
      }
      
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
        animationFrameId.current = requestAnimationFrame(simulationStep);
        return prevPendulums;
      }
      
      const deltaTime = (currentTime - lastTimeRef.current) / 1000.0;
      lastTimeRef.current = currentTime;
      
      const currentParams = paramsRef.current;
      const effectiveDeltaTime = Math.min(deltaTime, 0.1); // Prevent huge jumps on tab resume
      const totalSimTime = effectiveDeltaTime * currentParams.timeScale;
      
      if (totalSimTime <= 0) {
          animationFrameId.current = requestAnimationFrame(simulationStep);
          return prevPendulums;
      }

      // Simulation quality affects sub-step size for accuracy vs performance trade-off
      const MAX_DT = 0.011 - (currentParams.simulationQuality * 0.001);
      const subSteps = Math.ceil(totalSimTime / MAX_DT);
      const dt = totalSimTime / subSteps;
      
      const g_base = currentParams.gravity;

      const updatedPendulums = prevPendulums.map(p => {
        let tempState = { 
            position: { ...p.position }, 
            velocity: { ...p.velocity },
            pivotAngle: p.pivotAngle
        };

        for (let i = 0; i < subSteps; i++) {
          let { x, y } = tempState.position;
          let { x: vx, y: vy } = tempState.velocity;
          
          const g = g_base + (Math.random() - 0.5) * 2 * currentParams.gravityJitter;
          const L = currentParams.length;

          const currentPivotAngle = tempState.pivotAngle + currentParams.pivotRotationSpeed * dt;
          const pivotX = PIVOT_RADIUS * Math.cos(currentPivotAngle);
          const pivotY = PIVOT_RADIUS * Math.sin(currentPivotAngle);
          
          const relativeX = x - pivotX;
          const relativeY = y - pivotY;

          const ax_harmonic = -(g / L) * relativeX;
          const ay_harmonic = -(g / L) * relativeY;
          
          const latRad = currentParams.latitude * (Math.PI / 180);
          const omega_z = currentParams.bodyAngularVelocity * Math.sin(latRad);
          const ax_coriolis = 2 * omega_z * vy;
          const ay_coriolis = -2 * omega_z * vx;
          
          const ax_damping = -currentParams.damping * vx;
          const ay_damping = -currentParams.damping * vy;
          
          const ax = ax_harmonic + ax_coriolis + ax_damping;
          const ay = ay_harmonic + ay_coriolis + ay_damping;
          
          const new_vx = vx + ax * dt;
          const new_vy = vy + ay * dt;
          const new_x = x + new_vx * dt;
          const new_y = y + new_vy * dt;

          tempState.position = { x: new_x, y: new_y };
          tempState.velocity = { x: new_vx, y: new_vy };
          tempState.pivotAngle = currentPivotAngle;
        }

        const { position: finalPosition, velocity: finalVelocity, pivotAngle: finalPivotAngle } = tempState;
        const amplitude = Math.sqrt(finalPosition.x**2 + finalPosition.y**2);

        // Calculate doppler shift for visualization
        const positionMagnitude = Math.sqrt(finalPosition.x ** 2 + finalPosition.y ** 2);
        let pointDopplerShift = 0;
        if (positionMagnitude > 1e-6) {
            const radialVelocity = (finalPosition.x * finalVelocity.x + finalPosition.y * finalVelocity.y) / positionMagnitude;
            const maxTheoreticalSpeed = Math.sqrt(2 * g_base / currentParams.length) * amplitude;
            const normalizedRadialVelocity = radialVelocity / (maxTheoreticalSpeed + 1e-6);
            pointDopplerShift = Math.max(-1, Math.min(1, normalizedRadialVelocity)) * audioParamsRef.current.dopplerEffect;
        }

        const newPath = [...p.path, { ...finalPosition, dopplerShift: pointDopplerShift }];
        if (newPath.length > currentParams.maxPathLength) {
          newPath.shift();
        }
        
        const latRad = currentParams.latitude * (Math.PI / 180);
        const omega_z = currentParams.bodyAngularVelocity * Math.sin(latRad);
        const precessionAngle = p.precessionAngle + omega_z * totalSimTime;

        return {
          ...p,
          position: finalPosition,
          velocity: finalVelocity,
          amplitude,
          precessionAngle,
          pivotAngle: finalPivotAngle,
          path: newPath
        };
      });

      const activePendulums = updatedPendulums.filter(p => p.amplitude > 0.005 || (p.velocity.x**2 + p.velocity.y**2) > 0.0001);
      
      if (activePendulums.length > 0) {
        animationFrameId.current = requestAnimationFrame(simulationStep);
      } else {
        lastTimeRef.current = null;
        animationFrameId.current = null;
      }
      return activePendulums;
    });
  }, []);

  const addPendulum = useCallback((startX: number, startY: number, visualScale: number) => {
    const scale = visualScale > 0 ? visualScale : 200;
    const simX = startX / scale;
    const simY = startY / scale;

    const energy = paramsRef.current.launchEnergy;
    const angle = Math.random() * 2 * Math.PI;
    const initialVx = Math.cos(angle) * energy;
    const initialVy = Math.sin(angle) * energy;

    const newPendulum: PendulumState = {
        id: Date.now() + Math.random(),
        color: HUE_PALETTE[colorIndexRef.current].toString(),
        position: { x: simX, y: simY },
        velocity: { x: initialVx, y: initialVy },
        amplitude: Math.sqrt(simX**2 + simY**2),
        precessionAngle: 0,
        pivotAngle: 0,
        path: [{ x: simX, y: simY, dopplerShift: 0 }],
    };
    
    colorIndexRef.current = (colorIndexRef.current + 1) % HUE_PALETTE.length;
    
    setPendulums(prev => [...prev, newPendulum]);
  }, []);

  const clearPendulums = useCallback(() => {
    setPendulums([]);
  }, []);
  
  useEffect(() => {
    const hasPendulums = pendulums.length > 0;
    const isLooping = animationFrameId.current !== null;

    if (hasPendulums && !isLooping) {
        lastTimeRef.current = performance.now();
        animationFrameId.current = requestAnimationFrame(simulationStep);
    }
  }, [pendulums.length, simulationStep]);
  
  useEffect(() => {
    return () => {
        if(animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    }
  }, []);

  return { pendulums, addPendulum, clearPendulums };
};