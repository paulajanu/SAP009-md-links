import chalk from 'chalk';
//import fs from 'fs';
//import pegaArquivo from './index.js';
import mdLinks from './index.js';
import listaValidada from './http-validacao.js';

function imprimeLista(valida, resultado, identificador = '') {
    if (valida) {
        listaValidada(resultado)
        .then((categoria) => {
            console.log(chalk.yellow('\n', 'Lista validada:'), 
            chalk.underline.yellow(identificador)), 
            categoria.map(({text, href, file, status}) => console.log(chalk.green(' \u2714 ') + `${chalk.magenta(file)} | ${chalk.magenta(href)} | ${status} | ${chalk.magenta(text)}`));
    })
    } else { 
        console.log(chalk.yellow('\n', 'Lista de links:'), 
        chalk.underline.yellow(identificador)),
        resultado.map(({text, href, file}) => console.log(`${chalk.magenta(file)} | ${chalk.magenta(href)} | ${chalk.magenta(text)}`));
    }
}

export default imprimeLista;

const path = process.argv[2];
const options = {
    validate: process.argv.includes('--validate'),
    stats: process.argv.includes('--stats'),
}

mdLinks(path, options)

// function processaTexto (argumentos) {
//     const caminho = argumentos[2];
//     const valida = argumentos[3] === '--validate';
    
//     try {
//         fs.lstatSync(caminho);
//     } catch (erro) {
//         if (erro.code === 'ENOENT') {
//             console.log(chalk.bold.red('\n', '✘ Arquivo ou diretório não existe ✘'));
//             return;
//         }
//     } 

//     if (fs.lstatSync(caminho).isFile()) {
//         pegaArquivo(argumentos[2])
//         .then(resultado => {
//             imprimeLista(valida, resultado);
//         })  
//     } else if (fs.lstatSync(caminho).isDirectory()) {
//         fs.promises.readdir(caminho)
//         .then(arquivos => {
//             arquivos.forEach((nomeDeArquivo) => {
//                 pegaArquivo(`${caminho}/${nomeDeArquivo}`)
//                 .then((lista) => {
//                     imprimeLista(valida, lista, nomeDeArquivo);
//                 });
//             })
//         })
//     }
// }
// processaTexto(caminho);
