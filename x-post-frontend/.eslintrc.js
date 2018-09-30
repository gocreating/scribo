module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
    }
  },
  "plugins": [
    "react",
    "react-native",
    "class-property",
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "rules": {
    "object-curly-spacing": ["error", "always"],
    "semi": ["error", "never"],
  },
  "globals": {
    "document": true,
    "alert": true,
    "FormData": true,
  }
}
