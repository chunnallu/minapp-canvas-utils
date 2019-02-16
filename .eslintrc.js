module.exports = {
  extends: ['standard', 'plugin:prettier/recommended'],
  globals: {
    App: true,
    BaaS: true,
    Component: true,
    expect: true,
    getApp: true,
    getCurrentPages: true,
    Page: true,
    requirePlugin: true,
    test: true,
    wx: true,
  },
  rules: {
    camelcase: 0,
    eqeqeq: 0,
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'always-multiline'],
    'handle-callback-err': ['error', 'never'],
    'max-len': ['error', 120],
    'no-new': 0,
    'object-curly-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'standard/no-callback-literal': 0,
  },
}