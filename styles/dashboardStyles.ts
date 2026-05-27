import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  dustypink: '#DFA3B2',
  Lightolivegreen: '#B8C4A5',
  Warmbeigebackground: '#F3E7DD',
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

heroBlob2: {
  position: "absolute",
  width: 180,
  height: 180,
  borderRadius: 999,
  backgroundColor: "rgba(184,196,165,0.15)",
  bottom: -60,
  left: -40,
},

heroMiniText: {
  fontSize: 13,
  color: "#888",
  marginBottom: 6,
  letterSpacing: 1,
  textTransform: "uppercase",
},

heroSubText: {
  color: "#777",
  marginTop: 6,
  fontSize: 14,
},

heroIconCircle: {
  width: 58,
  height: 58,
  borderRadius: 999,
  backgroundColor: colors.dustypink,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: colors.dustypink,
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 6,
},

heroActionsRow: {
  flexDirection: "row",
  marginTop: 26,
  justifyContent: "space-between",
  gap: 5,
},

heroActionCardPink: {
  flex: 1,
  backgroundColor: "rgba(255,255,255,0.75)",
  borderRadius: 22,
  paddingVertical: 16,
  paddingHorizontal: 10,
  marginHorizontal: 4,
  alignItems: "center",


},

heroActionCardGreen: {
  flex: 1,
  backgroundColor: "rgba(255,255,255,0.75)",
  borderRadius: 22,
  paddingVertical: 16,
  paddingHorizontal: 10,
  marginHorizontal: 4,
  alignItems: "center",
},

heroActionIconPink: {
  width: 42,
  height: 42,
  borderRadius: 999,
  backgroundColor: colors.dustypink,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 14,
},

heroActionIconGreen: {
  width: 42,
  height: 42,
  borderRadius: 999,
  backgroundColor: colors.Lightolivegreen,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 14,
},

heroActionTitle: {
  fontSize: 12,
  fontWeight: "700",
  color: "#333",
},

heroActionSubtitle: {
  marginTop: 3,
  fontSize: 11,
  color: "#777",
  lineHeight: 14,
},

heroActionCardArchive: {
  flex: 1,
  backgroundColor: "rgba(255,255,255,0.75)",
  borderRadius: 22,
  paddingVertical: 16,
  paddingHorizontal: 10,
  marginHorizontal: 4,
  alignItems: "center",

},

heroActionIconArchive: {
  width: 42,
  height: 42,
  borderRadius: 999,
  backgroundColor: "#9E9E9E",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 14,
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
    color: colors.Lightolivegreen,
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
    color: colors.dustypink,
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
    borderLeftColor: colors.Lightolivegreen,
    borderRightWidth: 4,
    borderRightColor: colors.Lightolivegreen,
  },
  insightText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#555',
  },
});