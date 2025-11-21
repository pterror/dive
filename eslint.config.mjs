import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Global ignores
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.astro/**", "**/.output/**"],
  },

  // Base config
  ...tseslint.configs.recommended,

  // Astro config
  ...eslintPluginAstro.configs.recommended,

  // Vue config
  ...eslintPluginVue.configs["flat/recommended"],

  // Custom rules
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,astro,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro", ".vue"],
      },
    },
    rules: {
      // Disallow 'any'
      "@typescript-eslint/no-explicit-any": "warn",

      // Discourage forEach
      "no-restricted-syntax": [
        "warn",
        {
          selector: 'CallExpression[callee.property.name="forEach"]',
          message: "Avoid .forEach(), use for...of instead.",
        },
      ],

      // Vue specific overrides if needed
      "vue/multi-word-component-names": "off", // Common annoyance in some projects, can be removed if strictness desired
    },
  },
];
