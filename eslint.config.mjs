import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import noNull from 'eslint-plugin-no-null';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));
const project = {
    rules: {
        'explicit-non-arrow-function-return-type': {
            meta: {
                type: 'problem',
                docs: {
                    description: 'Require explicit return types on non-arrow functions and methods'
                },
                schema: [],
                messages: {
                    missing: 'Missing return type on function.'
                }
            },
            create(context) {
                const checkReturnType = node => {
                    if (!node.returnType) {
                        context.report({
                            node,
                            messageId: 'missing'
                        });
                    }
                };

                return {
                    FunctionDeclaration: checkReturnType,
                    FunctionExpression(node) {
                        if (node.parent.type !== 'MethodDefinition' || !['constructor', 'set'].includes(node.parent.kind)) {
                            checkReturnType(node);
                        }
                    },
                    TSMethodSignature: checkReturnType
                };
            }
        },
        'license-header': {
            meta: {
                type: 'problem',
                docs: {
                    description: 'Require the project SPDX license identifier in the leading file comment'
                },
                schema: [],
                messages: {
                    missing: 'Missing the required SPDX license identifier in the leading file comment.'
                }
            },
            create(context) {
                return {
                    Program(node) {
                        const firstToken = context.sourceCode.getFirstToken(node);
                        const leadingComments = firstToken ? context.sourceCode.getCommentsBefore(firstToken) : [];
                        const header = leadingComments[0];

                        if (!header || !/SPDX-License-Identifier: EPL-2\.0 OR GPL-2\.0 WITH Classpath-exception-2\.0/.test(header.value)) {
                            context.report({
                                node,
                                messageId: 'missing'
                            });
                        }
                    }
                };
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
            parser: tseslint.parser,
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
            '@stylistic': stylistic,
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin,
            jsdoc,
            'no-null': noNull,
            'no-unsanitized': noUnsanitized,
            project,
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
            '@stylistic/brace-style': [
                'error',
                '1tbs',
                {
                    allowSingleLine: true
                }
            ],
            '@stylistic/comma-spacing': 'error',
            '@stylistic/keyword-spacing': 'error',
            '@stylistic/semi-spacing': 'error',
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/type-annotation-spacing': 'error',
            '@typescript-eslint/typedef': [
                'error',
                {
                    propertyDeclaration: true
                }
            ],
            'jsdoc/check-alignment': 'error',
            'jsdoc/multiline-blocks': [
                'error',
                {
                    noFinalLineText: true,
                    noZeroLineText: true
                }
            ],
            'project/explicit-non-arrow-function-return-type': 'error',
            'project/license-header': 'error',
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
