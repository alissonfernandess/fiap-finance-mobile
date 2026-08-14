export const fontFamily = {
  regular: 'Inter_400Regular',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 64,
    lineHeight: 77,
  },

  title: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
  },

  headline: {
    fontFamily: fontFamily.regular,
    fontSize: 21,
    lineHeight: 27,
  },

  headlineSmall: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
} as const;