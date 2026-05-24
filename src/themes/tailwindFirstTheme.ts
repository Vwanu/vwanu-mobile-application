import * as eva from '@eva-design/eva'
import tailwindConfig from '../../tailwind.config'

// Extract Tailwind colors from the config
const tailwindColors = tailwindConfig.theme?.extend?.colors

/**
 * Tailwind-First Theme Generator
 * Uses Tailwind colors as the single source of truth for all UI theming
 */

// Light theme backgrounds - use lighter Tailwind colors
const lightBackgrounds = {
  'background-basic-color-1':
    (tailwindColors as any)['color-basic-100'] || '#FFFFFF', // Main background
  'background-basic-color-2':
    (tailwindColors as any)['color-basic-200'] || '#F8FAFF', // Card background
  'background-basic-color-3':
    (tailwindColors as any)['color-basic-300'] || '#F5F8FF', // Elevated surface
  'background-basic-color-4':
    (tailwindColors as any)['color-basic-400'] || '#F3F6FF', // Floating elements
}

// Dark theme backgrounds - create dark versions or use darker Tailwind colors
const darkBackgrounds = {
  'background-basic-color-1':
    (tailwindColors as any)['color-primary-900'] || '#001060', // Darkest primary for main background
  'background-basic-color-2':
    (tailwindColors as any)['color-primary-800'] || '#011874', // Dark primary for elevated surface
  'background-basic-color-3':
    (tailwindColors as any)['color-primary-700'] || '#022290', // Medium dark primary for higher elevation
  'background-basic-color-4':
    (tailwindColors as any)['color-primary-600'] || '#032FAC', // Lighter dark primary for floating elements
}

// Text colors mapping
const lightTextColors = {
  'text-basic-color': (tailwindColors as any)['text-basic-color'] || '#000000',
  'text-alternate-color': '#FFFFFF',
  'text-control-color': '#000000',
  'text-disabled-color':
    (tailwindColors as any)['color-basic-600'] || '#AEB8DB',
  'text-hint-color': (tailwindColors as any)['color-basic-700'] || '#7884B7',
}

const darkTextColors = {
  'text-basic-color': '#FFFFFF',
  'text-alternate-color': '#000000',
  'text-control-color': '#FFFFFF',
  'text-disabled-color': '#666666',
  'text-hint-color': '#999999',
}

// Border colors mapping
const lightBorderColors = {
  'border-basic-color-1':
    (tailwindColors as any)['color-basic-300'] || '#F5F8FF',
  'border-basic-color-2':
    (tailwindColors as any)['color-basic-400'] || '#F3F6FF',
  'border-basic-color-3':
    (tailwindColors as any)['color-basic-500'] || '#EFF3FF',
  'border-basic-color-4':
    (tailwindColors as any)['color-basic-600'] || '#AEB8DB',
  'border-basic-color-5':
    (tailwindColors as any)['color-basic-700'] || '#7884B7',
}

const darkBorderColors = {
  'border-basic-color-1': '#2D2D2D',
  'border-basic-color-2': '#404040',
  'border-basic-color-3': '#525252',
  'border-basic-color-4': '#666666',
  'border-basic-color-5': '#808080',
}

