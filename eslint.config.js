const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
    plugins: {
      prettier,
    },
  },
];
