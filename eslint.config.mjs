// eslint.config.js
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "coverage/**", ".config/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module", 
      globals: {
        ...globals.node, 
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "prefer-const": "warn",
    },
  },
];
