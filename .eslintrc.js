module.exports = {
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended', 'plugin:jest/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'jest', 'react-hooks'],
  globals: {
    'fetch': false,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test.tsx', '**/test.ts'] }],
    "indent": "off",
    '@typescript-eslint/indent': [2, 2],
    'import/prefer-default-export': 'off', // Prefer named exports instead. See: https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
    'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
    'react/prop-types': 'off', // Disable prop types since we are using Typescript
    '@typescript-eslint/explicit-function-return-type': 'off', // This adds extra code and doesn't make use of inference
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: true, classes: true, variables: false },
    ], // TODO: This only makes sense for the Styles in component pattern
    'react/destructuring-assignment': 'off', // This one doesn't make much sense to me as sometimes it creates extra code. i think it's not a big deal to access props in both ways
    'react/state-in-constructor': 'off',
    'implicit-arrow-linebreak': 'off',
    'react/static-property-placement': 'off',
    'react/jsx-props-no-spreading': 'off',  

    "react-hooks/rules-of-hooks": 'error',
    // "react-hooks/exhaustive-deps": 'warn',

    "import/extensions": [
      "error",
      "never",
      {
        ignorePackages: true,
        pattern: {
          "js": "always",
        }
      }
    ],

    "linebreak-style": [2, "unix"],

    // ACCESSIBILTY
    // TODO: Re-enable All of these when bringing in accessibilty
    "jsx-a11y/aria-role": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off"
  },
  env: {
    "browser": true
  }
};
