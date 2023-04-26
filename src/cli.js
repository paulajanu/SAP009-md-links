#!/usr/bin/env node

import mdLinks from './index.js';

const path = process.argv[2];
const options = {
    validate: process.argv.includes('--validate'),
    stats: process.argv.includes('--stats'),
}

mdLinks(path, options)