export interface Point {
  x: number;
  y: number;
}

export interface PathPoint extends Point {
  dopplerShift: number; // For redshift/blueshift visualization
}

export interface PendulumState {
  id: number;
  color: string;
  position: Point;
  velocity: Point;
  amplitude: number;
  precessionAngle: number;
  pivotAngle: number;
  path: PathPoint[];
}

export interface PhysicsParams {
  length: number; // in meters
  latitude: number; // in degrees
  damping: number; // dimensionless coefficient
  timeScale: number; // multiplier for simulation speed
  maxPathLength: number;
  gravity: number; // m/s^2
  bodyAngularVelocity: number; // rad/s
  pivotRotationSpeed: number; // rad/s for artistic effect
  gravityJitter: number; // magnitude of random gravity fluctuations
  launchEnergy: number; // initial velocity boost
  simulationQuality: number; // 1-10, higher is more accurate but slower
}

export type SynthType = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'noise' | 'sample';

export interface AudioParams {
  volume: number;
  synthType: SynthType;
  dopplerEffect: number;
  reverb: number;
}

export interface StorablePreset {
  id: string;
  name: string;
  physics: PhysicsParams;
  audio: AudioParams;
}