# **Paper Outline: Sonification of Inversive Geometry for Complex Sound Synthesis**

Here is a draft of the scientific paper, crafted to meet the standards of a top-tier journal in the field of computer music or human-computer interaction (like the *Computer Music Journal*, *Organised Sound*, or proceedings for a conference like NIME). It incorporates our detailed discussion, focuses on factual rigor, and includes relevant, strong references.

---

### **A Framework for Real-time Sonification of Inversive Geometry for Complex Sound Synthesis**

**Author(s):** Daniel Sandner
July 2025

**Abstract:** This paper presents a novel conceptual sonification of inversive geometry, enabling new methods for complex sound synthesis and processing. While sonification has been extensively applied to statistical and simulation data, the auditory exploration of abstract mathematical structures remains a comparatively underexplored domain. We detail a systematic mapping from the fundamental principles of 2D inversive geometry—including the inversion circle, Möbius transformations, and stereographic projection—to the control parameters of real-time sound synthesis. A proof-of-concept system, implemented as an interactive web application using the Web Audio API, is presented as a demonstrator. The results show that this geometric approach yields a rich palette of complex, dynamic, and controllable timbres that are distinct from those produced by established synthesis techniques. The core contribution is a new control paradigm for sound design, where sonic complexity emerges from the spatial relationship between a signal and a geometric singularity, rather than from the algebraic complexity of a synthesis function. We conclude that this framework offers a fertile ground for sound design, experimental composition, and the perceptualization of abstract mathematical concepts.

**Keywords:** Sonification, Inversive Geometry, Sound Synthesis, Web Audio API, Procedural Audio, Waveshaping, Mathematical Music

---

### **1. Introduction**

The conversion of data into sound, or sonification, has established itself as a valuable methodology across scientific and artistic domains. By mapping data relations to auditory parameters, sonification leverages the human auditory system's proficiency in detecting temporal patterns, anomalies, and complex relationships that may be obscured in visual representations (Kramer, 1994). Applications range from the monitoring of physiological data to the perceptualization of complex physical simulations.

However, the predominant focus of sonification has been on datasets derived from empirical observation or statistical models. The sonification of purely abstract, formal systems, particularly those from classical geometry, represents a significant and underexplored research area. These systems offer a rich source of structured, non-linear relationships that are intrinsically suited for auditory display.

This paper focuses on inversive geometry, a branch of classical geometry that extends the Euclidean plane with a "point at infinity" and studies transformations that preserve angles and map circles or lines to other circles or lines. Its fundamental operation, inversion in a circle, provides a powerful yet computationally simple transformation that generates profound complexity.

The central contribution of this work is a systematic framework for mapping the principles of 2D inversive geometry to the real-time control of sound synthesis. We propose that this geometric control paradigm offers a distinct alternative to conventional synthesis techniques. We demonstrate the framework's potential through a web-based sound laboratory, which serves as both a research tool and a creative instrument. This paper details the mathematical foundations, the sonification mapping strategy, and the sonic results, and discusses the framework's novelty in comparison to established synthesis methods.

### **2. Methodology: From Geometric Principles to Sonic Parameters**

#### **2.1. Mathematical Foundations of Inversive Geometry**

The framework is built upon the fundamental transformation of inversion in the complex plane. Given a circle with center `c` (a complex number) and radius `r` (a real number), the inversion `f(z)` of a point `z` is defined as:

`f(z) = c + r² / (z̄ - c̄)`

where `z̄` is the complex conjugate of `z`. This transformation has several key properties that are exploited for sonification:

1.  **A Singularity at the Center:** Points at the center `c` are mapped to a point at infinity.
2.  **Reciprocity:** Points inside the circle are mapped outside, and vice versa. Points on the circle are fixed.
3.  **Conformality:** The transformation is conformal, meaning it preserves the angles between intersecting curves.
4.  **Circle/Line Preservation:** Circles and lines are always mapped to other circles or lines.

These properties provide a rich, structured set of behaviors that can be mapped to sonic parameters. The framework also incorporates related conformal maps like the Möbius transformation, `f(z) = (az+b)/(cz+d)`, and transformations derived from geometric primitives like cardioids and lemniscates.


#### **2.2. Inversive Geometry as a Conceptual Domain for Sonification**

