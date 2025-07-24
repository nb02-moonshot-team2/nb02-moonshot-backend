import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // TypeScript 설정
  tseslint.config(tseslint.configs.recommended),

  // 상수 파일
  {
    files: ['src/lib/constants.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['UPPER_CASE'],
        },
      ],
    },
  },

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    ignores: ['src/constants.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        // 변수 (let, var, const) -> camelCase
        {
          selector: 'variable',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // 함수 -> camelCase
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // 클래스 -> PascalCase
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        // 인터페이스 -> PascalCase + I prefix
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        // enum -> PascalCase + Enum suffix
        {
          selector: 'enum',
          format: ['PascalCase'],
          suffix: ['Enum'],
        },
        // 타입 별칭 -> PascalCase
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        // 타입 파라미터 -> PascalCase + T prefix
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        // 객체 리터럴 키 값 -> camelCase
        {
          selector: 'objectLiteralProperty',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
      ],
    },
  },
  // 언더스코어로 시작하는 변수, 매개변수 무시
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
]);
