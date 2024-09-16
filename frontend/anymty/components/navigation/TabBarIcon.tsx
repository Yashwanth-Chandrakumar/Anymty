// src/components/navigation/TabBarIcon.tsx
import { useThemeColor } from '@/hooks/useThemeColor';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type ComponentProps } from 'react';

export function TabBarIcon({ name, color }: { name: ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}

export function ChatIcon(props: Partial<IconProps<ComponentProps<typeof Ionicons>['name']>>) {
  const tintColor = useThemeColor({}, 'tint') as string;
  return <TabBarIcon name="chatbubble-outline" color={props.color || tintColor} />;
}

export function SettingsIcon(props: Partial<IconProps<ComponentProps<typeof Ionicons>['name']>>) {
  const tintColor = useThemeColor({}, 'tint') as string;
  return <TabBarIcon name="settings-outline" color={props.color || tintColor} />;
}
