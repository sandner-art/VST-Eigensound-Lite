---
layout: default 
---

# Euclid Sonifier

## Abstract

The Rhythmic Euclid Sonifier is an experimental interactive web application designed for the exploratory auditory display of mathematical and geometric principles. It is inspired by [Oliver Byrne’s work from 1847](https://www.c82.net/euclid/) and explores abstract mathematical concepts and intuitive sensory perception by translating geometric parameters into a configurable soundscape. The system integrates a parametric geometric visualizer, a real-time synthesis engine, a procedural rhythm generator, and a novel "AI Distiller" component. This feature, utilizing the Google Gemini API, is an experiment how AI can creatively interpret geometric concepts and generate complete, complex sonification patches (settings for the app), offering users a medium for both artistic creation and educational discovery.

---

### 1. Introduction

Sonification, the use of non-speech audio to convey information or perceptualize data, offers a powerful alternative to traditional visual display. This project applies this paradigm to the field of mathematics, a domain rich with abstract relationships and dynamic systems that are often challenging to grasp through static diagrams alone.

The primary objective of the Rhythmic Euclid Sonifier is to create an interactive environment where users can "hear" the relationships within fundamental geometric constructions. By manipulating the parameters of a theorem and receiving immediate, corresponding auditory feedback, users can develop a more intuitive and embodied understanding of the underlying mathematical principles. The application is designed not only as an educational tool but also as a generative musical instrument, enabling the creation of complex soundscapes and rhythms that are procedurally derived from geometric logic.

### 2. Core Components

The application is comprised of four primary, deeply integrated modules.

#### 2.1 Geometric Engine
The core of the application is a library of interactive mathematical presets. These are not static visualizations but dynamic models whose parameters can be manipulated by the user in real-time. The library includes:

-   **Euclidean Propositions:** Foundational constructions from Euclid's *Elements*, such as I.47 (Pythagorean Theorem), I.1 (Equilateral Triangle), and II.5 (Geometric Algebra).
-   **Mathematical Constants & Ratios:** Visualizations of the Golden Ratio (φ) and Silver Ratio (δ).
-   **Sequences & Spirals:** Constructions of the Fibonacci Spiral, Fibonacci Circles, and the Lituus Spiral.
-   **Theorems & Properties:** Interactive models of Thales's Theorem, Circle Ratios, and more.

Each preset exposes key geometric values (e.g., side lengths, areas, angles, curve radii) as data sources for the sonification engine.

#### 2.2 Sonification Engine
This is a real-time audio synthesis module built on the Web Audio API. It maps the data streams from the Geometric Engine to sonic parameters. Key features include:

-   **Source Mapping:** Each geometric value can be assigned a unique sound source, including standard oscillators (sine, square, FM), various noise types (white, pink, brown), a granular synthesizer (for textural sounds from samples), and custom-loaded audio samples.
-   **Parameter Modulation:** Geometric data can control the pitch, amplitude, or filter cutoff of its assigned source.
-   **Advanced Synthesis:** The engine supports Frequency Modulation (FM) synthesis, granular synthesis with controllable grain rate and duration, and a global Low-Frequency Oscillator (LFO) that can be modulated by geometric values to create vibrato, tremolo, or filter sweeps.
-   **Effects Chain:** Each sound source can have its own assignable effect, including distortion, delay, and convolution reverb.

#### 2.3 Rhythmic Module
The application includes a Euclidean rhythm generator, which can be procedurally controlled by the geometric data. This creates a powerful link between static geometric properties and temporal, rhythmic structures.

-   **Euclidean Patterns:** The number of pulses and total steps for each drum part (kick, snare, hi-hat) can be mapped to any sonifiable geometric value.
-   **Harmonic Integration:** A "Harmonic Bass" feature allows the kick drum to trigger a pitched bass note that is harmonically related to the main sonification's base frequency, weaving the rhythm into the overall tonal fabric.

#### 2.4 AI Distiller (Powered by Google Gemini)
The AI Distiller is a novel feature that leverages a large language model to function as a creative partner. Instead of manually configuring the many parameters of the synthesis and rhythm engines, the user can provide a high-level creative prompt.

-   **Workflow:** The user selects a geometric preset, chooses a creative style (e.g., "Ambient," "Rhythmic," "Experimental"), and provides optional text notes.
-   **Generative Patching:** The Gemini model receives the mathematical concept's description, the list of available parameters, and the user's creative direction. It then generates a complete JSON patch that configures every aspect of the application: initial geometry, source assignments, synthesis rules, LFO settings, effects, and rhythm mappings.
-   **Creative Rationale:** Crucially, the AI also provides a natural language explanation for its creative choices, describing how it attempted to metaphorically link the mathematical properties to the resulting sound design. This turns the "black box" of generative AI into a transparent, collaborative process.

### 3. Use Cases & Examples

#### 3.1 Educational Exploration: The Pythagorean Theorem (Euclid I.47)
A student can explore the relationship `a² + b² = c²`. They might assign a low, stable sine wave to side `a` and a slightly higher one to side `b`. The hypotenuse, `c`, could be mapped to a brighter sawtooth wave whose pitch is controlled by its length. As the student manipulates the sliders for `a` and `b`, they hear the pitch of `c` change in direct, audible relation, aurally reinforcing the theorem's concept of dependence.

#### 3.2 Generative Music: The Fibonacci Spiral & AI
A musician, inspired by the concept of the Fibonacci spiral, selects the preset and asks the AI Distiller to generate a "melodic and ambient" patch. The AI might respond with a configuration where:
-   The total length of the spiral controls the cutoff frequency of a sweeping low-pass filter over a pink noise source, creating an evolving "wind" texture that represents the spiral's growth.
-   Each of the first 8 segments is sonified with a sine wave, mapped to a minor pentatonic scale.
-   A subtle delay effect is applied to all sources to enhance the ambient feel.
-   The AI's rationale explains: "The sweeping noise represents the continuous, organic nature of the spiral, while the discrete tones highlight the individual Fibonacci numbers that form its structure."

The musician can then use this generated patch as a starting point, modifying it to their taste or performing with it by manipulating the spiral's `count` and `size` parameters.

### 4. Conclusion

The Rhythmic Euclid Sonifier project demonstrates a novel methodology for the interactive exploration of mathematics. By combining a robust geometric engine with advanced sonification techniques and a powerful generative AI, it provides a unique platform for education, artistic expression, and research into human-computer interaction. It allows users to move beyond passive observation of mathematical principles and engage with them in an active, intuitive, and creative auditory experience.

---

**Technical Stack:** React, TypeScript, Web Audio API, Tailwind CSS, Google Gemini API.

© 2025 Daniel Sandner. Released under the [MIT License](https://opensource.org/licenses/MIT).