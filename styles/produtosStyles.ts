import { StyleSheet, Dimensions } from 'react-native';

export const colors = {
  green: '#60875b',
  pink: '#e5aeab',
  white: '#fff',
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

  logoWrapper: {
    backgroundColor: colors.green, 
    width: width,
      height: 120, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
    // paddingTop: 30, 
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

  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    marginHorizontal: 16,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 16,
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
    backgroundColor: colors.pink,
    borderColor: colors.pink,
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
    borderWidth: 2,
    borderColor: colors.green,
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
    color: colors.green,
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
    borderWidth: 4,
    borderColor: colors.green,
    backgroundColor: '#EEE',
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
    color: colors.green,
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
  bottom: 100, 
  backgroundColor: colors.green,
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
