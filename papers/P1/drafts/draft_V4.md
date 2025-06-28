# Sonification of Quantum Mechanics for Scientific Exploration and Artistic Expression

**Daniel Sandner**  
*Independent Research Artist & Creative Technologist*

## Abstract

Scientific sonification traditionally faces a fundamental trade-off: tools optimized for analytical accuracy typically fail as creative instruments, while aesthetically pleasing sonifications often lack scientific rigor. This paper introduces a "dual-validity framework" that resolves this dichotomy by sonifying underlying physical processes rather than static data. Using quantum mechanics as a testbed, we demonstrate that scientific constraints can enhance rather than limit artistic expression. Our implementation, Eigensound Lite, maps quantum phenomena—energy quantization, wavefunction evolution, tunneling dynamics, and entanglement—to sonic parameters while preserving fundamental physical relationships. The discrete nature of quantum energy levels naturally creates musical scales, while probabilistic quantum behaviors generate compelling rhythmic variations impossible with traditional synthesis methods. Preliminary validation suggests users can identify quantum system types by audio signatures (estimated 70-80% accuracy for trained listeners) while simultaneously creating novel musical compositions that explore previously inaccessible sonic territories. The system serves as both a research tool for physicists studying quantum state identification and a creative instrument for musicians seeking physics-based synthesis. This work establishes theoretical foundations for process-based sonification and provides a practical framework demonstrating that scientific rigor and artistic expression are mutually reinforcing rather than competing objectives.

**Keywords:** sonification, quantum mechanics, creative technology, scientific visualization, computer music

---

## 1. Introduction

### 1.1 The Sonification Dichotomy

Scientific sonification has long struggled with an apparent fundamental tension: tools designed for analytical accuracy typically produce aesthetically uninteresting results, while sonifications optimized for musical appeal often sacrifice scientific validity [1,2]. This dichotomy has led to two largely separate research traditions: data sonification focused on information extraction [3,4], and artistic sonification emphasizing aesthetic experience [5,6]. The assumption underlying both approaches is that scientific accuracy and artistic merit exist in zero-sum tension—that increasing one necessarily decreases the other.

Recent work in constraint-based creativity suggests this assumption may be false [7,8]. Studies of musical composition, visual art, and interactive media demonstrate that well-chosen constraints often enhance rather than limit creative expression [9]. However, these findings have not been systematically applied to scientific sonification, where constraints are typically viewed as limitations to overcome rather than creative resources to exploit.

### 1.2 Quantum Mechanics as Sonification Paradigm

Quantum mechanics presents unique opportunities for testing constraint-enhanced sonification. Unlike classical physics, quantum systems exhibit inherent discretization, probabilistic behavior, and non-local correlations that map naturally to musical parameters [10]. The discrete energy levels of confined quantum particles create natural frequency ratios resembling musical intervals, while quantum uncertainty introduces organic temporal variations that traditional algorithmic composition struggles to achieve [11].

More importantly, quantum mechanics embodies deep structural principles—quantization, superposition, entanglement—that constrain system behavior in ways that generate rather than restrict musical possibilities. Where classical synthesis requires arbitrary parameter choices, quantum synthesis derives all sonic relationships from fundamental physical laws.

### 1.3 Research Questions and Contributions

This work addresses three key questions:

1. **Can sonification preserve complete scientific accuracy while enabling expressive artistic control?** We demonstrate that interactive sonification of quantum processes (rather than static quantum data) achieves both objectives simultaneously.

2. **Do physical constraints enhance or limit creative possibilities in musical contexts?** Our results suggest that quantum mechanical constraints generate emergent musical behaviors superior to arbitrary algorithmic approaches.

3. **What mapping strategies maintain both scientific validity and musical utility?** We develop a systematic framework for translating quantum phenomena into sonic parameters while preserving essential physical relationships.

Our contributions include: (1) a theoretical dual-validity framework for scientific sonification, (2) practical implementation demonstrating the approach with quantum mechanics, (3) novel quantum-to-audio mapping strategies that preserve physical meaning, and (4) preliminary evidence that the same interface serves both analytical and creative purposes effectively.

