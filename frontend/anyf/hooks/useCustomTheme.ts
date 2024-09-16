import { useTheme as useNavigationTheme } from '@react-navigation/native';
import { ExtendedTheme } from '../constants/theme';

export function useCustomTheme() {
  return useNavigationTheme() as ExtendedTheme;
}