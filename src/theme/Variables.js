/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  secondary: '#EC890C',
  white: '#ffffff',
  black: '#000',
  text: '#212529',
  primary: '#068D9D',
  success: '#95F9E3',
  warning: '#D4B483',
  error: '#C1666B',
  linkText: '#0645AD',
  shadow: '#5d6564',
  darkGray: '#555555',
  tertiary: '#EF7C0B',
  gray: '#707070',
  lightGray: '#0000001F',
  darkBrown: '#383838',
  semiTransparent: '#c2bebe',
  fourtyPercentSecondary: '#eba959',
  fourtyPercentBlack: '#363330',
  muted: '#8c92a2',
  bannerBackground: '#787a7a',
};

export const NavigationColors = {
  primary: Colors.primary,
};

/**
 * FontSize
 */
export const FontSize = {
  small: 12,
  regular: 14,
  large: 18,
};

export const FontFamily = {
  // primary: 'system font',
  // secondary: 'system font',
};

/**
 * Metrics Sizes
 */
const tiny = 5; // 10
const small = tiny * 2; // 10
const regular = tiny * 3; // 15
const large = regular * 2; // 30
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
};