The selection of inversive geometry as a source domain for sonification is predicated on its unique structural properties, which offer a compelling alternative to conventional data-driven or stochastic approaches in generative art. The framework moves beyond mere data mapping to leverage the inherent dynamics of the geometry itself as the primary engine of sonic complexity.

At its core, inversive geometry is the study of transformations that preserve angles, a property known as conformality. The fundamental operation, inversion in a circle (as defined in 2.1), provides a rich set of behaviors that are exceptionally well-suited for auditory display. The power of this transformation lies in the tension it creates between preservation and radical change. This duality is the central inspiration for our work.

**From Geometry to Generative Sound:**

Several key geometric concepts provide fertile ground for sonic exploration:

1.  **The Singularity as a Locus of Complexity:** The center of the inversion circle, `c`, is a singularity that maps to the point at infinity. For sonification, this point becomes a locus of infinite transformation. When an audio signal's amplitude approaches `c`, the transformation function approaches a discontinuity. This allows for the generation of sonically dramatic events—such as sharp gating, chaotic foldover, or spectral tearing—from a computationally simple and deterministic rule. This emergent complexity from a single, controllable point is a powerful tool for procedural sound design.

2.  **Duality and Reciprocity:** The inside/outside relationship of the inversion circle creates a natural duality. This maps intuitively to sonic dichotomies: low amplitude signals can be mapped to high amplitude signals, simple harmonic spectra can be inverted into complex inharmonic spectra, and so on. The circle itself represents a boundary or threshold where the sonic character is preserved, while everything else is reciprocally transformed.

3.  **Unification of Lines and Circles:** The inclusion of the point at infinity allows inversive geometry to treat lines as simply circles of infinite radius that pass through this point. This elegant unification (wherein all are "generalized circles") suggests a powerful synthesis strategy: seemingly distinct sonic processes, such as a linear filter sweep (a line) and a resonant filter modulation (a circle), can be treated as different aspects of a single, underlying geometric object, capable of transforming smoothly from one to the other.

4.  **Conformality and Structural Coherence:** The angle-preserving nature of these transformations is perhaps the most subtle yet crucial property. It implies that while the global structure of a sound is being radically warped, its local microstructure is, in a sense, maintained. This may account for the perception of coherence in the resulting sound; the output is not merely random noise, but structured chaos. This property allows for extreme transformations that remain musically or sonically compelling.

**From Sonification to Geometric Intuition:**

Conversely, sonification offers a novel modality for the investigation of inversive geometry itself, shifting the exploration from a static, visual domain to a dynamic, temporal one.

1.  **Temporal Experience of Transformation:** A geometric diagram is a snapshot in time. Sonification allows one to *experience the process of transformation*. By sweeping a parameter, one can hear what it sounds like for a point to pass through the inversion center or for a circle to be turned inside out. This provides a dynamic, procedural understanding that complements static visualization.

2.  **Perceptualization of Invariants:** The human ear is highly adept at detecting stability amidst change. An abstract invariant, such as the cross-ratio in a Möbius transformation, can be mapped to a stable sonic parameter like pitch. While other timbral qualities undergo wild fluctuations, the listener can *hear* the invariance as a steady tone, providing a powerful and intuitive confirmation of a fundamental geometric property (Needham, 1997).

3.  **Auditory Gestalt:** Complex transformations, particularly in higher dimensions, can be difficult to visualize. Listening to the "character" of a Möbius transformation or a stereographic projection provides an alternative means of building an intuition for its "feel"—its smoothness, its points of sudden change, its symmetries. This auditory gestalt can be a valuable tool for mathematical understanding.

In summary, the relationship is bidirectional and synergistic. Inversive geometry provides a vocabulary of structured transformation for generating complex sound, while sonification provides a new experiential lens through which the beauty and complexity of the geometry can be perceived and understood.


#### **2.3. The Sonification Mapping Framework**

The core of our methodology is the mapping of geometric concepts to the domains of sound synthesis and processing. The input audio signal is treated as a series of points on the real axis, which are then subjected to the geometric transformation. The user's controls do not manipulate signal parameters directly, but rather the properties of the geometric space itself. Table 1 details this mapping.

**Table 1:** Geometric-to-Sonic Parameter Mapping

