module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['airbnb', 'prettier'],
  plugins: [ "prettier" ],
  rules: {
    "prettier/prettier": [
      "error", {
        printWidth: 120,
        trailingComma: "all",
      },
    ],
  },
}
