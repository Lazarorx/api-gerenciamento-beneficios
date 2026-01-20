export default [
  {
    files: ["src/**/*.js", "tests/**/*.js", "*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        global: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly"
      }
    },
    rules: {
      // Possíveis erros
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-undef": "error",
      "no-unreachable": "error",

      // Melhores práticas
      "eqeqeq": ["error", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-return-assign": "error",
      "no-self-compare": "error",
      "no-throw-literal": "error",
      "prefer-const": "error",
      "no-var": "error",

      // Estilo de código
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "quotes": ["error", "single", { "avoidEscape": true }],
      "semi": ["error", "always"],
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "comma-dangle": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-before-function-paren": ["error", "never"],
      "keyword-spacing": "error",
      "space-infix-ops": "error",
      "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
      "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
      "curly": ["error", "all"],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
      "space-before-blocks": "error",

      // Node.js específico
      "no-console": "warn",
      "no-process-exit": "error",

      // Clean Architecture
      "max-len": ["warn", { "code": 100, "ignoreUrls": true }],
      "max-params": ["warn", 4],
      "complexity": ["warn", 10],
      "max-depth": ["warn", 4],
      "max-nested-callbacks": ["warn", 3]
    }
  },
  {
    files: ["tests/**/*.js", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly"
      }
    },
    rules: {
      // Relaxar algumas regras para testes
      "no-console": "off",
      "max-len": "off",
      "max-nested-callbacks": "off"
    }
  }
];