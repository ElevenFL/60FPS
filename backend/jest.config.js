module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!src/infrastructure/config/**'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
}; 