export const presets = {
    euclid_I_47: {
        key: 'euclid_I_47',
        name: "Euclid, Book I, Prop 47",
        colorPalette: {
            primary: '#FFD700', // Yellow for square on B
            secondary: '#3B82F6', // Blue for square on A
            tertiary: '#E23636', // Red for square on C (hypotenuse)
            accent: '#1F2937', // Black
            background: 'rgba(226, 54, 54, 0.05)'
        },
    },
    euclid_I_1: {
        key: 'euclid_I_1',
        name: "Euclid, Book I, Prop 1",
        colorPalette: {
            primary: '#FFD700', // Yellow
            secondary: '#E23636', // Red
            tertiary: '#3B82F6', // Blue
            accent: '#1F2937', // Black
            background: 'rgba(255, 215, 0, 0.05)'
        },
    },
    euclid_II_5: {
        key: 'euclid_II_5',
        name: "Euclid, Book II, Prop 5",
        colorPalette: {
            primary: '#3B82F6', // Blue
            secondary: '#FFD700', // Yellow
            tertiary: '#E23636', // Red
            accent: '#1F2937', // Black
            background: 'rgba(59, 130, 246, 0.05)'
        },
    },
    fibonacci_spiral: {
        key: 'fibonacci_spiral',
        name: "Fibonacci Spiral",
        colorPalette: {
            primary: '#E23636', // Red
            secondary: '#FFD700', // Yellow
            tertiary: '#3B82F6', // Blue
            accent: '#1F2937', // Black
            background: 'rgba(255, 215, 0, 0.05)'
        }
    },
    fibonacci_circles: {
        key: 'fibonacci_circles',
        name: "Fibonacci Circles",
        colorPalette: {
            primary: '#10B981', // Emerald
            secondary: '#EC4899', // Pink
            tertiary: '#8B5CF6', // Violet
            accent: '#1F2937', // Black
            background: 'rgba(16, 185, 129, 0.05)'
        }
    },
    golden_ratio_from_square: {
        key: 'golden_ratio_from_square',
        name: "Golden Ratio (from Square)",
        colorPalette: {
            primary: '#FFD700', // Yellow
            secondary: '#3B82F6', // Blue
            tertiary: '#E23636', // Red
            accent: '#1F2937', // Black
            background: 'rgba(251, 191, 36, 0.05)'
        },
    },
    circle_ratios: {
        key: 'circle_ratios',
        name: "Circle Ratios",
        colorPalette: {
            primary: '#E23636', // Red
            secondary: '#3B82F6', // Blue
            tertiary: '#FFD700', // Yellow
            accent: '#1F2937', // Black
            background: 'rgba(255, 215, 0, 0.05)'
        },
    },
    thales_theorem: {
        key: 'thales_theorem',
        name: "Thales's Theorem",
        colorPalette: {
            primary: '#3B82F6', // Blue
            secondary: '#E23636', // Red
            tertiary: '#FFD700', // Yellow
            accent: '#1F2937', // Black
            background: 'rgba(59, 130, 246, 0.05)'
        },
    },
     euclid_I_5: {
        key: 'euclid_I_5',
        name: "Euclid, Book I, Prop 5",
        colorPalette: {
            primary: '#3B82F6', // Blue
            secondary: '#E23636', // Red
            tertiary: '#FFD700', // Yellow
            accent: '#1F2937', // Black
            background: 'rgba(226, 54, 54, 0.05)'
        },
    },
    silver_ratio: {
        key: 'silver_ratio',
        name: "Silver Ratio (δ)",
        colorPalette: {
            primary: '#C0C0C0', // Silver
            secondary: '#6EE7B7', // Emerald-300 (kept for variety)
            tertiary: '#7DD3FC', // Sky-300 (kept for variety)
            accent: '#1F2937', // Black
            background: 'rgba(192, 192, 192, 0.05)'
        }
    },
    eye_of_horus: {
        key: 'eye_of_horus',
        name: "Eye of Horus Fractions",
        colorPalette: {
            primary: '#FFD700', // Gold
            secondary: '#3B82F6', // Blue
            tertiary: '#E23636', // Red
            accent: '#1F2937', // Black
            background: 'rgba(59, 130, 246, 0.05)'
        }
    },
    flower_of_life: {
        key: 'flower_of_life',
        name: "Flower of Life",
        colorPalette: {
            primary: '#DB2777', // Pink-600 (Kept for variety)
            secondary: '#9333EA', // Purple-600 (Kept for variety)
            tertiary: '#2563EB', // Blue-600
            accent: '#1F2937', // Black
            background: 'rgba(147, 51, 234, 0.05)'
        }
    },
    lituus_spiral: {
        key: 'lituus_spiral',
        name: "Lituus Spiral",
        colorPalette: {
            primary: '#10B981', // Emerald-500 (Kept for variety)
            secondary: '#3B82F6', // Blue-500
            tertiary: '#EC4899', // Pink-500
            accent: '#1F2937', // Black
            background: 'rgba(16, 185, 129, 0.05)'
        }
    }
} as const;

export type PresetKey = keyof typeof presets;