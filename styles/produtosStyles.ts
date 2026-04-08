import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    paddingTop: 50,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },

  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  filtroButton: {
    backgroundColor: '#e6aeac',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  filtroText: {
    color: '#fff',
    fontWeight: '500',
  },

cardHorizontal: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderRadius: 12,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
  overflow: 'hidden',
},

imageHorizontal: {
  width: 100,
  height: 100,
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12,
  resizeMode: 'cover',
},

cardContentHorizontal: {
  flex: 1,
  padding: 10,
  justifyContent: 'space-between',
},

cardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 6,
},

nomeHorizontal: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  flex: 1,
  marginRight: 8,
},

priceBadge: {
  backgroundColor: '#e6aeac',
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 6,
   
},

priceBadgeText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 12,
},

descricaoHorizontal: {
  fontSize: 13,
  color: '#555',
  marginBottom: 8,
},

buttonHorizontal: {
  backgroundColor: '#89c489',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  alignSelf: 'flex-start',
},

buttonTextHorizontal: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 12,
},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },

  modalNome: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    color: '#333',
  },

  modalPreco: {
    fontSize: 18,
    color: '#89c489',
    marginBottom: 8,
    fontWeight: '500',
  },

  modalDescricao: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#555',
  },

  modalInfoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    width: '100%',
  },

  modalInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },

  modalInfoHighlight: {
    fontWeight: '600',
    color: '#e6aeac',
  },

  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    alignSelf: 'flex-start',
  },

  estoqueTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },

  estoqueHeader: {
    flexDirection: 'row',
    backgroundColor: '#e6aeac',
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  estoqueHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
  },

  estoqueRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  estoqueCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },

  semEstoque: {
    color: 'red',
    fontWeight: '500',
    marginBottom: 16,
  },

  closeButton: {
    backgroundColor: '#89c489',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
});
