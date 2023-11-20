module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-prototype-builtins': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'max-len': ['error', { code: 150 }],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
};
