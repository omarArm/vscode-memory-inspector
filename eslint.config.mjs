import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import tseslint from '@typescript-eslint/eslint-plugin';
import legacyTslint from '@typescript-eslint/eslint-plugin-tslint';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import noNull from 'eslint-plugin-no-null';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import react from 'eslint-plugin-react';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

// The TSLint bridge still uses RuleContext methods removed by ESLint 10.
const legacyTslintConfigRule = legacyTslint.rules.config;
const tslint = {
    ...legacyTslint,
    rules: {
        ...legacyTslint.rules,
        config: {
            ...legacyTslintConfigRule,
            create(context) {
                const legacyContext = Object.create(context);

                Object.defineProperties(legacyContext, {
                    getFilename: {
                        value: () => context.filename
                    },
                    getSourceCode: {
                        value: () => context.sourceCode
                    },
                    parserServices: {
                        value: context.sourceCode.parserServices
                    }
                });

                return legacyTslintConfigRule.create(legacyContext);
            }
        }
    }
};

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: [
            '**/node_modules/**',
            '**/lib/**',
            'plugins/**'
        ]
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2015,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                project: './tsconfig.json',
                tsconfigRootDir
            }
        },
        plugins: {
            '@typescript-eslint': tseslint,
            '@typescript-eslint/tslint': tslint,
            import: importPlugin,
            'no-null': noNull,
            'no-unsanitized': noUnsanitized,
            react
        },
        rules: {
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true
                }
            ],
            semi: ['error', 'always'],
            'arrow-body-style': ['error', 'as-needed'],
            'arrow-parens': ['error', 'as-needed'],
            camelcase: 'off',
            'comma-dangle': 'off',
            curly: 'error',
            'eol-last': 'error',
            eqeqeq: ['error', 'smart'],
            'guard-for-in': 'error',
            'id-blacklist': 'off',
            'id-match': 'off',
            'max-len': [
                'error',
                {
                    code: 180
                }
            ],
            'no-magic-numbers': 'off',
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1
                }
            ],
            'no-new-wrappers': 'error',
            'no-null/no-null': 'error',
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': [
                'error',
                {
                    hoist: 'all'
                }
            ],
            'no-tabs': 'error',
            'no-throw-literal': 'error',
            'no-trailing-spaces': 'error',
            'no-underscore-dangle': 'off',
            'no-unused-expressions': 'error',
            'no-var': 'error',
            'no-void': 'error',
            'one-var': ['error', 'never'],
            'prefer-const': [
                'error',
                {
                    destructuring: 'all'
                }
            ],
            radix: 'off',
            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'always',
                    named: 'never',
                    asyncArrow: 'always'
                }
            ],
            'spaced-comment': [
                'error',
                'always',
                {
                    exceptions: ['*', '+', '-', '/']
                }
            ],
            '@typescript-eslint/tslint/config': [
                'error',
                {
                    rules: {
                        'file-header': [
                            true,
                            'SPDX-License-Identifier: EPL-2\\.0 OR GPL-2\\.0 WITH Classpath-exception-2\\.0'
                        ],
                        'jsdoc-format': [true, 'check-multiline-start'],
                        'one-line': [
                            true,
                            'check-open-brace',
                            'check-catch',
                            'check-else',
                            'check-whitespace'
                        ],
                        typedef: [
                            true,
                            'call-signature',
                            'property-declaration'
                        ],
                        whitespace: [
                            true,
                            'check-branch',
                            'check-decl',
                            'check-operator',
                            'check-separator',
                            'check-type'
                        ]
                    }
                }
            ],
            'import/no-extraneous-dependencies': 'error',
            'import/order': [
                'error',
                {
                    alphabetize: {
                        order: 'asc'
                    }
                }
            ],
            'sort-imports': [
                'error',
                {
                    ignoreDeclarationSort: true,
                    ignoreCase: true
                }
            ],
            '@typescript-eslint/await-thenable': 'warn',
            'no-return-await': 'warn',
            '@typescript-eslint/no-deprecated': 'warn',
            'no-unsanitized/method': [
                'warn',
                {
                    escape: {
                        methods: ['DOMPurify.sanitize']
                    }
                }
            ],
            'no-unsanitized/property': [
                'warn',
                {
                    escape: {
                        methods: ['DOMPurify.sanitize']
                    }
                }
            ],
            'no-eval': 'warn',
            'no-implied-eval': 'warn',
            'react/no-danger-with-children': 'warn',
            'react/no-danger': 'warn'
        }
    },
    {
        files: [
            'dev-packages/**/*',
            '**/*.{spec,espec,slow-spec}.{js,ts}'
        ],
        plugins: {
            import: importPlugin
        },
        rules: {
            'import/no-extraneous-dependencies': 'off'
        }
    }
];
