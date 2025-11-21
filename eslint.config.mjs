import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginVue from "eslint-plugin-vue";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Global ignores
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.astro/**",
      "**/.output/**",
    ],
  },

  // Base config
  ...tseslint.configs.recommended,

  // Astro config
  ...eslintPluginAstro.configs.recommended,

  // Vue config
  ...eslintPluginVue.configs["flat/recommended"],

  // Unused imports config
  {
    plugins: {
      "unused-imports": eslintPluginUnusedImports,
    },
    rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

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
      // Conflicts with Prettier formatting
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/html-indent": "off",
      "vue/html-closing-bracket-newline": "off",
    },
  },
];
