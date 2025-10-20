import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import expoConfig from "eslint-config-expo/flat.js";
import prettier from "eslint-config-prettier";
import reactNative from "eslint-plugin-react-native";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [".expo/*", "dist/*", "node_modules/*"],
  },
  expoConfig, // Expo вже має react і react-hooks
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-native": reactNative,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactNative.configs.all.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "react-native/no-inline-styles": "warn",
      "@typescript-eslint/ban-types": "off",
      "react-native/sort-styles": "off",
    },
  },
  prettier,
]);