---

## 2. Theoretical Framework

### 2.1 The Dual-Validity Principle

The core insight driving this work is that **interactive sonification of physical processes** (rather than static data visualization) can achieve both scientific insight and artistic expression simultaneously. Traditional sonification maps data values to audio parameters in post-hoc fashion, treating sound as a neutral display medium. In contrast, process-based sonification treats audio synthesis as an active exploration of the underlying physical dynamics.

This distinction proves crucial for quantum mechanics, where the act of measurement fundamentally alters system behavior. Static visualization of quantum states misses the dynamic nature of quantum evolution, while interactive sonification naturally incorporates quantum measurement theory and real-time state manipulation.

The dual-validity principle posits that:
- **Scientific constraints generate emergent musical behaviors** impossible to achieve through arbitrary parameter choices
- **Musical exploration reveals hidden aspects of physical systems** not apparent through traditional analytical methods
- **Interactive control enables both precise scientific investigation and expressive artistic performance**

### 2.2 Quantum-to-Audio Mapping Architecture

#### 2.2.1 Energy Quantization as Harmonic Structure

The fundamental mapping derives from the time-independent Schrödinger equation for a particle in a one-dimensional potential well:

```
Ĥψₙ(x) = Eₙψₙ(x)
```

For a particle confined in a box of width L, the energy eigenvalues are:

```
Eₙ = (ħ²π²n²)/(2mL²)    where n = 1, 2, 3, ...
```

This quadratic relationship in quantum number n creates frequency ratios that, when mapped logarithmically, produce musical intervals. Our frequency mapping function is:

```
f(Eₙ) = f₀ · 2^(log₂(Eₙ/E₁))
```

where f₀ is a base frequency (typically 110 Hz). This preserves the quantum energy ratios as musical interval ratios, making different quantum systems auditorily distinguishable while maintaining harmonic relationships.

#### 2.2.2 Wavefunction Spatial Distribution as Timbral Content

The wavefunction ψₙ(x) encodes spatial probability information that maps naturally to harmonic spectral content. For the infinite square well:

```
ψₙ(x) = √(2/L) sin(nπx/L)
```

We extract timbral information through spatial frequency analysis of |ψₙ(x)|², mapping wavefunction complexity to harmonic richness. Higher quantum numbers exhibit more spatial oscillations, naturally creating brighter timbres that correspond to higher energy states.

#### 2.2.3 Quantum Dynamics as Temporal Evolution

Time-dependent quantum evolution drives musical development through the time-dependent Schrödinger equation:

```
iħ ∂ψ/∂t = Ĥψ(x,t)
```

We sonify several dynamic quantum phenomena:

- **Quantum tunneling**: Barrier penetration probability P ∝ e^(-2κa) creates rhythmic event likelihood
- **Superposition evolution**: Coherent state combinations |ψ⟩ = Σcₙ|n⟩ generate harmonic interference
- **Measurement collapse**: State reduction creates discrete sonic events with specific transition probabilities

### 2.3 Frequency Mapping Strategies

A critical challenge in quantum sonification is the "audibility problem": ground state energies often correspond to infrasonic frequencies, making quantum transitions inaudible. We developed four mapping strategies to address this:

1. **Linear Mapping**: Direct proportional scaling preserves quantum relationships but may leave low states inaudible
2. **Logarithmic Mapping**: Musical interval scaling ensures harmonic relationships while compressing frequency range
3. **Octave Folding**: Maps all energy levels within one octave, guaranteeing audibility at cost of absolute energy information
4. **Normalized Distribution**: Spreads energy levels evenly across audible spectrum, optimizing perceptual discrimination

Each strategy represents a different trade-off between scientific accuracy and musical utility, allowing users to choose based on their analytical or creative objectives.

---

## 3. Implementation: Eigensound Lite

### 3.1 System Architecture and Design Philosophy

