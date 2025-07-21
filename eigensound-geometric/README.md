# Geometric Rhythm Lab
**Author: Daniel Sandner © 2025**

An interactive web application for musical expression and sonification, transforming geometric shapes into complex polyrhythmic and melodic patterns. This project serves as a digital instrument and a research platform for exploring the creative potential of simulated mathematical, physical, and geometrical phenomena.

> NOTE: You can import your own samples of reasonable length. You can also try the demo samples available in the eigensound-geometric\samples directory.

## Abstract

The Geometric Rhythm Lab is an experiment in the sonification of geometry. It aims to create a novel musical instrument by mapping the fundamental properties of geometric shapes to rhythmic and melodic structures. At its core, a point travels along the perimeter of a given polygon, triggering a sound at each vertex. By layering multiple shapes with varying numbers of sides, users can intuitively generate and visualize complex polyrhythms and musical sequences. This application provides a tool for musicians, artists, and researchers to explore the inherent musicality of mathematical ratios and forms.

## The Science of Sonification: Geometry as Rhythm

The translation from geometry to music is not arbitrary; it relies on direct correlations between a shape's properties and musical concepts.

*   **Polyrhythms from Polygons:** The number of vertices on a polygon directly defines the number of beats in its rhythmic cycle. A triangle produces a 3-beat pattern, a square produces a 4-beat pattern, and so on. When played simultaneously, these shapes create a polyrhythm. For instance, combining a triangle (3) and a square (4) results in a classic 3:4 polyrhythm, a foundational element in many musical traditions.

*   **Syncopation from Star Paths:** By changing a regular polygon to its star-shaped variant, the path the point travels is reordered, skipping vertices in a regular pattern. This alters the timing between beat triggers from isochronous (evenly spaced) to a more complex, syncopated sequence, introducing a new rhythmic character to the same set of vertices.

*   **Tempo and Subdivision:** The global tempo (BPM) sets the foundational pulse. The speed multiplier for each individual shape acts as a rhythmic subdivision tool. A shape with a speed of `2x` will complete its rhythmic cycle twice as fast, effectively playing eighth notes where it would have played quarter notes.

*   **Melody from Scales:** The application moves beyond rhythm into harmony and melody. By selecting a root note and a musical scale (e.g., Major Pentatonic, Natural Minor), each vertex of a polygon is mapped to a specific note within that scale. This transforms the rhythmic pattern into a distinct arpeggio or melodic phrase, whose character is defined by the geometry of the shape.

## Key Features

*   **Polyrhythm Engine:** Add and layer shapes, from a simple 4-beat circle to polygons with 3 through 8 sides.
*   **Harmonic Control:** Set a global root note and musical scale to define the melodic context for all shapes.
*   **Samples and Dynamic Sound Design:** Assign unique instruments to each shape. Choose from built-in synths (sine, kick, snare, hi-hat) or upload your own audio files to use as **custom samples**.
*   **Rhythmic Variation:** Adjust the global tempo, modify individual shape speeds, and toggle between regular polygon and star-polygon paths.
*   **Visual Modes:** Switch between `inscribed` mode (all shapes share a common path circumference for synchronized timing) and `stacked` mode (shapes are scaled by side count for visual clarity).
*   **Cycle Control:** Loop patterns over a set number of bars (1, 2, 4, 8) or let them evolve infinitely.

## Future Development

The Geometric Rhythm Lab is an evolving project. Future development paths aim to deepen its capabilities as both a creative tool and a research instrument:

*   **More Geometrical Relations and 3D Geometry** Enable generating rhythm with 3D geometry, vertices, edges, and faces. Adding more concepts from Euclid and Non-Eucleidian geometry.
*   **MIDI Output:** Enable the application to control external hardware synthesizers, DAWs, and other music software.
*   **Advanced Synthesis:** Integrate more complex sound synthesis engines (e.g., FM, AM, Granular) for a richer sonic palette.
*   **Physics-Based Interaction:** Introduce simulated physical forces like gravity or collisions that can dynamically influence the paths and sounds.
*   **Generative Composition:** Implement AI-driven features to suggest new patterns, evolve existing ones, or generate entire musical sections based on user-defined parameters.
*   **State Persistence:** Allow users to save and load their sessions and presets.

## Technologies
- **Core:** React, TypeScript, Web Audio API
- **Styling:** Tailwind CSS
