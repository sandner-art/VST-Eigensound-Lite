---
layout: default 
---

# Foucault Terraphone

**A Real-Time Interactive Sonification of Pendulum Physics and Celestial Mechanics**, Conceptual Experiment

---

### Abstract

The Foucault Terraphone is a real-time, interactive web application that explores a novel sonification of the physics governing a Foucault pendulum. By numerically modeling the pendulum's motion under the influence of gravity and the Coriolis effect, the application translates complex physical dynamics into an evolving soundscape. It is designed to serve a dual purpose: as an intuitive educational tool for demonstrating celestial mechanics and as an expressive digital musical instrument for generating complex, generative audio textures.

---

### 1. Introduction

The Foucault pendulum, first exhibited in 1851, provides a direct proof of a planet's rotation. The apparent rotation of the pendulum's swing plane is a consequence of the Coriolis force, an inertial force that acts on objects in motion within a rotating frame of reference.

The Foucault Terraphone project aims to make the principles of this phenomenon both audible and interactive. Users can instantiate virtual pendulums and manipulate the physical parameters of the simulated environment—such as gravity, latitude, and planetary rotation speed—and immediately hear the impact on the system's dynamics.

### 2. System Architecture

The application is architected around two core engines: a physics simulation engine and an audio synthesis engine, linked by a defined set of parameter mappings.

#### 2.1. Physics Engine

The simulation numerically integrates the equations of motion for a spherical pendulum. The model accounts for:
- **Gravitational Acceleration (`g`):** The primary restoring force.
- **Pendulum Length (`L`):** Determines the natural frequency of oscillation.
- **Damping:** A coefficient that models energy loss over time.
- **Coriolis Effect:** The simulation incorporates the Coriolis acceleration term, which is dependent on user-defined `latitude` and the celestial body's `bodyAngularVelocity`. This term is responsible for the precession of the pendulum's swing plane.
- **Artistic Modulators:** Parameters such as `Gravity Jitter` and `Pivot Rotation Speed` are included to extend the system's expressive range beyond a pure physical simulation.

The simulation is executed on a per-frame basis using `requestAnimationFrame`, with a variable time-step solver to ensure stability and performance.

#### 2.2. Sonification Engine

The state of each pendulum is mapped to parameters of a dedicated audio voice within the Web Audio API graph. This mapping forms the core of the sonification process.

| Physical Parameter      | Audio Parameter              | Description                                                                 |
|-------------------------|------------------------------|-----------------------------------------------------------------------------|
| **Velocity Magnitude**  | Oscillator Frequency (Pitch) | The faster the pendulum bob moves, the higher the fundamental frequency.     |
| **Velocity Magnitude**  | Filter Cutoff Frequency      | Higher speeds result in a brighter, more harmonically rich timbre.          |
| **Swing Amplitude**     | Gain (Volume)                | Wider swings produce a louder sound, decaying as the pendulum loses energy. |
| **Precession Angle**    | Stereo Panning               | As the swing plane rotates, the sound pans across the stereo field.         |
| **Radial Velocity**     | Doppler Shift (Pitch Bend)   | Simulates the Doppler effect; pitch increases as the bob moves toward the observer (center) and decreases as it moves away. |

The audio engine supports multiple synthesizer waveforms (`sine`, `square`, `sawtooth`, `triangle`, `noise`) and allows users to load their own audio samples, which are then pitch-shifted and manipulated by the physics engine. A global reverb and compressor are applied to the master output to create a cohesive soundscape.

#### 2.3. Visualization

The application state is rendered on an HTML5 Canvas. Each pendulum's path is traced, with the color of the path dynamically modulated by the calculated Doppler shift. This creates a direct visual corollary to the audio pitch-bending, with "blueshifted" (approaching) and "redshifted" (receding) path segments.

### 3. Usage & Examples

Interaction is initiated by clicking or tapping on the canvas, which creates a pendulum at that location. The control panel allows for real-time adjustment of all physical and audio parameters.

#### 3.1. Example: The Coriolis Effect on Earth
- **Setup:** Select the `Earth (Paris)` preset. Launch a single pendulum near the center.
- **Observation:** The pendulum's swing plane will slowly rotate clockwise, which is audible as a gradual, continuous pan of the sound from one stereo channel to the other. The period of this rotation is a function of the latitude.
- **Contrast:** Switch to the `Earth (Equator)` preset. Launching a pendulum here will result in no precession and no stereo panning, correctly modeling the absence of the vertical component of the Coriolis force at the equator.

#### 3.2. Example: Exploring Celestial Bodies
- **Setup:** Switch between the `Mars`, `Jupiter`, and `Neutron Star` presets.
- **Observation:** The sonic characteristics change dramatically. `Mars`, with its lower gravity, produces slower, lower-frequency oscillations. `Jupiter`, with its high gravity and rapid rotation, results in a faster, more chaotic soundscape with noticeable precession. `Neutron Star` is an extreme case, producing very high-frequency oscillations and extremely rapid panning, sonifying a physically theoretical environment.

#### 3.3. Example: Musical Expression
- **Setup:** Load a custom melodic or percussive sample. Set `Launch Energy` to a non-zero value to impart initial velocity. Create multiple pendulums in a rhythmic sequence.
- **Observation:** The physics simulation acts as a complex, generative sequencer. The interactions between pendulums (though not directly modeled, their audio combines) and the evolving physical parameters create intricate, non-repeating musical patterns and ambient textures.

### 4. Technology Stack
- **Frontend:** React with TypeScript
- **Styling:** Tailwind CSS
- **Audio Synthesis:** Web Audio API
- **Rendering:** HTML5 Canvas

© 2025 Daniel Sandner. Released under the [MIT License](https://opensource.org/licenses/MIT).