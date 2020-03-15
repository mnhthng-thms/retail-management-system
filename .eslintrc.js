module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },
  parser: 'babel-eslint',
  env: {
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'standard',
    'prettier',
    'prettier/standard',
    'plugin:node/recommended',
    'plugin:jest/recommended'
  ],
  plugins: ['prettier', 'jest', 'node'],
  rules: {
    'node/no-unsupported-fearures/es-syntax': 0,
    'node/no-unsupported-fearures/es-builtins': 0,
    'promise/catch-or-return': 'error',
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true,
        'semi': true,
        'indent': ['error', 2]
      }
    ]
  }
}
