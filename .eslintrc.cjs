export const root = true;
export const ignorePatterns = ['projects/**/*'];
export const overrides = [
  {
    files: ['*.ts'],
    extends: [
      'plugin:@angular-eslint/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      project: ['./tsconfig.json'],
      createDefaultProgram: true,
    },
    rules: {
      // Suas regras personalizadas
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
  {
    files: ['*.html'],
    extends: ['plugin:@angular-eslint/template/recommended'],
    rules: {
      // Regras para templates
    },
  },
];
