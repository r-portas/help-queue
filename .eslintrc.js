module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import'
  ],
  env: {
    node: true,
    browser: true
  },
  rules: {
    'no-plusplus': 'off',
    'no-console': 'off',
    'comma-dangle': 'off'
  }
};
