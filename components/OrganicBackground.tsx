import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/authStyles';

export default function OrganicBackground() {
  return (
    <>
      {/* PETALA 1 */}
      <View style={styles.petala1} />

      {/* PETALA 2 */}
      <View style={styles.petala2} />

      {/* FOLHA */}
      <View style={styles.folha} />

      {/* CIRCULO SUAVE */}
      <View style={styles.circle} />
    </>
  );
}

const styles = StyleSheet.create({
  petala1: {
    position: 'absolute',
    width: 260,
    height: 260,
    backgroundColor: 'rgba(223,163,178,0.22)',
    borderRadius: 140,

    top: -120,
    left: -40,

    transform: [{ rotate: '25deg' }],
  },

  petala2: {
    position: 'absolute',
    width: 220,
    height: 220,
    backgroundColor: 'rgba(223,163,178,0.16)',
    borderRadius: 120,

    top: 60,
    right: -90,

    transform: [{ rotate: '-20deg' }],
  },

  folha: {
    position: 'absolute',
    width: 180,
    height: 180,
    backgroundColor: 'rgba(184,196,165,0.18)',

    borderTopLeftRadius: 120,
    borderBottomRightRadius: 120,

    bottom: 180,
    left: -50,

    transform: [{ rotate: '15deg' }],
  },

  circle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.35)',

    bottom: 120,
    right: -30,
  },
});