import { StyleSheet } from 'react-native';

export const colors = {
  dustypink: '#DFA3B2',
  Lightolivegreen: '#B8C4A5',
  Warmbeigebackground: '#F3E7DD',
};

export const fonts = {
  regular: 'Poppins_400Regular',
  semiBold: 'Poppins_600SemiBold',
};

export const authStyles = StyleSheet.create({

formContainer: {
  gap: 14,
  width: '100%',
  marginTop: -4,
},

  inputContainer: {
    backgroundColor: '#F8F6F4',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(184,196,165,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 38,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: fonts.regular,
    color: '#444',
  },

button: {
  backgroundColor: colors.Lightolivegreen,
  height: 54,
  borderRadius: 18,

  justifyContent: 'center',
  alignItems: 'center',

  marginTop: 4,
},

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },

  link: {
    textAlign: 'center',
    marginTop: 14,
    color: colors.dustypink,
    fontFamily: fonts.regular,
  },

  description:{
    textAlign: 'center',
    lineHeight: 24,
    color: colors.dustypink,
    fontSize: 14,
    fontFamily: fonts.regular,

  },
});