#!/usr/bin/env node
//import chalk from 'chalk';
import mdLinks from './index.js';
//import { listaValidada } from './validacao-stats.js';

// function imprimeLista(valida, resultado, identificador = '') {
//     if (valida) {
//         listaValidada(resultado)
//         .then((categoria) => {
//             console.log(chalk.yellow('\n', '\u26D3 Lista de links válidos:'), 
//             chalk.underline.yellow(identificador)), 
//             categoria.map(({text, href, file, status}) => console.log(`${chalk.magenta(file)} | ${chalk.magenta(href)} | ${status} | ${chalk.magenta(text)}`))});
//     } else { 
//         console.log(chalk.yellow('\n', '\u26D3 Lista de links:'), 
//         chalk.underline.yellow(identificador)),
//         resultado.map(({text, href, file}) => console.log(`${chalk.magenta(file)} | ${chalk.magenta(href)} | ${chalk.magenta(text)}`));
//     }
// }

// export default imprimeLista;

const path = process.argv[2];
const options = {
    validate: process.argv.includes('--validate'),
    stats: process.argv.includes('--stats'),
}

mdLinks(path, options)