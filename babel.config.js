module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['@react-native/babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@app': './src/app',
            '@entities': './src/entities',
            '@features': './src/features',
            '@pages': './src/pages',
            '@shared': './src/shared',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        'react-native-reanimated/plugin',
      ],
      ['@babel/plugin-transform-export-namespace-from'],
    ],
  };
};
