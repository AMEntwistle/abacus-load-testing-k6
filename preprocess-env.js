// preprocess-env.js
const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, '.env');
const envVars = fs.readFileSync(envFilePath, 'utf-8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('='))
    .map(([key, value]) => `--env ${key}=${value.trim()}`)
    .join(' ');

console.log(envVars);