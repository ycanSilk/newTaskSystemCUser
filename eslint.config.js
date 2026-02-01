// ESLint 配置
// 集成 TypeScript、React 和 Prettier 规则

import { defineConfig } from 'eslint';
import react from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';

export default defineConfig({
  // 定义要检查的文件范围
  files: ['**/*.{js,jsx,ts,tsx}'],
  // 忽略不需要检查的文件和目录
  ignores: [
    'node_modules/**',
    'dist/**',
    '.next/**',
    'out/**',
    'coverage/**',
    '*.config.js',
    '*.config.ts',
    '.trae/**'
  ],
  // 语言选项
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: typescriptParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      project: './tsconfig.json'
    }
  },
  // 插件
  plugins: {
    '@typescript-eslint': typescriptPlugin,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    prettier
  },
  // 扩展
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  // 规则
  rules: {
    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // React 规则
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-target-blank': 'warn',
    
    // React Hooks 规则
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-undef': 'off',
    'no-unused-expressions': 'off',
    
    // Prettier 规则
    'prettier/prettier': 'error'
  },
  // 环境
  env: {
    browser: true,
    node: true,
    es2022: true,
    'jsx-runtime': true
  },
  // 设置
  settings: {
    react: {
      version: 'detect'
    }
  }
});