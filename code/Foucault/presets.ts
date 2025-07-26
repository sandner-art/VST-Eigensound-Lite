import type { PhysicsParams } from './types';

export interface Preset {
  name: string;
  params: PhysicsParams;
}

export const PRESETS: Preset[] = [
  {
    name: 'Earth (Paris)',
    params: {
      length: 67,
      latitude: 48.85,
      damping: 0.005,
      timeScale: 400,
      maxPathLength: 500,
      gravity: 9.81,
      bodyAngularVelocity: 7.2921e-5,
      pivotRotationSpeed: 0,
      gravityJitter: 0,
      launchEnergy: 0,
      simulationQuality: 6,
    },
  },
  {
    name: 'Mars',
    params: {
      length: 40,
      latitude: 45,
      damping: 0.005,
      timeScale: 300,
      maxPathLength: 500,
      gravity: 3.72, // Lower gravity
      bodyAngularVelocity: 7.0882e-5, // Slightly slower rotation than Earth
      pivotRotationSpeed: 0,
      gravityJitter: 0,
      launchEnergy: 0,
      simulationQuality: 5,
    },
  },
  {
    name: 'Jupiter',
    params: {
      length: 100,
      latitude: 75,
      damping: 0.008,
      timeScale: 600,
      maxPathLength: 500,
      gravity: 24.79, // High gravity
      bodyAngularVelocity: 1.758e-4, // Fast rotation
      pivotRotationSpeed: 0.01,
      gravityJitter: 0.5,
      launchEnergy: 0.2,
      simulationQuality: 7,
    },
  },
  {
    name: 'The Sun',
    params: {
      length: 100,
      latitude: 90,
      damping: 0.01,
      timeScale: 800,
      maxPathLength: 400,
      gravity: 274, // Very high gravity
      bodyAngularVelocity: 2.9e-6, // Slower rotation
      pivotRotationSpeed: 0,
      gravityJitter: 4,
      launchEnergy: 0,
      simulationQuality: 4,
    },
  },
  {
    name: 'Neutron Star',
    params: {
      length: 10,
      latitude: 90,
      damping: 0.001,
      timeScale: 1000,
      maxPathLength: 800,
      gravity: 5000, // Conceptually scaled for sonification
      bodyAngularVelocity: 0.8, // Very fast rotation, scaled for effect
      pivotRotationSpeed: 0.1,
      gravityJitter: 8,
      launchEnergy: 1.5,
      simulationQuality: 8,
    },
  },
  {
    name: 'Earth (Equator)',
    params: {
      length: 50,
      latitude: 0,
      damping: 0.005,
      timeScale: 300,
      maxPathLength: 500,
      gravity: 9.81,
      bodyAngularVelocity: 7.2921e-5,
      pivotRotationSpeed: 0,
      gravityJitter: 0,
      launchEnergy: 0,
      simulationQuality: 5,
    },
  },
];