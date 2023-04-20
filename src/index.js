import fs from 'fs';
import chalk from 'chalk';

//Extraindo links do arquivo
function extraiLinks(texto, caminhoDoArquivo) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const capturas = [...texto.matchAll(regex)];
  const resultados = capturas.map(captura => ({href: captura[2], text: captura[1], file: caminhoDoArquivo}));
  return resultados.length !== 0 ? resultados : chalk.bold.red('\n\n', '✘ Não há links no arquivo ✘');
}

//Tratando erro da função "pegaArquivo"
function trataErro(erro) {
  console.log(erro);
  throw new Error(chalk.red(erro.code, `- ✘ Não existe arquivo no diretório ✘`)); 
}

//Acessando um arquivo através da biblioteca FS (File System) - nativa do Node.js com método assíncrono 
function pegaArquivo(caminhoDoArquivo) {
  const encoding = 'utf-8';
  return fs.promises.readFile(caminhoDoArquivo, encoding) 
    .then((texto) => (extraiLinks(texto, caminhoDoArquivo)))
    .catch(trataErro)
  }

export default pegaArquivo;