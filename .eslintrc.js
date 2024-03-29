module.exports = {
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    // 'prettier',
    // 'prettier/@typescript-eslint',
    // 'prettier/react',
  ],
  plugins: ['@typescript-eslint', 'jest', 'react-hooks', 'babel', 'prettier'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  env: {
    browser: true,
  },
  rules: {
    // 'prettier/prettier': 0, // error
    'import/named': 0,
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'import/no-extraneous-dependencies': [
      2,
      { devDependencies: ['**/test.tsx', '**/test.ts'] },
    ],
    'import/prefer-default-export': 'off', // Prefer named exports instead. See: https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
    'implicit-arrow-linebreak': 'off',
    'import/extensions': [
      'error',
      'never',
      {
        ignorePackages: true,
        pattern: {
          js: 'always',
        },
      },
    ],

    'linebreak-style': [2, 'unix'],

    'class-methods-use-this': 'off',
    'array-callback-return': 'off', // Typescript will take are of this complain

    'no-dupe-class-members': 'off', // This breaks method overloading when on

    // See https://github.com/babel/eslint-plugin-babel/issues/185#issuecomment-569996329
    'no-unused-expressions': 'off',
    'babel/no-unused-expressions': 'warn',

    '@typescript-eslint/explicit-function-return-type': 'off', // This adds extra code and doesn't make use of inference
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: true, classes: true, variables: false },
    ], // TODO: This only makes sense for the Styles in component pattern

    // [Sep 8th 2020] These create errors all of a sudden so not using them for now
    // indent: 'off',
    // '@typescript-eslint/indent': [2, 2],

    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off', // Disable prop types since we are using Typescript
    'react/destructuring-assignment': 'off', // This one doesn't make much sense to me as sometimes it creates extra code. i think it's not a big deal to access props in both ways
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-curly-newline': 'off',
    // "react-hooks/exhaustive-deps": 'warn',

    // 'jsx-one-expression-per-line': 'off',

    // ACCESSIBILTY
    // TODO: Re-enable All of these when bringing in accessibilty
    'jsx-a11y/aria-role': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',

    "no-unused-expressions": 'off',
    "@typescript-eslint/no-unused-expressions": 'off'
  },
};
