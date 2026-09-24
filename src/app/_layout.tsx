// app/_layout.tsx
//
// Root layout — this is the Expo Router equivalent of Next.js's
// root layout.tsx. Every screen in app/ renders inside whatever
// this returns.
//
// Stripped down from the starter template: no tab bar, no theme
// provider boilerplate, no demo navigation — just a plain Stack
// since this app is a flat, linear 3-screen flow.

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
} from '@expo-google-fonts/inter';
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';
import { colors } from '@/theme/colors';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    BricolageGrotesque_700Bold,
  });

  // Block rendering until fonts are ready — avoids a flash of
  // system-default font before the custom typefaces swap in.
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // custom screens handle their own headers/back UI
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="language-select" />
      <Stack.Screen name="lesson" />
    </Stack>
  );
}