// Direct mapping of Tailwind color tokens to UI Kitten (these are already compatible!)
const directColorMapping = {
  // Primary colors
  'color-primary-100': (tailwindColors as any)['color-primary-100'],
  'color-primary-200': (tailwindColors as any)['color-primary-200'],
  'color-primary-300': (tailwindColors as any)['color-primary-300'],
  'color-primary-400': (tailwindColors as any)['color-primary-400'],
  'color-primary-500': (tailwindColors as any)['color-primary-500'],
  'color-primary-600': (tailwindColors as any)['color-primary-600'],
  'color-primary-700': (tailwindColors as any)['color-primary-700'],
  'color-primary-800': (tailwindColors as any)['color-primary-800'],
  'color-primary-900': (tailwindColors as any)['color-primary-900'],

  // Success colors
  'color-success-100': (tailwindColors as any)['color-success-100'],
  'color-success-200': (tailwindColors as any)['color-success-200'],
  'color-success-300': (tailwindColors as any)['color-success-300'],
  'color-success-400': (tailwindColors as any)['color-success-400'],
  'color-success-500': (tailwindColors as any)['color-success-500'],
  'color-success-600': (tailwindColors as any)['color-success-600'],
  'color-success-700': (tailwindColors as any)['color-success-700'],
  'color-success-800': (tailwindColors as any)['color-success-800'],
  'color-success-900': (tailwindColors as any)['color-success-900'],

  // Info colors
  'color-info-100': (tailwindColors as any)['color-info-100'],
  'color-info-200': (tailwindColors as any)['color-info-200'],
  'color-info-300': (tailwindColors as any)['color-info-300'],
  'color-info-400': (tailwindColors as any)['color-info-400'],
  'color-info-500': (tailwindColors as any)['color-info-500'],
  'color-info-600': (tailwindColors as any)['color-info-600'],
  'color-info-700': (tailwindColors as any)['color-info-700'],
  'color-info-800': (tailwindColors as any)['color-info-800'],
  'color-info-900': (tailwindColors as any)['color-info-900'],

  // Warning colors
  'color-warning-100': (tailwindColors as any)['color-warning-100'],
  'color-warning-200': (tailwindColors as any)['color-warning-200'],
  'color-warning-300': (tailwindColors as any)['color-warning-300'],
  'color-warning-400': (tailwindColors as any)['color-warning-400'],
  'color-warning-500': (tailwindColors as any)['color-warning-500'],
  'color-warning-600': (tailwindColors as any)['color-warning-600'],
  'color-warning-700': (tailwindColors as any)['color-warning-700'],
  'color-warning-800': (tailwindColors as any)['color-warning-800'],
  'color-warning-900': (tailwindColors as any)['color-warning-900'],

  // Danger colors
  'color-danger-100': (tailwindColors as any)['color-danger-100'],
  'color-danger-200': (tailwindColors as any)['color-danger-200'],
  'color-danger-300': (tailwindColors as any)['color-danger-300'],
  'color-danger-400': (tailwindColors as any)['color-danger-400'],
  'color-danger-500': (tailwindColors as any)['color-danger-500'],
  'color-danger-600': (tailwindColors as any)['color-danger-600'],
  'color-danger-700': (tailwindColors as any)['color-danger-700'],
  'color-danger-800': (tailwindColors as any)['color-danger-800'],
  'color-danger-900': (tailwindColors as any)['color-danger-900'],

  // Basic colors
  'color-basic-100': (tailwindColors as any)['color-basic-100'],
  'color-basic-200': (tailwindColors as any)['color-basic-200'],
  'color-basic-300': (tailwindColors as any)['color-basic-300'],
  'color-basic-400': (tailwindColors as any)['color-basic-400'],
  'color-basic-500': (tailwindColors as any)['color-basic-500'],
  'color-basic-600': (tailwindColors as any)['color-basic-600'],
  'color-basic-700': (tailwindColors as any)['color-basic-700'],
  'color-basic-800': (tailwindColors as any)['color-basic-800'],
  'color-basic-900': (tailwindColors as any)['color-basic-900'],

  // Basic transparent colors
  'color-basic-transparent-100': (tailwindColors as any)[
    'color-basic-transparent-100'
  ],
  'color-basic-transparent-200': (tailwindColors as any)[
    'color-basic-transparent-200'
  ],
  'color-basic-transparent-300': (tailwindColors as any)[
    'color-basic-transparent-300'
  ],
  'color-basic-transparent-400': (tailwindColors as any)[
    'color-basic-transparent-400'
  ],
  'color-basic-transparent-500': (tailwindColors as any)[
    'color-basic-transparent-500'
  ],
  'color-basic-transparent-600': (tailwindColors as any)[
    'color-basic-transparent-600'
  ],

  // Warm surface + redesign tokens (referenced by mapping.json extensions)
  'warm-bg': (tailwindColors as any)['warm-bg'],
  'warm-surface': (tailwindColors as any)['warm-surface'],
  'warm-border': (tailwindColors as any)['warm-border'],
  'warm-border-strong': (tailwindColors as any)['warm-border-strong'],
  'warm-dim': (tailwindColors as any)['warm-dim'],
  ink: (tailwindColors as any)['ink'],
  soft: (tailwindColors as any)['soft'],
  mute: (tailwindColors as any)['mute'],
  'primary-deep': (tailwindColors as any)['primary-deep'],
  'primary-deep-2': (tailwindColors as any)['primary-deep-2'],
  'primary-soft': (tailwindColors as any)['primary-soft'],
  coral: (tailwindColors as any)['coral'],
  amber: (tailwindColors as any)['amber'],
  'amber-deep': (tailwindColors as any)['amber-deep'],
  'amber-soft': (tailwindColors as any)['amber-soft'],
}

