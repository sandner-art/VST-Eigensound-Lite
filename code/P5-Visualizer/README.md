# eigensound| viz v0.1.0

Concept: **Real-time scientific music visualization engine implementing physics-based audio analysis and rendering**

## Overview

eigensound| viz is an interactive visualization system that transforms audio signals into scientific representations using computational physics, mathematical modeling, and signal processing algorithms. The application bridges acoustic analysis with visual mathematics, providing real-time implementations of complex physical systems driven by spectral audio features.

## Core Algorithms

### Audio Analysis Pipeline
- **FFT Processing**: 4096-point Fast Fourier Transform with 75% smoothing
- **Spectral Feature Extraction**: Real-time computation of spectral centroid, flux, and harmonic series detection
- **Adaptive Response**: Dynamic beat/melody energy separation with automatic balance adjustment
- **Multi-band Analysis**: Frequency-domain segmentation for targeted visualization responses

### Advanced Audio Intelligence
- **Reaction Shift**: Automated detection and weighting of rhythmic vs. harmonic content
- **Sensitivity Oscillation**: Periodic modulation of response amplitude creating natural dynamics
- **Temporal Integration**: 10-frame spectral history for flux calculation and onset detection

## Visualization Presets

### Physics-Based Simulations

**Relativistic Particle Physics**
- Implementation of special relativistic dynamics with Lorentz factor calculations
- Electromagnetic field interactions using inverse-square force laws
- Velocity-dependent mass effects and speed-of-light constraints

**Wilson Cloud Chamber**
- Scientifically accurate particle track simulation with mass-to-charge ratios
- Magnetic field curvature based on Lorentz force equations
- Energy loss modeling through ionization density calculations
- Real-time physics: electron (0.511 MeV/c²), muon (105.7 MeV/c²), proton (938.3 MeV/c²), alpha (3.7 GeV/c²)

**Quantum Field Visualization**
- Hermite polynomial wave functions for quantum harmonic oscillator states
- Time-evolution operators with complex phase relationships
- Probability density calculations |ψ|² with quantum tunneling effects
- Energy level diagrams with population dynamics

**Spacetime Curvature (General Relativity)**
- Schwarzschild metric approximations for gravitational field visualization
- Geodesic path calculations with light ray bending
- Mass-energy tensor representations from audio amplitude mapping

### Mathematical Frameworks

**Eigenvalue Decomposition**
- Real-time covariance matrix construction from frequency domain data
- 2×2 eigenvalue/eigenvector calculation with vector field rendering
- Principal component analysis visualization of spectral relationships

**Inversive Geometry**
- Möbius transformations with circle inversion mapping
- Conformal geometry implementations preserving angular relationships
- Hyperbolic space representations using Poincaré disk model

**Fractal Dynamics**
- Julia set iteration with audio-modulated complex parameters
- High-performance rendering using reduced iteration counts
- Dynamic parameter evolution based on spectral centroid

### Physical Systems

**Plasma Magnetohydrodynamics**
- Electric and magnetic field calculations using Coulomb and Biot-Savart laws
- Plasma beta parameter computation (pressure ratio)
- Kelvin-Helmholtz instability visualization

**Crystal Lattice Dynamics**
- Crystallographic structure rendering (cubic, hexagonal, tetragonal systems)
- Miller indices-based atomic positioning
- Brillouin zone representations with lattice vibrations

**Phonon Dispersion**
- Acoustic and optical phonon mode calculations
- Lattice displacement fields using harmonic oscillator models
- Dispersion relation plotting ω(k) in momentum space

## Technical Architecture

### Performance Optimization
- Canvas 2D rendering with adaptive quality scaling
- Optimized wave interference using spatial subdivision
- Memory-efficient particle systems with object pooling
- Real-time audio processing without latency accumulation

### User Interaction Systems
- Dynamic center-of-origin repositioning for field-based visualizations
- Neural network overlay system for hybrid visualization modes
- Comprehensive settings persistence using JSON serialization
- Keyboard-based navigation and control

## Research Directions & Future Development

### Computational Enhancement
- **WebGL Migration**: GPU-accelerated particle systems enabling 10⁶+ particle simulations
- **WebAssembly Integration**: High-performance physics calculations for real-time N-body dynamics
- **Distributed Rendering**: Multi-monitor support with synchronized parameter spaces

### Advanced Audio Analysis
- **Machine Learning Integration**: Automated genre classification affecting visualization parameters
- **Psychoacoustic Modeling**: Critical band analysis and masking effects
- **Source Separation**: Independent visualization of extracted instrumental components

### Scientific Extensions
- **Quantum Computing Visualization**: Qubit state representation and quantum gate operations
- **Fluid Dynamics Simulation**: Navier-Stokes equation solutions with audio-driven boundary conditions
- **Network Theory**: Graph-based analysis of harmonic relationships and temporal dependencies

### Research Applications
- **Acoustic Ecology**: Species-specific frequency analysis with biodiversity metrics
- **Music Cognition**: Real-time analysis of consonance/dissonance perception
- **Nonlinear Dynamics**: Chaos theory applications to musical structure analysis
- **Bioacoustics**: Cross-species communication pattern visualization

## Installation & Usage

### Requirements
- Modern web browser with Web Audio API support
- Audio input capability (microphone or file upload)
- Hardware-accelerated Canvas 2D rendering

### Controls
- **Audio Input**: File upload, microphone, or synthesized demo modes
- **Preset Selection**: 18 physics and mathematics-based visualizations
- **Real-time Parameters**: Sensitivity, complexity, evolution rate, color mapping
- **Advanced Features**: Neural merge, reaction shift, center positioning
- **Keyboard Shortcuts**: Arrow keys (center), Space (pause), Home (reset), R (refresh)

## Technical Specifications

- **Audio Processing**: 44.1kHz sampling, 4096-point FFT, real-time analysis
- **Rendering**: 60fps Canvas 2D with alpha blending and particle systems
- **Memory Usage**: Optimized for sustained operation without memory leaks
- **Latency**: <20ms audio-to-visual response time

## Contributing

Development focuses on scientifically accurate implementations of physical and mathematical systems. Contributions should maintain computational efficiency while preserving theoretical foundations.

---

*eigensound| viz represents an intersection of digital signal processing, computational physics, and interactive visualization, designed for educational, research, and artistic applications requiring rigorous scientific basis.*