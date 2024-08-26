// https://eslint.org/docs/latest/use/configure/

module.exports = {
  root: true,
  env: { es2022: true, browser: true, node: true },
  // Standard linting for pure javascript files
  extends: [
    "eslint:recommended",
    // Disables all style rules (must always be put last, so it overrides anything before it)
    // https://prettier.io/docs/en/integrating-with-linters.html
    // https://github.com/prettier/eslint-config-prettier
    "prettier",
  ],
  overrides: [
    // TypeScript linting for TypeScript files
    {
      files: "*.ts",
      plugins: [
        "@typescript-eslint",
        // https://tsdoc.org/
        "eslint-plugin-tsdoc",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: { project: "tsconfig.eslint.json" },
      extends: [
        "plugin:@typescript-eslint/recommended-type-checked",
        "prettier",
      ],
      rules: {
        "tsdoc/syntax": "error",
        // @TODO: Remove the ones between "~~", adapt code
        // ~~
        "@typescript-eslint/prefer-as-const": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-floating-promises": "off",
        // ~~
        "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],
        // @TODO: Should be careful with this rule, should leave it be and disable
        //       it within files where necessary with explanations
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          // argsIgnorePattern: https://eslint.org/docs/latest/rules/no-unused-vars#argsignorepattern
          // varsIgnorePattern: https://eslint.org/docs/latest/rules/no-unused-vars#varsignorepattern
          { args: "all", argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        // @TODO: Not recommended to disable rule, should instead disable locally
        //       with explanation
        "@typescript-eslint/ban-ts-ignore": "off",
      },
    },
    // Vitest linting for test files
    {
      files: "tests/*.ts",
      plugins: ["@vitest"],
      extends: ["plugin:@vitest/legacy-recommended", "prettier"],
      // @TODO: Remove all of these rules and adapt code!
      rules: {
        "@vitest/expect-expect": "off",
        "@vitest/valid-title": "off",
        "@vitest/valid-expect": "off",
      },
    },
  ],
};
