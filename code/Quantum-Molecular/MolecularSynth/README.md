---
layout: default 
---

# ⚛️ MolecularSynth

An interactive web-based synthesizer that translates the structural and quantum properties of chemical molecules into sound and musical patterns.



## The Experiment

MolecularSynth is an experiment in data sonification, exploring the question: **"How we would sonify a molecule structure?"**

It transforms abstract chemical data—from 2D structure and molecular weight to quantum mechanical properties like HOMO-LUMO energy gaps—into an interactive auditory and visual experience. The goal is to provide a novel, intuitive way to perceive the characteristics of different molecules through sound, and use it for creative expression.

## Methods & Technology

The application employs a parameter-mapping strategy to sonify chemical data using standard web technologies.

#### Sonification Method
*   **Atom Sonification:** Each type of atom (C, N, O, H) is mapped to a unique sonic profile, including a base frequency, waveform (`sine`, `sawtooth`, etc.), and filter settings, giving each element a distinct timbre.
*   **Structural Sequencing:** In playback mode, the application sequences through the atoms in the molecule, creating rhythmic and melodic patterns based on the structure.
*   **Interactive Modes:** Different modes reinterpret the molecular data for creative effect:
    *   **Structural:** Emphasizes the unique sound of each element.
    *   **Melodic:** Maps atoms to notes within musical scales.
    *   **Electronic:** Links sound characteristics to properties like electronegativity.
    *   **Soundscape:** Creates an ambient drone based on the molecule's overall properties.

#### Technology Stack
*   **Audio Engine:** The **Web Audio API** is used for all real-time sound synthesis, including oscillators, gain nodes, filters, and spatial panning.
*   **Visualization:** Molecules are rendered as **SVG** elements, dynamically generated and animated using JavaScript and CSS Custom Properties.
*   **Interface:** The entire experience is built with vanilla **HTML5, CSS3, and JavaScript (ES6)**, with no external frameworks.

## Features
*   Interactive 2D visualization of a library of common molecules (Caffeine, Aspirin, etc.).
*   Multiple sonification modes for different auditory perspectives.
*   Detailed sound design controls for timbre, harmonics, spatial width, and more.
*   Transport controls (Play, Stop, Loop) and a real-time audio visualizer.

---

© 2025 Daniel Sandner. Released under the [MIT License](https://opensource.org/licenses/MIT).