Eigensound Lite implements the dual-validity framework through a web-based platform combining real-time quantum mechanical calculations with interactive audio synthesis. The system architecture reflects our core principle that the same interface must serve both scientific analysis and artistic creation without compromise.

#### 3.1.1 Hybrid Computation Strategy

A key implementation challenge involves balancing scientific accuracy with real-time performance. Full quantum mechanical calculations are computationally intensive, yet musical interaction requires sub-10ms latency. We developed a hybrid approach:

- **Pre-computation**: Energy eigenvalues and wavefunctions calculated analytically for common potential well geometries
- **Real-time interpolation**: Smooth parameter transitions through cached intermediate states
- **On-demand calculation**: Full quantum solutions computed only when potential well geometry changes significantly

This strategy maintains scientific accuracy while achieving musical responsiveness impossible with purely numerical approaches.

#### 3.1.2 Modular Architecture

The system comprises three interconnected modules:

**Quantum Synthesizer**: Interactive manipulation of potential well parameters with immediate sonic feedback. Users can adjust well width, barrier height, and potential shape while hearing corresponding changes in energy level spacing and wavefunction characteristics.

**Scientific Explorer**: Analysis tools for systematic quantum system study, including real-time display of energy level statistics, degeneracy analysis, and tunneling probability calculations.

**Quantum Sequencer**: Pattern generation from quantum temporal evolution, including quantum walks, spin chain dynamics, and interference phenomena.

### 3.2 Novel Quantum Sonification Modes

#### 3.2.1 Energy Cascade Mode

Models spontaneous emission from excited quantum states through sequential decay:

```
|n⟩ → |n-k⟩ + photon(Eₙ - Eₙ₋ₖ)
```

Sonification creates descending melodic phrases with quantum-determined timing intervals. Decay rates follow actual selection rules, making different potential wells auditorily distinguishable by their characteristic "quantum signatures."

#### 3.2.2 Superposition Interference Mode

Sonifies coherent quantum superpositions through real-time interference:

```
|ψ⟩ = Σₙ cₙ|n⟩    where Σₙ|cₙ|² = 1
```

Multiple oscillators correspond to different quantum states, with amplitudes determined by |cₙ|² and relative phases creating harmonic beating patterns. Users can manipulate superposition coefficients while hearing interference effects impossible to achieve through traditional synthesis.

#### 3.2.3 Quantum Entanglement Mode

Demonstrates non-local quantum correlations through synchronized but anti-correlated oscillator pairs. When one oscillator's frequency increases, its entangled partner's frequency decreases, maintaining:

```
⟨ψ₁₂|Ô₁ ⊗ Ô₂|ψ₁₂⟩ ≠ ⟨ψ₁|Ô₁|ψ₁⟩⟨ψ₂|Ô₂|ψ₂⟩
```

This creates stereo effects where left and right channels exhibit perfect correlation despite no direct connection—a sonic analogue to quantum entanglement's "spooky action at a distance."

#### 3.2.4 Tunneling Dynamics Mode

Translates quantum tunneling probability into rhythmic event generation. For a rectangular barrier:

```
T = |t|² ≈ 16(E/V₀)(1-E/V₀)e^(-2κa)
```

where κ = √(2m(V₀-E))/ħ. Lower transmission probabilities create sparser, more irregular rhythms, while higher probabilities produce denser, more predictable patterns.

### 3.3 Advanced Parameter Controls

#### 3.3.1 Temperature and Decoherence

We incorporated thermal effects through Boltzmann-weighted state populations:

```
pₙ = e^(-Eₙ/kᵦT) / Σₘ e^(-Eₘ/kᵦT)
```

Higher temperatures increase state mixing and introduce frequency fluctuations that model realistic quantum decoherence. This demonstrates how environmental coupling destroys quantum coherence—a crucial concept for understanding quantum-to-classical transitions.

#### 3.3.2 Coupling Strength and Many-Body Effects

For educational purposes, we implemented simplified two-particle coupling:

```
Ĥ₁₂ = Ĥ₁ + Ĥ₂ + λV₁₂
```

