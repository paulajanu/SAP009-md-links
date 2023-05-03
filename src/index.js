import fs from 'fs';
import chalk from 'chalk';
import { checkLinks } from './validacao-stats.js';
import printList from './printList.js';

export function getFile(caminhoDoArquivo) {
  const encoding = 'utf-8';
  return fs.promises.readFile(caminhoDoArquivo, encoding) 
    .then((texto) => {
      const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
      const capturas = [...texto.matchAll(regex)];
      const resultados = capturas.map(captura => ({href: captura[2], text: captura[1], file: caminhoDoArquivo}));
      return resultados;
    })
    .catch((erro) => {
      console.log(erro);
      throw new Error(chalk.red(erro.code, `- \u2718 Não existe arquivo no diretório \u2718`)); 
    })
}

function mdLinks(path, options) {
  try {
    if (!path) {
      throw new Error("Path indefinido ou nulo");
    }

    if (fs.lstatSync(path).isDirectory()) { 
      fs.promises.readdir(path)
        .then(arquivos => {
            arquivos.forEach((nomeDeArquivo) => {
                getFile(`${path}/${nomeDeArquivo}`)
                .then(resultado => {
                  if (options.stats && options.validate) {
                    checkLinks(resultado)
                      .then(({ totalLinks, uniqueLinks, brokenLinks }) => {
                        console.log(chalk.yellow(`\nEstatísticas dos links do arquivo: ${chalk.underline.yellow(nomeDeArquivo)}\n${chalk.magenta('Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('Unique:')} ${chalk.blue(uniqueLinks)}\n${chalk.cyan('Broken:')} ${chalk.cyan(brokenLinks)}`))
                      })
                      .catch((erro) => {
                        console.error(erro);
                      });
                  } else if (options.stats) {
                    checkLinks(resultado)
                      .then(({ totalLinks, uniqueLinks }) => {
                        console.log(chalk.yellow(`\nEstatísticas dos links do arquivo: ${chalk.underline.yellow(nomeDeArquivo)}\n${chalk.magenta('Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('Unique:')} ${chalk.blue(uniqueLinks)}`))
                      })
                      .catch((erro) => {
                        console.error(erro);
                      });
                  } else if (resultado.length === 0) {
                    console.log(chalk.red('\n', `\u2718 Não há links no arquivo ${chalk.underline.red(nomeDeArquivo)} \u2718`))
                  } else { 
                    printList(options.validate, resultado, nomeDeArquivo);
                  }
                })
            })
        })
    }
    else if (fs.lstatSync(path).isFile() && !path.endsWith('.md')) { 
      console.log(chalk.red('\n', `\u2718 Extensão inválida \u2718`))
    } 
    else {
      getFile(path)
        .then(links => {
          if (options.stats && options.validate) {
            checkLinks(links)
              .then(({ totalLinks, uniqueLinks, brokenLinks }) => {
                console.log(chalk.yellow(`\n\u2714 Estatísticas dos links:\n${chalk.magenta('- Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('- Unique:')} ${chalk.blue(uniqueLinks)}\n${chalk.cyan('- Broken:')} ${chalk.cyan(brokenLinks)}`))
              })
              .catch((erro) => {
                console.error(erro);
              });
          } else if (options.stats) {
            checkLinks(links)
              .then(({ totalLinks, uniqueLinks }) => {
                console.log(chalk.yellow(`\n\u2714 Estatísticas dos links: \n${chalk.magenta('- Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('- Unique:')} ${chalk.blue(uniqueLinks)}`))
              })
              .catch((erro) => {
                console.error(erro);
              });
          } else if (links.length === 0) {
            console.log(chalk.red('\n', '\u2718 Não há links no arquivo \u2718'))
          } else {
            printList(options.validate, links);
          }
        })
    } 
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`O caminho "${path}" é inválido`);
    }
    console.error(chalk.red(`Erro: ${err instanceof Error ? err.message : err}`));
  }
}

export default mdLinks;