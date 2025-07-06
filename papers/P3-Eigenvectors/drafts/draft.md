
### **Eigenvectors and Eigenvalues in Scientific Sonification: Complex Physical Systems as Musical Instruments**

**Author:** Daniel Sandner

**Abstract:**
We introduce a formal methodology for sound synthesis and processing centered on the eigen-decomposition of parameterized linear systems. This approach treats abstract physical models, described by a system matrix `H`, as configurable digital musical instruments. We establish the core principle: the system's eigenvalues (`E`) define its resonant frequencies, and its eigenvectors (`ψ`) form a natural basis for its timbre and dynamics. We first detail the formal, computationally exact method. We then present a practical, real-time implementation in our web application, `eigensound`, which utilizes heuristic approximations for performance. Furthermore, we extend this concept to a novel audio effect paradigm, "Eigen-Filtering," where an arbitrary audio signal is transformed by projecting it onto the eigen-basis of a chosen physical system. This enables effects like modal quantization and physically-modeled cross-synthesis. The results demonstrate that this framework offers a new vocabulary of expressive, physically-motivated controls for artists and provides scientists with an intuitive auditory tool for exploring the emergent, holistic behavior of complex systems.

---

#### **1. Introduction**

**1.1. The Auditory Lens**

In scientific domains from astrophysics to quantum mechanics, researchers grapple with complex, high-dimensional data. While visual representations are indispensable, they can occlude subtle patterns and dynamic relationships. Sonification, the use of non-speech audio to convey information, offers a powerful, complementary channel for perception. The human auditory system excels at pattern recognition, temporal analysis, and gestalt perception, allowing it to process a holistic stream of information and detect anomalies that may be missed in a series of static plots (Kramer, 1994).

**1.2. From Data Mapping to System Sonification**

Early sonification often relied on direct parameter mapping (e.g., higher value equals higher pitch) (Hermann, 2002). A more sophisticated approach is model-based sonification, which renders the output of a dynamic simulation. This paper builds on this tradition but takes a crucial step further. While established physical modeling synthesis capably simulates known acoustic instruments (Smith, 1992), we propose a generalized framework for sonifying the dynamics of *any* abstract system describable by linear algebra.

**1.3. Core Thesis: The Eigen-Basis as the Natural "Voice" of a System**

We ask a fundamental question: If a quantum system had a voice, what would it sound like? We argue that its voice is not arbitrary, but is intrinsically defined by its eigenspectrum—the very structure that dictates its stability and behavior. The Time-Independent Schrödinger Equation, `Ĥψ = Eψ`, is the quintessential eigenvalue problem. This paper presents a framework to build and "play" digital instruments based on this principle. The sound is not merely an interpretation of the system; it is a direct, audible manifestation of its most fundamental properties. We acknowledge that many systems of interest, such as those in General Relativity, are non-linear. Our model does not attempt a full simulation but sonifies a *linearized approximation* of their effects on a quantum state space—a common and effective technique in theoretical physics.

**1.4. Contributions and Structure**

This paper presents three primary contributions: (1) A formal framework for sound synthesis based on the eigen-decomposition of a system matrix `H`. (2) A novel audio processing technique, "Eigen-Filtering," based on transformation into a system's eigen-basis. (3) A case study, `eigensound`, demonstrating a practical real-time approximation of these principles. We will detail the theoretical framework, analyze its implementation, and discuss its scientific and artistic implications.

#### **2. The Formalism of Eigen-Synthesis**

**2.1. The System as a Resonator: The Role of the Hamiltonian `H`**

We model our system with the linear differential equation `dx/dt = Hx`, where `H` is a parameterized `n x n` matrix representing the system's generator of time evolution. For computational implementation, a continuous physical operator `Ĥ` is discretized by projecting it onto a finite basis of `n` chosen states, resulting in the matrix `H`. The fidelity of the sonification is thus a function of the basis size `n`. The terms of `H` encode the system's physics:
*   **Diagonal terms (`H_ii`):** Represent the self-energy or intrinsic decay rate of a state `i`.
*   **Off-diagonal terms (`H_ij`):** Represent the coupling, interaction, or transition probability between states `i` and `j`.

**2.2. Eigen-Decomposition: Decoupling Dynamics into Pure Modes**

The power of this approach lies in the eigenvalue equation `Hψ = Eψ`. The eigenvectors `ψ` of `H` form a basis in which the system's dynamics are maximally simplified. This is not merely a convenient coordinate transformation; it is a transformation into the system's **natural coordinate system**, where its complex, coupled behavior is revealed as a set of independent, fundamental modes of vibration. Any state `v` can be expressed in this basis:
`v = Σ c_iψ_i` where `c_i = ⟨ψ_i, v⟩`