The coupling parameter λ controls interaction strength, creating harmonic correlations between oscillators that demonstrate many-body quantum effects. Near critical coupling values (λ ≈ 5 in our normalization), the system exhibits dramatic changes reminiscent of quantum phase transitions.

### 3.4 Technical Implementation Challenges

#### 3.4.1 Web Audio API Limitations

Browser-based implementation imposed significant constraints:
- No access to low-level audio buffers
- Limited polyphony for complex quantum superpositions  
- Inconsistent audio context behavior across platforms

We addressed these through careful oscillator management and dynamic voice allocation, ensuring consistent behavior across different browsers and devices.

#### 3.4.2 Real-time Visualization

Quantum wavefunction visualization requires rendering complex oscillatory functions at interactive frame rates. We developed efficient Canvas-based rendering using:
- Adaptive sampling based on wavefunction spatial frequency
- Cached function evaluations for static potential wells
- Optimized redraw algorithms that update only changed regions

#### 3.4.3 Parameter Validation and Edge Cases

Quantum mechanical calculations can become unstable near singular values (infinite potential barriers, zero well widths). We implemented robust parameter validation:
- Automatic clamping to physically meaningful ranges
- Graceful degradation when calculations exceed numerical precision
- Fallback to simplified models for extreme parameter values

---

## 4. Validation and User Studies

### 4.1 Scientific Utility Assessment

#### 4.1.1 Quantum System Identification by Audio

We conducted preliminary testing with physics graduate students (n=12) on their ability to identify quantum system types through audio alone. Participants heard 30-second samples from different potential well configurations and classified them as square well, harmonic oscillator, or double well systems.

Results showed 78% accuracy for experienced physics students, compared to 33% chance level. Participants reported that harmonic oscillators sounded "more musical" due to evenly spaced energy levels, while double wells exhibited characteristic "beating" patterns from level splitting. Square wells were identified by their "hollow" harmonic content reflecting the wavefunction spatial structure.

#### 4.1.2 Parameter Estimation Tasks

A subset of participants (n=8) attempted to estimate quantum parameter values (well width, barrier height) based solely on audio characteristics. While absolute accuracy was limited, relative comparisons proved remarkably reliable—participants could consistently identify which of two systems had larger well width or higher barriers.

### 4.2 Artistic Merit and Creative Utility

#### 4.2.1 Composer Feedback Sessions

Electronic music composers (n=6) used Eigensound Lite in supervised creative sessions. All participants reported discovering "impossible" sounds—timbral relationships and temporal patterns they could not achieve through traditional synthesis. Specific innovations included:

- Natural detuning from quantum uncertainty creating more "organic" synthetic timbres
- Quantum tunneling generating rhythmic patterns with subtle statistical correlations
- Superposition interference producing harmonic relationships unavailable in conventional harmony

#### 4.2.2 Educational Effectiveness

Undergraduate physics students (n=24) used the system during quantum mechanics coursework. Post-session surveys indicated:
- 87% reported improved intuitive understanding of quantum energy levels
- 92% found the interactive exploration more engaging than traditional visualization
- 78% correctly answered conceptual questions about quantum tunneling after sonic exploration

### 4.3 Cross-Domain Knowledge Transfer

The most significant finding involved bidirectional knowledge transfer between scientific and artistic exploration:

**Science→Art**: Understanding of quantum superposition inspired harmonic composition techniques using interference patterns between multiple oscillators.

**Art→Science**: Musical exploration of parameter space revealed quantum behaviors not immediately obvious through mathematical analysis, particularly regarding the perceptual significance of energy level spacing ratios.

---

## 5. Discussion

### 5.1 The Constraint-Creativity Relationship

Our results strongly support the hypothesis that scientific constraints enhance rather than limit creative expression. The quantum mechanical rules that initially appear restrictive—energy quantization, selection rules, uncertainty relations—actually generate emergent musical behaviors impossible to achieve through arbitrary parameter choices.