/**
 * Generate UI Kitten theme from Tailwind colors
 * @param isDarkMode - Whether to generate dark theme
 * @returns Complete UI Kitten theme object
 */
export const createTailwindFirstTheme = (isDarkMode: boolean) => {
  const baseTheme = isDarkMode ? eva.dark : eva.light
  const backgrounds = isDarkMode ? darkBackgrounds : lightBackgrounds
  const textColors = isDarkMode ? darkTextColors : lightTextColors
  const borderColors = isDarkMode ? darkBorderColors : lightBorderColors

  return {
    ...baseTheme,

    // Apply Tailwind-based colors
    ...backgrounds,
    ...textColors,
    ...borderColors,
    ...directColorMapping,
  }
}

/**
 * Get specific Tailwind color for use in components
 * @param colorName - Tailwind color name (e.g., 'primary', 'color-primary-500')
 * @returns Color value
 */
export const getTailwindColor = (colorName: string): string => {
  return (tailwindColors as any)[colorName] || '#000000'
}

/**
 * Get semantic colors based on Tailwind palette
 * @param isDarkMode - Whether dark mode is active
 * @returns Semantic color object
 */
export const getTailwindSemanticColors = (isDarkMode: boolean) => {
  return {
    // Brand colors from Tailwind
    brand: {
      primary: getTailwindColor('primary'),
      secondary: getTailwindColor('secondary'),
      accent: getTailwindColor('accent'),
    },

    // Status colors from Tailwind
    status: {
      success: getTailwindColor('success'),
      warning: getTailwindColor('warning'),
      danger: getTailwindColor('danger'),
      info: getTailwindColor('info'),
    },

    // Background colors
    background: {
      primary: isDarkMode ? '#121212' : getTailwindColor('color-basic-100'),
      secondary: isDarkMode ? '#1E1E1E' : getTailwindColor('color-basic-200'),
      tertiary: isDarkMode ? '#2D2D2D' : getTailwindColor('color-basic-300'),
    },

    // Text colors
    text: {
      primary: isDarkMode ? '#FFFFFF' : getTailwindColor('text-basic-color'),
      secondary: isDarkMode ? '#999999' : getTailwindColor('color-basic-700'),
      disabled: isDarkMode ? '#666666' : getTailwindColor('color-basic-600'),
    },

    // Border colors
    border: {
      subtle: isDarkMode ? '#2D2D2D' : getTailwindColor('color-basic-300'),
      default: isDarkMode ? '#404040' : getTailwindColor('color-basic-400'),
      prominent: isDarkMode ? '#525252' : getTailwindColor('color-basic-500'),
    },
  }
}

// Export Tailwind colors for easy access
export { tailwindColors }
