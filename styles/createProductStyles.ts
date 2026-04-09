import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  green: '#60875b',
  pink: '#e5aeab',
  white: '#fff',
};

export const fonts = {
  regular: 'Poppins_400Regular',
  semiBold: 'Poppins_600SemiBold',
};

export const createProductStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  instructionText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: '#888',
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
//   optionCardDisabled: {
//     opacity: 0.6,
//   },
  iconBg: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#444',
  },
  optionDesc: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  formScroll: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
    marginBottom: 30,
  },
  tagItem: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tagItemSelected: {
    backgroundColor: colors.green,
  },
  tagText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#666',
  },
  tagTextSelected: {
    color: '#FFF',
    fontFamily: fonts.semiBold,
  },
  submitButton: {
    backgroundColor: colors.green,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFF',
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },

imageUploadSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  imagePreviewContainer: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: '#F0F4F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.green,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.green,
    marginTop: 4,
  },
  fakeInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fakeInputText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#999',
  },
});