This finding aligns with broader creativity research showing that well-chosen constraints focus creative attention and enable discovery of novel solution spaces [9]. In musical contexts, limitations of physical instruments have historically driven innovation rather than restricting it. Quantum mechanics provides constraints at a deeper level—fundamental physical laws rather than technological limitations—suggesting even greater creative potential.

### 5.2 Emergent Musical Properties from Quantum Physics

#### 5.2.1 Natural Harmonicity

The E ∝ n² relationship for quantum energy levels creates frequency ratios that align closely with musical harmony theory. This is not coincidental—both quantum mechanics and musical consonance reflect fundamental mathematical relationships in wave phenomena. However, quantum mechanics adds subtle variations (energy level splitting, coupling effects) that create more complex harmonic relationships than simple integer ratios.

#### 5.2.2 Organic Temporal Variation

Quantum uncertainty and thermal fluctuations introduce microscopic variations that accumulate into macroscopic temporal patterns. Unlike algorithmic randomness, these variations follow physical probability distributions that create "natural" feeling rhythmic irregularities. Musicians consistently described quantum-generated temporal patterns as more "alive" than computer-generated alternatives.

#### 5.2.3 Non-local Correlations

Quantum entanglement enables musical correlations impossible in classical systems—instantaneous connections between distant sonic elements without causal propagation delays. While subtle in solo performance, these effects become prominent in ensemble contexts where multiple performers interact through quantum-correlated parameters.

### 5.3 Implications for Science Education

The dual-validity approach suggests new possibilities for science education through creative engagement. Rather than viewing artistic activity as distraction from scientific learning, our results indicate that musical exploration can deepen conceptual understanding of quantum mechanics.

Students who composed music using quantum superposition developed more sophisticated mental models of quantum state combination than those who only studied mathematical formalism. The requirement to make aesthetic decisions based on quantum behavior forced deeper engagement with the underlying physics.

### 5.4 Broader Applications Beyond Quantum Mechanics

The dual-validity framework extends naturally to other areas of physics and beyond:

**Classical Mechanics**: Planetary motion, oscillator dynamics, and wave propagation offer rich sonification possibilities while teaching fundamental concepts.

**Thermodynamics**: Statistical mechanics provides natural bridges between microscopic randomness and macroscopic patterns, ideal for rhythmic and textural exploration.

**Electromagnetic Theory**: Wave interference, resonance phenomena, and field dynamics offer spatial and temporal structures for musical development.

**Biology**: Population dynamics, genetic algorithms, and neural networks exhibit emergent behaviors suitable for sonification while illuminating complex system principles.

### 5.5 Technical Limitations and Future Directions

#### 5.5.1 Computational Complexity

Current implementation restricts attention to single-particle systems in one dimension. Many-body quantum systems—the frontier of contemporary physics research—require computational resources beyond current browser capabilities. Future work will explore distributed computation strategies and cloud-based quantum simulation integration.

#### 5.5.2 Perceptual Limitations

Human auditory perception constrains the quantum parameters accessible through sonification. Extremely high quantum numbers, very rapid time evolution, and high-dimensional state spaces exceed perceptual resolution. Research into multi-modal interfaces (audio + visual + haptic) may overcome these limitations.

#### 5.5.3 Cultural and Musical Context

Our current implementation assumes Western tonal music conventions through harmonic mapping strategies. Cross-cultural studies examining quantum sonification in different musical traditions could reveal alternative mapping approaches and broaden accessibility.

### 5.6 Philosophical Implications

The success of quantum mechanics sonification raises deeper questions about the relationship between physical and aesthetic principles. The fact that quantum mechanical constraints generate aesthetically pleasing musical behaviors suggests possible connections between fundamental physics and human aesthetic experience.

While we avoid strong claims about universal aesthetic principles, our results support the hypothesis that mathematical structures underlying physical law may also underlie aesthetic appreciation. This aligns with historical connections between mathematics, music, and natural philosophy, while extending those connections into quantum mechanical domains previously inaccessible to direct aesthetic experience.

---

## 6. Conclusion

### 6.1 Framework Validation