The evolution of the system becomes trivially parallel:
`e^(Ht)v = Σ c_i * e^(E_it)ψ_i`

**2.3. From Discrete-Time Matrix to Continuous-Time Resonator**

The link between the abstract matrix formalism and digital signal processing is direct. The continuous-time evolution `e^(E_it)` for a complex eigenvalue `E_i = α_i + jω_i` corresponds to the impulse response `h_i(t)` of a second-order resonator:
`h_i(t) = e^(α_it) * cos(ω_it)`
*   The imaginary part `ω_i` maps to the **resonant frequency**.
*   The real part `α_i` maps to the **damping factor** (decay if `α < 0`, growth if `α > 0`).

Thus, the eigen-decomposition of `H` provides the complete parameter set for a bank of parallel resonators, forming the core of a modal synthesizer (Adrien, 1991).

**2.4. The Mapping from Formalism to Sound**
*   **Frequencies ↔ Eigenvalues (`E`):** The imaginary part of each eigenvalue defines a resonant frequency of the instrument.
*   **Timbre & Amplitude ↔ Eigenvectors (`ψ`):** The overall timbre is the sum of these pure modal outputs. The initial amplitude of each mode is determined by projecting an excitation signal onto the corresponding eigenvector.
*   **Stability ↔ Dominant Eigenvalue:** The long-term behavior of the instrument is governed by the modes associated with the eigenvalues whose real parts are closest to zero (for sustained sounds) or largest (for unstable systems) (Hirsch, Smale, & Devaney, 2013). This provides a formal basis for physically authentic settling and decay.

#### **3. Implementation Strategies: Exact vs. Heuristic**

**3.1. The "Exact" Method: Full Matrix Diagonalization**
The ideal process involves constructing the `H` matrix from physical parameters and using a numerical solver (e.g., QR algorithm) to find its complete eigensystem. This method offers high fidelity, capturing all emergent interactions and subtle dependencies. However, its computational cost (typically O(n³)) makes it challenging for real-time applications with a large number of states `n`.

**3.2. The "Heuristic" Method: A Real-Time Case Study in `eigensound`**
The `eigensound` web application prioritizes interactivity and thus employs a heuristic model that approximates the exact method.
*   **Approximation of Eigenvalues:** Instead of constructing and diagonalizing `H`, `eigensound` uses pre-computed analytical formulas for the eigenvalues of known physical geometries (e.g., `E_l ∝ sqrt(l(l+1))` for spherical harmonics) as a computationally cheap basis spectrum.
*   **Approximation of Parameter Effects:** Physical parameters are mapped to direct DSP operators. For example, `redshift` is implemented as a direct multiplicative scalar on the final frequencies, mimicking the primary physical effect without requiring a full re-calculation of a modified `H`. `EigenvectorCoupling` is modeled via a frame-to-frame energy-sharing algorithm between adjacent modal resonators.

**3.3. Comparison of Implementations**

| Feature | **Exact Method (Formal)** | **Heuristic Method (`eigensound` Impl.)** |
| :--- | :--- | :--- |
| **Eigenvalues** | Calculated via matrix diagonalization (`eigs(H)`). | Looked up from pre-defined formulas. |
| **Parameter Effect**| Modify terms in `H`, requiring re-calculation. | Applied as direct arithmetic modifiers to frequency/amplitude. |
| **Coupling** | Emerges from off-diagonal terms in `H`. | Explicitly programmed energy sharing between modes. |
| **Computation** | High (O(n³)), difficult for real-time. | Very low (O(n)), ideal for real-time web audio. |
| **Fidelity** | High; captures all emergent interactions. | Medium; captures primary effects but misses subtle interdependencies. |

#### **4. Eigen-Transformation as a Novel Audio Effect**

We propose "Eigen-Filtering," a novel audio processing paradigm based on this framework.

**4.1. Concept: Projection and Reconstruction in an Eigen-Basis**
The process is as follows:
1.  **Analysis:** Decompose an input audio frame into a spectral vector `v_in`.
2.  **Projection:** Project `v_in` onto the eigen-basis `{ψ_i}` of a chosen system `H` to find the modal coefficients `{c_i}`.
3.  **Transformation:** Apply a function to the coefficients, `c'_i = f(c_i, E_i)`.
4.  **Reconstruction:** Synthesize the output `v_out = Σ c'_iψ_i`.

