import { StyleSheet } from 'react-native';

export const colors = {
  green: '#89c489',
  pink: '#e6aeac',
  white: '#fff',
};

export const authStyles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.81)', 
    borderRadius: 16,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    width: '50%',
    height: 80,
    marginBottom: 16,
    borderRadius:100,
    // resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.green,
    marginBottom: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.pink,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  button: {
    backgroundColor: colors.green,
    padding: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
  },
  link: {
    color: colors.pink,
    marginTop: 8,
  }
});
