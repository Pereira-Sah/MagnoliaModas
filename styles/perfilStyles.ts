import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  green: '#60875b',
  pink: '#e5aeab',
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

    logoWrapper: {
      backgroundColor: colors.green, 
      width: width,
      height: 120, 
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20, 
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
          position: 'absolute',

  
    },
  
    logo: {
      width: '40%',
      height: 100,
      resizeMode: 'cover',
    },
  
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 100,
    paddingTop: 60, 
  },
  
  avatarWrapper: {
    position: 'relative',
    marginBottom: 15,
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
    backgroundColor: colors.pink,
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
  roleBadge: {
    backgroundColor: '#F0F4EF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 5,
  },
  roleText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.green,
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
  }
});