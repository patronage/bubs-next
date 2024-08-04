module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 90,
  overrides: [
    {
      files: '*.php',
      options: {
        printWidth: 100,
        plugins: ['@prettier/plugin-php'],
        phpVersion: '8.2',
        braceStyle: '1tbs',
      },
    },
  ],
};
