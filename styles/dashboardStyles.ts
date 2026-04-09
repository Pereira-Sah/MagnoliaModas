import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  green: '#60875b',
  pink: '#e5aeab',
  white: '#fff',
  background: '#FBFBFB',
  textMain: '#333',
  textSecondary: '#666',
  cardBg: '#FFF',
  grayLight: '#F0F0F0',
};

export const fonts = {
  regular: 'Poppins_400Regular',
  semiBold: 'Poppins_600SemiBold',
};

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  logoWrapper: {
    backgroundColor: colors.green, 
    width: width,
    height: 90, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,

  },

  logo: {
    width: '40%',
    height: 100,
    resizeMode: 'cover',
  },

  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  welcomeText: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
    color: colors.textMain,
    marginVertical: 20,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#444',
    marginLeft: 8,
  },
  salesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  mainNumber: {
    fontFamily: fonts.semiBold,
    fontSize: 26,
    color: colors.green,
  },
  subText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#888',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -16, 
  },
  aiCardBody: {
    backgroundColor: '#FDF5F5',
    borderRadius: 12,
    padding: 15,
  },
  aiNumber: {
    fontSize: 32,
    fontFamily: fonts.semiBold,
    color: colors.pink,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  insightBadge: {
    backgroundColor: '#F0F4EF',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: colors.green,
    borderRightWidth: 4,
    borderRightColor: colors.green,
  },
  insightText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#555',
  },
});