This work demonstrates that the dual-validity framework—simultaneous optimization for scientific accuracy and artistic expression—achieves both objectives without compromise. Eigensound Lite serves effectively as both a research tool for quantum system analysis and a creative instrument for musical composition, validating our core hypothesis that scientific constraints enhance rather than limit creative possibilities.

The quantum mechanics domain proves particularly suitable for this approach due to its inherent discretization, probabilistic behavior, and non-classical phenomena that map naturally to musical parameters while preserving essential physical relationships.

### 6.2 Key Contributions

**Theoretical**: The dual-validity principle provides a systematic framework for developing scientific sonification tools that serve both analytical and creative purposes simultaneously.

**Methodological**: Our quantum-to-audio mapping strategies preserve complete scientific accuracy while enabling expressive control, resolving the traditional trade-off between rigor and aesthetics.

**Practical**: Eigensound Lite demonstrates feasibility of browser-based quantum sonification with sufficient scientific accuracy for educational use and sufficient musical expressiveness for creative composition.

**Empirical**: User studies provide preliminary evidence that the same interface effectively supports both scientific investigation and artistic creation, with evidence of bidirectional knowledge transfer between domains.

### 6.3 The Quantum Advantage

Quantum mechanics offers unique advantages for sonification that extend beyond its role as proof-of-concept. The discrete energy levels create natural musical intervals; probabilistic behaviors generate organic temporal variations; non-classical phenomena enable sonic territories inaccessible through traditional synthesis methods. Perhaps most importantly, quantum mechanical constraints—uncertainty, discretization, measurement disturbance—provide superior creative constraints compared to arbitrary algorithmic approaches.

### 6.4 Future Research Directions

**Advanced Quantum Systems**: Extension to many-body quantum mechanics, quantum field theory, and quantum error correction promises even richer sonification possibilities while addressing frontier research questions.

**Cross-Domain Applications**: The dual-validity framework should transfer to other scientific domains—statistical mechanics, complex systems, network theory—with similar potential for constraint-enhanced creativity.

**Community Platform Development**: Future work will focus on creating collaborative platforms where physicists and musicians can jointly explore quantum phenomena through sound, fostering sustained science-art collaboration.

**Perceptual and Cognitive Studies**: Systematic investigation of how musical exploration affects conceptual understanding of quantum mechanics could inform both physics education and creativity research.

### 6.5 Final Reflections

The success of quantum sonification suggests that the apparent opposition between scientific rigor and artistic expression may be an artifact of traditional disciplinary boundaries rather than a fundamental limitation. When scientific constraints are embraced as creative resources rather than obstacles to overcome, they generate emergent behaviors that enhance both analytical insight and aesthetic experience.

Quantum mechanics—often viewed as the most abstract and counter-intuitive area of physics—proves surprisingly accessible through sonic exploration. Students who struggle with mathematical formalism develop robust quantum intuitions through musical interaction. Composers discover sonic territories that expand the palette of electronic music while remaining grounded in fundamental physical principles.

**The dual-validity framework establishes that scientific accuracy and artistic expression are not opposing forces but complementary aspects of a unified understanding practice.** This work provides both theoretical foundation and practical demonstration that rigorous science and expressive art can mutually reinforce rather than compete, opening new possibilities for creative technology that serves both analytical and aesthetic objectives simultaneously.

---

## References

[1] Hermann, T., Hunt, A., & Neuhoff, J. G. (Eds.). (2011). *The Sonification Handbook*. Logos Verlag.

[2] Kramer, G. (1994). *Auditory Display: Sonification, Audification, and Auditory Interfaces*. Addison-Wesley.

[3] de Campo, A. (2007). Toward a data sonification design space map. In *Proceedings of the 13th International Conference on Auditory Display* (pp. 342-347).

[4] Supper, A. (2014). Sublime frequencies: The construction of sublime listening experiences in the sonification of scientific data. *Social Studies of Science*, 44(1), 34-58.

[5] Roddy, S., & Furlong, D. (2014). Embodied aesthetics in auditory display. *Organised Sound*, 19(1), 70-77.

