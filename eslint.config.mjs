import prettierPlugin from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['node_modules', 'dist']
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                '__ENV': 'readonly',
                'k6': 'readonly',
            },
        },
        rules: {
            'quotes': ['error', 'single'],
            'no-unused-vars': ['warn'],
            'no-console': 'off',
            'import/no-unresolved': 'off', // k6 is actually golang, can't really import it
            'no-restricted-globals': 'off', // required by k6, e.g. "init" context
            'import/extensions': 'off',
            'prettier/prettier': 'error' // Add Prettier as an ESLint rule
        },
        plugins: {
            prettier: prettierPlugin // Define Prettier plugin as an object
        },
    }
];