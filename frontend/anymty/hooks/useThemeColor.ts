import { Colors } from '../constants/Colors';
import { useTheme } from './useTheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { darkMode } = useTheme();
  const colorFromProps = props[darkMode ? 'dark' : 'light'];

  return colorFromProps ?? Colors[darkMode ? 'dark' : 'light'][colorName];
}
