module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['@strapi/eslint-config/front/javascript'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  globals: {
    window: false,
    // TODO: put all this in process.env in webpack to avoid having to set them here
    ADMIN_PATH: true,
    BACKEND_URL: true,
    PUBLIC_PATH: true,
    NODE_ENV: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': 'off',
    'react/jsx-no-constructed-context-values': 'warn',
    'react/jsx-no-useless-fragment': 'warn',
    'react/no-unstable-nested-components': 'warn',
    'import/order': [
      'error',
      {
        groups: [
          ['external', 'internal', 'builtin'],
          'parent',
          ['sibling', 'index'],
          'object',
          'type',
        ],
        pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@strapi/design-system',
            importNames: ['Stack'],
            message:
              "'Stack' has been deprecated. Please import 'Flex' from '@strapi/design-system' instead.",
          },
          {
            name: '@strapi/helper-plugin',
            importNames: ['request'],
            message:
              "'request' has been deprecated. Please import 'useFetchClient' from '@strapi/helper-plugin' instead.",
          },
          {
            name: '@strapi/helper-plugin',
            importNames: ['ReactSelect'],
            message:
              "'ReactSelect' has been deprecated. You should use the components from '@strapi/design-system' instead.",
          },
          {
            name: 'lodash',
            message: 'Please use import [method] from lodash/[method]',
          },
        ],
        patterns: [
          {
            group: [
              '@strapi/design-system/*',
              '!@strapi/design-system/v2',
              '@strapi/design-system/v2/*',
            ],
            message: 'Please use the default import from "@strapi/design-system" packages instead.',
          },
          {
            group: ['@strapi/icons/*'],
            message: 'Please use the default import from "@strapi/icons" packages instead.',
          },
        ],
      },
    ],
    'no-restricted-globals': [
      'error',
      {
        name: 'strapi',
        message: 'Use window.strapi instead.',
      },
    ],
  },
};
