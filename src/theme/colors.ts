
const BASE = {
  primary: '#8C3F1B',   // brown — buttons, primary actions, brand
  secondary: '#4A6B41', // green — success / secondary actions
  tertiary: '#D4A373',  // tan/gold — XP, highlights, progress fill
  neutral: '#F9F6F0',   // cream — backgrounds
} as const;



export const colors = {
  primary: {
    50: '#FBF1EC',
    100: '#F1D8C9',
    200: '#E4B69A',
    300: '#D2926B',
    400: '#B0653A',
    500: BASE.primary,
    600: '#7A3517',
    700: '#642B12',
    800: '#4E210E',
    900: '#38170A',
  },
  secondary: {
    50: '#EEF3EC',
    100: '#CFDECA',
    200: '#AAC6A1',
    300: '#82AC75',
    400: '#628D53',
    500: BASE.secondary,
    600: '#3E5936',
    700: '#32472B',
    800: '#263521',
    900: '#1A2416',
  },
  tertiary: {
    50: '#FBF5EE',
    100: '#F3E2CB',
    200: '#EACDA5',
    300: '#E0B87E',
    400: '#DAAD90',
    500: BASE.tertiary, // #D4A373 — base
    600: '#B9884F',
    700: '#946C3F',
    800: '#6F512F',
    900: '#4A361F',
  },
  neutral: {
    50: '#FFFFFF',
    100: BASE.neutral,
    200: '#EDE7DB',
    300: '#DCD3C0',
    400: '#B8AC94',
    500: '#8F8368',
    600: '#6B604A',
    700: '#4A4132',
    800: '#2E271C',
    900: '#18140E',
  },


  background: BASE.neutral,      // screen background
  surface: '#FFFFFF',            // cards / elevated surfaces
  textPrimary: '#2E271C',        // neutral.800
  textSecondary: '#6B604A',      // neutral.600
  border: '#DCD3C0',             // neutral.300

  brand: BASE.primary,           // splash bg, primary CTA
  accent: BASE.tertiary,         // XP badge, progress fill, highlights

  success: BASE.secondary,       // correct-answer state
  successBg: '#EEF3EC',          // correct-answer card background
  error: '#B3261E',              // incorrect-answer state (not in Stitch export — standard error red, adjust if Stitch defines one)
  errorBg: '#FBEAE9',            // incorrect-answer card background

  disabled: '#B8AC94',           // neutral.400 — disabled buttons/Continue
} as const;

export type ColorToken = keyof typeof colors;

