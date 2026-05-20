import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type { ReactNode } from 'react';

import OrganicBackground from '../components/OrganicBackground';

import {
  colors,
  fonts,
} from '../styles/authStyles';

type Props = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export default function AuthLayout({
  children,
  title,
  subtitle,
}: Props) {

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >

      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.Warmbeigebackground}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <OrganicBackground />

        <View style={styles.topSection}>

          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.subtitle}>
            {subtitle}
          </Text>

        </View>

        <View style={styles.curve} />

        <View
          style={[
            styles.bottomSection,
            {
              paddingBottom: insets.bottom + 18,
            },
          ]}
        >
          {children}
        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Warmbeigebackground,
  },

  topSection: {
    flex: 0.95,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 30,
    paddingTop: 10,
  },

  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 28,
    color: '#4E5B48',
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    textAlign: 'center',
    color: '#4E5B48',
    fontFamily: fonts.regular,
  },

  curve: {
    height: 45,
    backgroundColor: 'white',

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  bottomSection: {
    flex: 1,

    backgroundColor: 'white',

    paddingHorizontal: 28,
    paddingTop: 8,
  },
  safeArea: {
  flex: 1,
  backgroundColor: 'white',
},
});