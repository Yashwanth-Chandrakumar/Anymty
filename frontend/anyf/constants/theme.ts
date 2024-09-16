import { DefaultTheme, DarkTheme as NavigationDarkTheme, Theme } from '@react-navigation/native';

export type ExtendedTheme = Theme & {
  colors: Theme['colors'] & {
    secondary: string;
  };
};

export const LightTheme: ExtendedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FC8019',
    secondary: '#60b246',
    background: '#FFFFFF',
    card: '#F8F8F8',
    text: '#282C3F',
    border: '#D4D5D9',
    notification: '#FF5722',
  },
};

export const DarkTheme: ExtendedTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: '#FC8019',
    secondary: '#60b246',
    background: '#1C1C1C',
    card: '#2D2D2D',
    text: '#FFFFFF',
    border: '#3D3D3D',
    notification: '#FF5722',
  },
};