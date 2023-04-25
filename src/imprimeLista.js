import chalk from 'chalk';
import { listaValidada } from './validacao-stats.js';

function imprimeLista(valida, resultado, identificador ='') {
    if (valida) {
        listaValidada(resultado)
        .then((categoria) => {
            console.log(chalk.yellow('\n', '\u26D3 Lista de links válidos:'), 
            chalk.underline.yellow(identificador)), 
            categoria.map(({text, href, file, status}) => console.log(`${chalk.magenta(file)} | ${chalk.magenta(href)} | ${status} | ${chalk.magenta(text)}`))});
    } else { 
        console.log(chalk.yellow('\n', '\u26D3 Lista de links:'), 
        chalk.underline.yellow(identificador)),
        resultado.map(({text, href, file}) => console.log(`${chalk.magenta(file)} | ${chalk.magenta(href)} | ${chalk.magenta(text)}`));
    }
}

export default imprimeLista;