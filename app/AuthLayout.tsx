import { View, ImageBackground, StyleSheet } from 'react-native';

export default function AuthLayout({ children }) {
  return (
    <ImageBackground 
      source={require('../assets/images/background_loginRegister.png')} 
      style={styles.background}
      blurRadius={2}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    // resizeMode: 'contain',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#89c4893d', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  }
});
