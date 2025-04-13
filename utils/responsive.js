import { Dimensions, PixelRatio } from 'react-native';

// Get device screen height
const { height } = Dimensions.get('window');

// Set a base guideline height (you can adjust this if you like)
const guidelineBaseHeight = 680;

/**
 * Returns a scaled font size based on device height
 * @param {number} size — your base font size (e.g. 16)
 */
export const responsiveSize = (size) => {
  const scale = height / guidelineBaseHeight;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
