import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  dustypink: '#DFA3B2',
  Lightolivegreen: '#B8C4A5',
  Warmbeigebackground: '#F3E7DD',
  white: '#fff',
  background: '#FBFBFB',
  textMain: '#333',
  textSecondary: '#777',
  danger: '#E57373',
};

export const fonts = {
  regular: 'Poppins_400Regular',
  semiBold: 'Poppins_600SemiBold',
};

export const perfilStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

heroSection: {
  marginBottom: 24,
  backgroundColor: colors.Warmbeigebackground,
  paddingTop: 45,
  paddingHorizontal: 24,
  paddingBottom: 30,
  borderBottomLeftRadius: 36,
  borderBottomRightRadius: 36,
  overflow: 'hidden',
},

heroBlob: {
  position: 'absolute',
  width: 220,
  height: 200,
  borderRadius: 140,
  backgroundColor: 'rgba(223,163,178,0.16)',
  top: -90,
  right: -60,
},

heroTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

heroGreeting: {
  fontSize: 20,
  color: '#7D7D7D',
  fontFamily: fonts.regular,
},
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: '#EEE',
  },

  editIconButton: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    backgroundColor: colors.dustypink,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    elevation: 4,
  },

  userName: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
    color: colors.textMain,
  },

  roleText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.Lightolivegreen,
    textTransform: 'uppercase',
  },
  // Info Cards
  sectionCard: {
    backgroundColor: colors.white,
    width: width - 32,
    borderRadius: 20,
    padding: 20,
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  infoLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },

  infoValue: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textMain,
  },
  // Buttons
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 15,
    width: width - 32,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  
  logoutText: {
    fontFamily: fonts.semiBold,
    color: colors.danger,
    marginLeft: 10,
    fontSize: 16,
  },

  editContainer: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    padding: 20,
  },

  editTitle: {
    fontSize: 26,
    fontFamily: fonts.semiBold,
    color: colors.Lightolivegreen,
    marginBottom: 25,
  },

  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: fonts.regular,
  },

  cancelButton: {
    marginTop: 18,
    alignItems: 'center',
  },

  cancelText: {
    color: '#888',
    fontFamily: fonts.regular,
  },

  editScrollContainer: {
  paddingHorizontal: 20,
  paddingBottom: 100,
},

editAvatarWrapper: {
  alignSelf: 'center',
  position: 'relative',
  marginBottom: 10,
},

editAvatar: {
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: '#EEE',
},

changePhotoText: {
  textAlign: 'center',
  color: colors.Lightolivegreen,
  marginBottom: 25,
  fontFamily: fonts.semiBold,
},

inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',

  backgroundColor: '#F8F8F8',

  borderRadius: 15,

  paddingHorizontal: 15,

  marginBottom: 15,
},

input: {
  flex: 1,
  height: 55,
  marginLeft: 12,
  fontFamily: fonts.regular,
},

saveButton: {
  backgroundColor: colors.Lightolivegreen,

  marginTop: 20,
  padding: 18,

  borderRadius: 15,

  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},

saveButtonText: {
  color: colors.white,
  marginLeft: 10,
  fontSize: 16,
  fontFamily: fonts.semiBold,
},

cameraButton: {
  position: 'absolute',
  right: 0,
  bottom: 5,
  backgroundColor: colors.Lightolivegreen,

  width: 34,
  height: 34,

  borderRadius: 17,

  justifyContent: 'center',
  alignItems: 'center',

  borderWidth: 3,
  borderColor: colors.white,
},

editPageTitle: {
  textAlign: 'center',
  fontSize: 24,
  fontFamily: fonts.semiBold,
  color: colors.textMain,
  marginVertical: 20,
},

scrollContainer: {
  alignItems: 'center',
  paddingBottom: 100,
  paddingTop: 60,
},

avatarWrapper: {
  position: 'relative',
  marginBottom: 15,
  alignSelf: 'center',
},

roleBadge: {
  backgroundColor: '#F0F4EF',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 20,
  marginTop: 5,
  alignSelf: 'center',
},
});