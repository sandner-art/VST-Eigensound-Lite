import type { PhysicsParams, AudioParams } from './types';

export const DEFAULT_PHYSICS_PARAMS: PhysicsParams = {
  length: 40, // A moderately long pendulum
  latitude: 45, // Mid-latitude
  damping: 0.005, // Light damping
  timeScale: 300, // Accelerated time
  maxPathLength: 500,
  gravity: 9.81, // Earth's gravity
  bodyAngularVelocity: 7.2921e-5, // Earth's angular velocity
  pivotRotationSpeed: 0,
  gravityJitter: 0,
  launchEnergy: 0,
  simulationQuality: 5, // Medium quality
};

export const DEFAULT_AUDIO_PARAMS: AudioParams = {
    volume: 0.3,
    synthType: 'sine',
    dopplerEffect: 0.5,
    reverb: 0.3,
};