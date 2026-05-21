import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const colors = {
  dustypink: "#DFA3B2",
  Lightolivegreen: "#B8C4A5",
  Warmbeigebackground: "#F3E7DD",
  white: "#FFFFFF",
  background: "#FBFBFB",
  textMain: "#333",
  textSecondary: "#777",
};

export const fonts = {
  regular: "Poppins_400Regular",
  semiBold: "Poppins_600SemiBold",
};

export const cadastroFuncionario = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 60,
  },

  heroSection: {
    backgroundColor: colors.Warmbeigebackground,

    paddingTop: 90,
    paddingBottom: 42,
    paddingHorizontal: 24,

    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,

    overflow: "hidden",

    alignItems: "center",
  },

  heroBlob: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(223,163,178,0.18)",
    top: -80,
    right: -50,
  },

  heroBlob2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    bottom: -50,
    left: -40,
  },

  iconWrapper: {
    width: 74,
    height: 74,
    borderRadius: 24,

    backgroundColor: colors.Lightolivegreen,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },


formCard: {
  width: width - 32,
  alignSelf: 'center',
  backgroundColor: '#FFF',
  gap: 14,
  marginTop: 22,
  borderRadius: 28,
  padding: 22,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
},

sectionTitle: {
  fontSize: 16,
  marginBottom: 22,
  color: colors.textMain,
  fontFamily: fonts.semiBold,
},

profileHeroRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

profileInfo: {
  flex: 1,
  paddingRight: 16,
},

title: {
  fontSize: 22,
  color: '#7D7D7D',
  fontFamily: fonts.regular,
},

subtitle: {
  marginTop: 4,
  fontSize: 14,
  color: '#9A8E86',
  fontFamily: fonts.regular,
},

roleBadge: {
  backgroundColor: '#F0F4EF',
  paddingHorizontal: 12,
  paddingVertical: 5,
  borderRadius: 20,
  marginTop: 12,
  alignSelf: 'flex-start',
},

roleText: {
  fontFamily: fonts.regular,
  fontSize: 12,
  color: colors.Lightolivegreen,
  textTransform: 'uppercase',
},

avatarWrapper: {
  position: 'relative',
},

iconAvatar: {
  width: 100,
  height: 100,
  borderRadius: 50,

  backgroundColor: colors.Lightolivegreen,

  justifyContent: 'center',
  alignItems: 'center',

  borderWidth: 4,
  borderColor: colors.white,
},


  button: {
    height: 56,
    borderRadius: 18,

    backgroundColor: colors.Lightolivegreen,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    marginTop: 10,
  },

  buttonText: {
    color: "#FFF",
    marginLeft: 10,
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },

  cancelButton: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'red',
  },

  cancelText: {
    color: "red",
    fontSize: 14,
    fontFamily: fonts.regular,
  },
});