It is crucial to distinguish this from conventional spectral filtering. An EQ applies an arbitrary gain curve. Eigen-Filtering applies a *physically derived, non-arbitrary* transfer function where gain and phase at all frequencies are intrinsically coupled by the structure of `H`, preserving the physical coherence of the chosen system.

**4.2. New Creative Possibilities**
*   **Physically-Modeled Filtering:** The effect imposes the resonant "DNA" of system `H` onto any input sound.
*   **Modal Quantization ("Eigen-Lock"):** By forcing the input signal's energy onto the nearest or most dominant eigenvectors of `H`, the effect can "crystallize" a noisy sound into a pure tone or "correct" a messy signal to its most stable resonant state.
*   **Formalized Cross-Synthesis:** The input audio provides the dynamic excitation (`c_i`), while the system `H` provides the resonant body (`ψ_i`), enabling the creation of novel hybrid sounds.

#### **5. Discussion: Scientific and Artistic Implications**

**5.1. A Taxonomy of Synthesis by Physicality**

Our work proposes a new category of synthesis defined by its abstract, systemic nature.

| Synthesis Method | Modelled System | Goal |
| :--- | :--- | :--- |
| **Digital Waveguides** | 1D wave equation (strings, tubes) | Acoustic Realism |
| **Mass-Spring Networks**| Newtonian mechanics (membranes, objects) | Acoustic/Haptic Realism |
| **Eigen-Synthesis (This Work)**| **Arbitrary Linear Systems** (QM, GR, Abstract) | **Systemic Authenticity** |

**Systemic Authenticity** means the sound is true to the internal dynamics and emergent properties of the *abstract model*, rather than mimicking an existing acoustic phenomenon.

**5.2. For the Scientist: A Tool for Auditory Insight**
This methodology makes abstract concepts tangible. A physicist can hear the lifting of eigenvalue degeneracy as a clear beating pattern, perceive a phase transition as a sudden timbral shift, or assess a model's stability by its tonal purity. It provides a holistic, intuitive channel for detecting anomalies and exploring high-dimensional parameter spaces.

**5.3. For the Artist: A New Vocabulary for Expression**
This framework enables a paradigm shift from composing with notes to composing with **System States**. A musical performance becomes a navigation through the model's parameter space. It introduces a new vocabulary of physically-motivated timbral controls (`Uncertainty`, `Coupling`, `Curvature`) that offer holistic, emergent sonic changes far beyond conventional synthesis parameters.

#### **6. Conclusion**

We have presented a formal framework for sound synthesis and processing grounded in the eigen-structure of linear systems. By treating abstract physical models as playable instruments, we bridge the gap between scientific modeling and artistic expression. The `eigensound` case study demonstrates the viability of this approach even with heuristic approximations, delivering novel sounds and intuitive control. Ultimately, we propose a shift from purely *physical modeling* to a more generalized **systemic modeling** in sound design. This opens a new frontier for creating sound that is not just inspired by physics, but is a direct, interactive manifestation of its fundamental laws.

Future work will focus on implementing performant real-time diagonalization using WebAssembly, applying the framework to other scientific domains such as network theory or computational biology, and designing novel interfaces to map human expression onto the abstract parameter space of these systemic instruments.

---

#### **7. References**

Adrien, J. M. (1991). The missing link: Modal synthesis. In G. De Poli, A. Piccialli, & C. Roads (Eds.), *Representations of Musical Signals* (pp. 269-298). MIT Press.

Collins, N. (2008). Errant sound synthesis. In *Proceedings of the International Computer Music Conference*.

Cook, P. R. (2002). *Real Sound Synthesis for Interactive Applications*. A K Peters.

Goldstein, H., Poole, C., & Safko, J. (2002). *Classical Mechanics* (3rd ed.). Addison-Wesley.

Hermann, T. (2002). *Sonification for Exploratory Data Analysis*. PhD thesis, Bielefeld University.

Hirsch, M. W., Smale, S., & Devaney, R. L. (2013). *Differential Equations, Dynamical Systems, and an Introduction to Chaos* (3rd ed.). Academic Press.

Horn, R. A., & Johnson, C. R. (2013). *Matrix Analysis* (2nd ed.). Cambridge University Press.

Kramer, G. (Ed.). (1994). *Auditory display: Sonification, audification, and auditory interfaces*. Addison-Wesley.

Smith, J. O. (1992). Physical modeling using digital waveguides. *Computer Music Journal, 16*(4), 74-91.

Strang, G. (2016). *Introduction to Linear Algebra* (5th ed.). Wellesley-Cambridge Press.