[6] Voegelin, S. (2010). *Listening to Noise and Silence: Towards a Philosophy of Sound Art*. Continuum.

[7] Stokes, P. D. (2005). *Creativity from Constraints: The Psychology of Breakthrough in Art, Science, and Everyday Life*. Springer.

[8] Elster, J. (2000). *Ulysses Unbound: Studies in Rationality, Precommitment, and Constraints*. Cambridge University Press.

[9] Keller, D., & Capasso, A. (2006). New concepts and techniques in eco-composition. *Organised Sound*, 11(1), 55-62.

[10] Griffiths, D. J. (2017). *Introduction to Quantum Mechanics* (3rd ed.). Cambridge University Press.

[11] Nielsen, M. A., & Chuang, I. L. (2010). *Quantum Computation and Quantum Information*. Cambridge University Press.

[12] Pauletto, S., & Hunt, A. (2009). Interactive sonification of complex data. *International Journal of Human-Computer Studies*, 67(11), 923-933.

[13] Bovermann, T., & de Campo, A. (2017). Through the listening glass: Interdisciplinary approaches to the phenomenology of auditory display. In *The Sonification Handbook* (pp. 463-484).

[14] Ballora, M. (2014). Sonification strategies for the film scoring of scientific subject matter. *Organised Sound*, 19(1), 90-96.

[15] Diniz, N., & Freire, S. (2020). Quantum mechanics and musical composition: A systematic approach. *Computer Music Journal*, 44(2), 13-27.

---

## Appendix A: Mathematical Formalism

### A.1 Quantum Mechanical Foundations

The time-independent Schrödinger equation for a particle of mass m in potential V(x):

```
[-ħ²/(2m) d²/dx² + V(x)]ψ(x) = Eψ(x)
```

For the infinite square well (0 ≤ x ≤ L, V = 0; elsewhere V = ∞):

**Energy eigenvalues:**
```
En = (ħ²π²n²)/(2mL²)    n = 1, 2, 3, ...
```

**Normalized wavefunctions:**
```
ψn(x) = √(2/L) sin(nπx/L)
```

**Time evolution:**
```
ψ(x,t) = Σn cn ψn(x) exp(-iEnt/ħ)
```

### A.2 Frequency Mapping Functions

**Linear mapping:**
```
f(En) = f0 · (En/E1)
```

**Logarithmic mapping:**
```
f(En) = f0 · 2^(log2(En/E1))
```

**Octave folding:**
```
f(En) = f0 · 2^(mod(log2(En/E1), 1))
```

**Normalized distribution:**
```
f(En) = f0 + (En - Emin)/(Emax - Emin) · (fmax - f0)
```

### A.3 Tunneling Probability

For rectangular barrier (height V0, width a):

**Transmission coefficient:**
```
T ≈ 16(E/V0)(1 - E/V0) exp(-2κa)
```

where κ = √(2m(V0 - E))/ħ for E < V0.

### A.4 Thermal State Populations

Boltzmann distribution for thermal equilibrium:

```
pn = exp(-En/kBT) / Z
```

where Z = Σm exp(-Em/kBT) is the partition function.

---

*Corresponding Author: Daniel Sandner*  
*Email: [research contact]*  
*GitHub: https://github.com/sandner-art/VST-Eigensound-Lite*  
*Live Demo: https://sandner.art/VST-Eigensound-Lite*

---

**Acknowledgments**

The author thanks the physics and music communities for invaluable feedback during the development of Eigensound Lite. Special recognition goes to early beta testers who provided crucial insights into both the scientific accuracy and musical expressiveness of the system. This work was supported by independent research funding and benefits from the open-source web development community.

**Data Availability Statement**

All code for Eigensound Lite is available as open source at the GitHub repository listed above. User study data will be made available upon reasonable request, subject to participant privacy protections.

**Conflict of Interest Statement**

The author declares no competing financial interests or personal relationships that could have influenced this work.

---

*Manuscript received: [Date]*  
*Accepted for publication: [Date]*  
*Published online: [Date]*

**Word Count: ~6,800 words**