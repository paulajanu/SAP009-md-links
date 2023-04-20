import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './index.js';
import listaValidada from './http-validacao.js';

const caminho = process.argv;

function imprimeLista(valida, resultado, identificador = '') {
    if (valida) {
        listaValidada(resultado)
        .then((status) => {
            console.log(chalk.yellow('\n', 'Lista validada'), 
            chalk.black.bgYellow(identificador), 
            status);
    })
    } else {
        console.log(chalk.yellow('\n', 'Lista de links'), 
        chalk.black.bgYellow(identificador),
        resultado) 
    }
}
  
function processaTexto (argumentos) {
    const caminho = argumentos[2];
    const valida = argumentos[3] === '--validate';
    
    try {
        fs.lstatSync(caminho);
    } catch (erro) {
        if (erro.code === 'ENOENT') {
            console.log(chalk.bold.red('\n', '✘ Arquivo ou diretório não existe ✘'));
            return;
        }
    } 

    if (fs.lstatSync(caminho).isFile()) {
        pegaArquivo(argumentos[2])
        .then(resultado => {
            imprimeLista(valida, resultado);
        })  
    } else if (fs.lstatSync(caminho).isDirectory()) {
        fs.promises.readdir(caminho)
        .then(arquivos => {
            arquivos.forEach((nomeDeArquivo) => {
                pegaArquivo(`${caminho}/${nomeDeArquivo}`)
                .then((lista) => {
                    imprimeLista(valida, lista, nomeDeArquivo);
                });
            })
        })
    }
}
processaTexto(caminho);
