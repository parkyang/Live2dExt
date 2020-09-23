module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {},
  env: {
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    browser: true,
  },
};