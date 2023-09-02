// only use babel-plugin for native:
process.env.TAMAGUI_TARGET = 'native'
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // optional:
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui'],
        config: './tamagui.config.ts',

        importsWhitelist: ['constants.js', 'colors.js'],

        logTimings: true,

        disableExtraction: process.env.NODE_ENV === 'development',

      }

    ],

    // be sure TAMAGUI_TARGET environment variable is set

    'transform-inline-environment-variables'
  ]
}

