// app/index.tsx
//
// Splash / Welcome screen — the "/" route.
// This is a bare-bones stub to confirm navigation works end-to-end
// before any real styling/components are built (Story 0a in PLANNING.md).

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome </Text>
      <Text style={styles.title}>To </Text>
      <Text style={styles.title}> Lingua Roots</Text>
      <Text style={styles.tagline}>Learn the languages of a continent</Text>

      <Pressable
        style={styles.cta}
        onPress={() => router.push('/language-select')}
      >
        <Text style={styles.ctaText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 32,
    color: colors.neutral[50],
    marginBottom: 1,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.neutral[100],
    marginTop: 10,
    marginBottom: 40,
    textAlign: 'center',
  },
  cta: {
    backgroundColor: colors.tertiary[500],
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  ctaText: {
    fontFamily: fonts.label,
    fontSize: 16,
    color: colors.primary[800],
  },
});