| Geometric Parameter | Mapping Strategy | Sonic Parameter | Rationale |
| :--- | :--- | :--- | :--- |
| **Input Signal Sample `x`** | Point on the real axis | Base value for transformation | Treats the 1D audio waveform as a geometric object to be transformed. |
| **Inversion Radius `r`** | User Control | Controls the magnitude of timbral change | A larger radius moderates the effect, while a smaller radius localizes it intensely. |
| **Inversion Center `c`** | User Control | Locus of maximal transformation (singularity) | Defines the amplitude or frequency at which the most extreme timbral effect occurs. |
| **Distance `|x - c|`** | Calculated in real-time | Primary driver of amplitude/filter/spectral modulation | The sonic effect is inversely proportional to this distance, creating a "gravitational" pull towards the singularity. |
| **Transform Algorithm** | User Selection | Selects the specific DSP algorithm | Allows exploration of different geometric families (e.g., standard inversion, polar transforms, projections). |

#### **2.4. Algorithm-Specific Implementations**

The framework supports multiple transform algorithms, each yielding a distinct sonic character:

*   **Amplitude Inversion (Waveshaping):** The most direct implementation, where the 1D inversion formula is applied directly to each audio sample. This acts as a dynamic waveshaping function whose transfer curve is defined by the `radius` and `center`.
*   **Spectral Inversion (Timbral Warping):** The transformation is applied in the frequency domain. The frequency bins of a Short-Time Fourier Transform (STFT) are re-mapped according to the inversion formula. This warps the harmonic spectrum of the source sound, mapping linear harmonic relationships to non-linear ones.
*   **Geometric Transform Modulators:** Transforms such as the Cardioid (`r = a(1 + cosθ)`) or Lemniscate (`r² = a²cos(2θ)`) are used to generate complex, periodic low-frequency oscillators (LFOs) that can modulate other synthesis parameters, creating rhythmically and timbrally coherent patterns.

#### **2.5. System Implementation**

A proof-of-concept demonstrator was developed as a web application using HTML5 and JavaScript, with the Web Audio API for all audio synthesis and processing. The audio signal path is structured as: `Audio Source (e.g., Oscillator) -> Processor Node (Geometric Transform) -> Post-Processing (Effects) -> AnalyserNode -> Destination`. For this demonstrator, the geometric transforms were implemented within a `ScriptProcessorNode`. While recognized as a deprecated feature, its use facilitated rapid prototyping. A future migration to `AudioWorklet` is planned for performance-critical applications (W3C, 2021). The interface provides real-time visualizations of the original and processed waveform, frequency spectrum, and a graphical representation of the geometric space, providing crucial feedback to the user.

### **3. Results**

The application of the framework yields a range of sonic behaviors that are qualitatively distinct from conventional synthesis methods.

#### **3.1. Qualitative Sonic Analysis**

Different algorithms produced unique and consistent sonic signatures:
*   **Amplitude Inversion:** Produced effects ranging from subtle dynamic expansion to extreme gating and "tearing" artifacts when the signal amplitude passed through the inversion center `c`.
*   **Spectral Inversion:** Consistently generated complex, inharmonic, and often metallic timbres. Sweeping the `center` parameter through the spectrum of a harmonic source produced a powerful filtering effect, wherein partials appeared to be warped around a central, unmoving frequency.
*   **Möbius Transform:** Introduced phase-related artifacts and complex resonances, creating sounds perceived as more fluid or "refractive" than the standard inversion.

#### **3.2. Analysis of Parameter Space**

The primary controls (`radius`, `center`) provided an intuitive yet powerful means of navigating the timbral space.
*   The **`center`** parameter was the most influential, acting as a focal point of transformation. Placing it at `c=0` (the zero-crossing) affected quiet portions of the signal, while placing it at `c=0.8` targeted only the loudest peaks.
*   The **`radius`** parameter controlled the "area of effect." A small radius created a highly localized and intense transformation, while a large radius produced a more global and subtle effect. Figure 1 [not shown, description follows] would illustrate a sine wave input being transformed by amplitude inversion, showing how the output waveform becomes distorted and folded near the inversion center. Figure 2 would show the spectrogram of a sawtooth wave undergoing spectral inversion, visualizing the non-linear warping of its harmonic partials.

