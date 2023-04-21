import fs from 'fs';
import chalk from 'chalk';
import imprimeLista from './cli.js';

//Extraindo links do arquivo
// function extraiLinks(texto, caminhoDoArquivo) {
//   const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
//   const capturas = [...texto.matchAll(regex)];
//   const resultados = capturas.map(captura => ({href: captura[2], text: captura[1], file: caminhoDoArquivo}));
//   return resultados.length !== 0 ? resultados : chalk.bold.red('\n\n', '✘ Não há links no arquivo ✘');
// }

//Tratando erro da função "pegaArquivo"
// function trataErro(erro) {
//   console.log(erro);
//   throw new Error(chalk.red(erro.code, `- ✘ Não existe arquivo no diretório ✘`)); 
// }

//Acessando um arquivo através da biblioteca FS (File System) - nativa do Node.js com método assíncrono ".then" (que extrai os links
// do arquivo e tratando erro (Verificar se mudo o nome dessa função, pois resumindo estou extraindo o link)
function pegaArquivo(caminhoDoArquivo) {
  const encoding = 'utf-8';
  return fs.promises.readFile(caminhoDoArquivo, encoding) 
    .then((texto) => {
      const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
      const capturas = [...texto.matchAll(regex)];
      const resultados = capturas.map(captura => ({href: captura[2], text: captura[1], file: caminhoDoArquivo}));
      return resultados;
      //return resultados.length !== 0 ? resultados : chalk.bold.red('\n\n', '✘ Não há links no arquivo ✘');
    })
    .catch((erro) => {
      console.log(erro);
      throw new Error(chalk.red(erro.code, `- \u2718 Não existe arquivo no diretório \u2718`)); 
    })
  }

//export {pegaArquivo};


// function pegaArquivo(caminhoDoArquivo) {
//   const encoding = 'utf-8';
//   return fs.promises.readFile(caminhoDoArquivo, encoding) 
//     .then((texto) => (extraiLinks(texto, caminhoDoArquivo)))
//     .catch((erro) => {
//       console.log(erro);
//       throw new Error(chalk.red(erro.code, `- ✘ Não existe arquivo no diretório ✘`)); 
//     })
//   }

// export default pegaArquivo;

//Tudo que for caminho é = path

function mdLinks(path, options) {
  try {
    if (!path) throw new Error('Path indefinido ou nulo');
    
    if (fs.lstatSync(path).isDirectory()) { 
      fs.promises.readdir(path)
        .then(arquivos => {
            arquivos.forEach((nomeDeArquivo) => {
                pegaArquivo(`${path}/${nomeDeArquivo}`)
                .then(resultado => {
                  //console.log('\n', `${path}/${nomeDeArquivo}`)
                  if (resultado.length === 0) {
                    console.log(chalk.red('\n', `\u2718 Não há links no arquivo "${chalk.underline.red(nomeDeArquivo)}" \u2718`))
                  } else { 
                    imprimeLista(options.validate, resultado, nomeDeArquivo);
                  }
                })
            })
        })
    }
    else if (fs.lstatSync(path).isFile() && !path.endsWith('.md')) { 
      console.log(chalk.red('\n', `\u2718 Extensão inválida \u2718`))
    } 
    else {
      pegaArquivo(path)
      .then(resultado => {
        if (resultado.length === 0) {
          console.log(chalk.bold.red('\n', '\u2718 Não há links no arquivo \u2718'))
        } else {
          imprimeLista(options.validate, resultado);
        }
      })
    } 
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      console.log(chalk.red('\n', `\u2718 O caminho "${path}" é inválido \u2718`));
    }
  }
}

export default mdLinks;

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
