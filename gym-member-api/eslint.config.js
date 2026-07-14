import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'public/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
];