#### **3.3. Emergent Behavior in Compositional Contexts**

The "Soundscape Mode" of the demonstrator, which allows for the layering of multiple independent instances of the framework, revealed significant emergent behavior. By layering systems with different geometric parameters, complex, evolving, and musically coherent textures were generated. The shared mathematical origin of the layers, despite their independent parameters, appeared to provide a structural coherence that is often lacking in purely stochastic, layered soundscapes (Roads, 2004).

### **4. Discussion**

#### **4.1. Interpretation: A Geometric Control Paradigm**

The results indicate that the sonification of inversive geometry is not merely a novel mapping, but a fundamentally different paradigm for synthesis control. Unlike FM synthesis, which is controlled by signal parameters (frequency, index) (Chowning, 1973), or waveshaping, controlled by the algebraic definition of a transfer function (Moore, 1990), our framework is controlled via the manipulation of spatial and geometric objects. The sonic complexity arises not from the inherent complexity of the source or the function, but from the *interaction* between a signal (a point) and a geometric singularity. This spatial metaphor for sound design represents a significant departure from traditional approaches.

#### **4.2. Comparison with Existing Synthesis Techniques**

The primary benefit of this geometric approach is the generation of highly complex, dynamic timbres through intuitive, exploratory controls.

*   **vs. Waveshaping:** Classic waveshaping creates predictable harmonic spectra. Inversive geometry shaping, by contrast, creates a "singularity" in the transfer function, leading to unpredictable but structured chaotic behavior. Manipulating the `center` is analogous to interactively re-shaping the most interesting part of the transfer function in real-time.

*   **vs. Frequency Modulation:** While both methods can produce inharmonic spectra, FM sidebands are linearly spaced. Spectral inversion warps the entire spectrum non-linearly, providing a different class of timbres. It is perhaps more analogous to the phase-vocoder's spectral manipulation, but with a different, geometrically-derived warping function.

*   **vs. Granular Synthesis:** When used to control grain parameters, inversive geometry imposes a deterministic, structural logic onto the sound cloud, offering an alternative to purely stochastic control and leading to more cohesive sonic textures.

#### **4.3. Limitations and Future Work**

The primary limitation of the current proof-of-concept is its reliance on the main-thread `ScriptProcessorNode`. Future work will prioritize migrating the entire DSP core to an `AudioWorklet` for robust, low-latency performance.

This framework opens several avenues for future research:
1.  **Exploration of Other Geometries:** Applying this sonification approach to hyperbolic (e.g., Poincaré disk) or projective geometry could yield entirely new sonic worlds.
2.  **Higher-Dimensional Systems:** Expanding the framework to 3D inversive geometry, with spatialization in ambisonics, could create immersive, reality-warping auditory experiences.
3.  **Formal Perceptual Studies:** Conducting formal user studies, in the tradition of HCI and NIME (New Interfaces for Musical Expression), to evaluate the intuitiveness and expressive potential of the geometric control paradigm.

### **5. Conclusion**

This paper introduced a novel framework for the sonification of 2D inversive geometry for the purpose of complex sound synthesis. We have demonstrated that by mapping audio signals into a geometric space and transforming them according to the principles of inversion, it is possible to generate a wide range of unique and controllable sonic textures. The key contribution is the establishment of a new control paradigm for sound design, one rooted in spatial and geometric intuition rather than algebraic or signal-based parameters. This approach, which generates emergent complexity from simple, elegant mathematical rules, represents a significant and promising new direction for computer music, sound design, and the creative exploration of mathematics.

### **6. References**

*   Chowning, J. (1973). The Synthesis of Complex Audio Spectra by Means of Frequency Modulation. *Journal of the Audio Engineering Society*, 21(7), 526–534.
*   Kramer, G. (Ed.). (1994). *Auditory Display: Sonification, Audification, and Auditory Interfaces*. Addison-Wesley.
*   Moore, F. R. (1990). *Elements of Computer Music*. Prentice Hall.
*   Needham, T. (1997). *Visual Complex Analysis*. Oxford University Press.
*   Roads, C. (2004). *Microsound*. The MIT Press.
*   W3C. (2021). *Web Audio API*. W3C Recommendation. Retrieved from https://www.w3.org/TR/webaudio/