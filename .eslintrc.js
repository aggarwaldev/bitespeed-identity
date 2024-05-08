module.exports = {
  env: {
    node: true,
    jest: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
  },
  plugins: ['@typescript-eslint', 'node', 'prettier'],
  extends: ['airbnb-base'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended-type-checked',
      ],
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: ['**/*spec.ts'] },
        ],
      },
      parserOptions: {
        project: true,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
    },
    {
      files: ['*.js', '*.ts', '*.tsx'],
      extends: ['prettier'],
      rules: {
        'prettier/prettier': 'error',
      },
    },
  ],
};
