import { StyleSheet, Dimensions } from 'react-native';

export const colors = {
  dustypink: '#DFA3B2',
  Lightolivegreen: '#B8C4A5',
  Warmbeigebackground: '#F3E7DD',
};

export const fonts = {
  regular: 'Poppins_400Regular',
  semiBold: 'Poppins_600SemiBold',
};

const { width } = Dimensions.get('window');
const gap = 12; 
const padding = 16; 
const cardWidth = (width - (padding * 2 + gap)) / 2;

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    // paddingTop: 50,
    // paddingHorizontal: 16,
  },

  headerContainer: {
    backgroundColor: '#FBFBFB',
    paddingBottom: 10,
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



// logo: {
//   width: 70,
//   height: 70,
//   resizeMode: 'contain',
//   borderRadius: 999,
//   borderWidth: 2,
//   borderColor: colors.Lightolivegreen,
// },

searchSection: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  marginHorizontal: 18,
  borderRadius: 20,
  paddingHorizontal: 18,
  height: 48,
  marginBottom: 18,
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 10,
  elevation: 3,
},

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#333',
  },

  filterScroll: {
    paddingLeft: 16,
    paddingBottom: 10,
  },

  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: '#FFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  filterPillActive: {
    backgroundColor: colors.dustypink,
    borderColor: colors.dustypink,
  },

  filterPillText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: '#666',
  },

  filterPillTextActive: {
    color: '#FFF',
  },

  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },

  row: {
    justifyContent: 'space-between',
  },

  gridCard: {
    width: cardWidth,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },

  imageContainer: {
    width: '100%',
    height: cardWidth * 1.3, 
    position: 'relative',
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  gridDescription:{
      fontFamily: fonts.regular,
      fontSize: 12,
      color: '#777',
  },

  gridInfo: {
    padding: 12,
  },

  gridTitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },

  gridPrice: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: '#4E5B48',
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    padding: 6,
    borderRadius: 15,
  },

// buttonHorizontal: {
//   backgroundColor: '#89c489',
//   paddingVertical: 6,
//   paddingHorizontal: 12,
//   borderRadius: 6,
//   alignSelf: 'flex-start',
// },

// buttonTextHorizontal: {
//   color: '#fff',
//   fontWeight: '600',
//   fontSize: 12,
// },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end', 
  },
  
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: '85%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },

  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent:'space-between',
  },

  iconBtn: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },

  modalTopSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  modalImageLarge: {
    width: 120,
    height: 150,
    borderRadius: 16,
    backgroundColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,

  },

  modalMainInfo: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },

  modalNome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    fontFamily: fonts.semiBold,
    textTransform: 'capitalize',
  },

  modalPriceText: {
    fontSize: 18,
    color: '#577549',
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: fonts.semiBold,
    letterSpacing: 0.5,
  },

  categoryBadge: {
    backgroundColor: '#fdecec96',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginRight: 8,
  },

  categoryBadgeText: {
    color: '#e6aeac',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
    letterSpacing: 0.5,
  },

  divider: {
    height: 1,
    backgroundColor: '#e8e5e5',
    marginVertical: 15,
  },
  
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: fonts.regular,

  },

  modalDetailsSection:{
    marginBottom: 20,
    padding: 16,
  },

  modalDescricaoText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    marginBottom: 24,
    fontFamily: fonts.regular,
  },

  modernTable: {
    backgroundColor: '#fbd3d238',
    borderRadius: 12,
    padding: 10,
  },

  modernTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6aeac66',
  },

  tableCellMain: {
    fontWeight: '500',
    color: '#333',
    fontFamily: fonts.regular,
  },

  tableCellSide: {
    color: '#666',
    fontFamily: fonts.regular,
  },

  semEstoque: {
    fontStyle: 'italic',
    color: '#999',
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 130, 
    backgroundColor: colors.Lightolivegreen,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
