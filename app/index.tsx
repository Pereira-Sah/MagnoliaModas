import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import { router } from 'expo-router';

import OrganicBackground from '../components/OrganicBackground';

import {
  colors,
  fonts,
} from '../styles/authStyles';

export default function Home() {
  return (
    <View style={styles.container}>

      <OrganicBackground />

      <View style={styles.topSection}>

        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />

        {/* <Text style={styles.title}>
          Magnolia Modas
        </Text> */}

        <Text style={styles.subtitle}>
          Elegância que floresce em você
        </Text>

      </View>

      <View style={styles.curve} />

      <View style={styles.bottomSection}>

        <Text style={styles.description}>
          Descubra peças modernas,
          sofisticadas e feitas para
          valorizar sua essência.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={styles.secondaryButtonText}>
            Criar Conta
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Warmbeigebackground,
  },

  topSection: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // title: {
  //   fontSize: 38,
  //   color: '#4E5B48',
  //   fontFamily: fonts.semiBold,
  //   marginTop: -10,
  // },

  subtitle: {
    marginTop: -108,
    fontSize: 16,
    color: '#7a7a7a7e',
    fontFamily: fonts.regular,
  },

  curve: {
    height: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 5,
  },

  bottomSection: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingTop: 20,
  },

  description: {
    textAlign: 'center',
    lineHeight: 24,
    color: colors.dustypink,
    fontSize: 14,

    marginBottom: 30,
    fontFamily: fonts.regular,
  },

  primaryButton: {
    backgroundColor: colors.Lightolivegreen,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },

  secondaryButton: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: colors.dustypink,
    height: 58,
    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: colors.dustypink,
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
});