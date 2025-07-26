import { PresetKey } from "./constants";

export const descriptions: Record<PresetKey, string> = {
    euclid_I_47: `Also known as the Pythagorean Theorem, this fundamental proposition of Euclidean geometry states that for any right-angled triangle, the area of the square whose side is the hypotenuse (the side opposite the right angle) is equal to the sum of the areas of the squares on the other two sides. 
    
a² + b² = c²`,

    euclid_I_1: `The very first proposition in Euclid's "Elements." It provides a method to construct an equilateral triangle (a triangle with all three sides of equal length) starting with only a single finite straight line segment. 
    
This simple construction is a cornerstone, demonstrating the power of using only a compass and straightedge to create perfect geometric forms.`,

    euclid_II_5: `This is a principle of geometric algebra. It states that if a line segment is divided into two equal parts and also into two unequal parts, the area of the rectangle formed by the two unequal segments, plus the area of the square on the line between the points of division, is equal to the area of the square on half the original line.
    
In algebraic terms: (a+b)(a-b) + b² = a²`,

    circle_ratios: `This preset explores the relationships between a circle's core properties. 
    
- Radius (r): The distance from the center to the edge.
- Circumference (C): The distance around the circle, calculated as 2πr.
- Area (A): The space inside the circle, calculated as πr².

Notice how both circumference and area are directly proportional to the radius, but in different ways (linearly vs. quadratically).`,

    euclid_I_5: `Known as "Pons Asinorum" (Latin for "bridge of asses"), this proposition states that the angles at the base of an isosceles triangle (a triangle with two sides of equal length) are themselves equal.
    
It was supposedly named the "bridge of asses" because it was the first real test for students of geometry—one that fools might not be able to cross.`,

    thales_theorem: `Thales's Theorem states that if you take any three distinct points A, B, and C on a circle where the line AC is a diameter of the circle, then the angle formed at point B (∠ABC) is always a right angle (90°).
    
Move the point along the circle's edge and observe how the angle at that point remains constant.`,

    fibonacci_spiral: `An approximation of the Golden Spiral, built from quarter-circles inscribed in squares whose side lengths follow the Fibonacci sequence (1, 1, 2, 3, 5...).
    
This iconic shape appears in nature, from nautilus shells to the arrangement of seeds in a sunflower, representing a fundamental pattern of growth.`,

    fibonacci_circles: `This preset visualizes the Fibonacci sequence (1, 1, 2, 3, 5, 8...) in a different way. A series of circles are drawn tangent to one another along a line, with the radius of each circle corresponding to a number in the sequence.

This construction provides a linear, additive view of the sequence's growth, contrasting with the geometric, area-based growth seen in the Fibonacci Spiral.`,

    golden_ratio_from_square: `The Golden Ratio (φ ≈ 1.618) is an irrational number found in art, architecture, and nature. This is a classic geometric construction of the ratio starting from a simple square.
    
The ratio is derived such that (a+b)/a = a/b = φ, a property believed to be uniquely pleasing to the human eye.`,

    silver_ratio: `While less famous than its golden counterpart, the Silver Ratio (δ) is another "metallic mean" with fascinating properties. It is an irrational number approximately equal to 2.414.
    
It is mathematically connected to the octagon and can be expressed as 1 + √2. This construction demonstrates one way to derive it geometrically.`,

    eye_of_horus: `This is an ancient Egyptian symbol of protection, royal power, and good health. The parts of the eye were also used as a mathematical system for representing fractions.
    
Each distinct part of the eye symbol represented a fraction, with the sum of all parts being 63/64. The fractions were 1/2, 1/4, 1/8, 1/16, 1/32, and 1/64.`,

    flower_of_life: `A figure from sacred geometry composed of multiple evenly spaced, overlapping circles arranged to form a flower-like pattern with six-fold symmetry.
    
This powerful and ancient symbol is believed to contain the patterns of creation and the fundamental forms of space and time. By increasing the steps, you can see how the pattern grows from a single circle into a complex and beautiful form.`,

    lituus_spiral: `A spiral in which the angle (θ) is inversely proportional to the square of the radius (r). Its formula is r² = a²/θ.
    
Unlike the Archimedean or logarithmic spirals, the Lituus spiral approaches the origin but never reaches it, winding infinitely around it. Its name comes from the Latin "lituus," a curved Roman war trumpet.`,
};
