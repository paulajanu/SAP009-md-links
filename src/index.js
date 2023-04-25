import fs from 'fs';
import chalk from 'chalk';
import { verificaLinks } from './validacao-stats.js';
import imprimeLista from './imprimeLista.js';
import path from 'path';

export function pegaArquivo(caminhoDoArquivo) {
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
                pegaArquivo(`${path}/${nomeDeArquivo}`)
                .then(resultado => {
                  if (options.stats && options.validate) {
                    verificaLinks(resultado)
                      .then(({ totalLinks, uniqueLinks, brokenLinks }) => {
                        console.log(chalk.yellow(`\nEstatísticas dos links do arquivo: ${chalk.underline.yellow(nomeDeArquivo)}\n${chalk.magenta('Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('Unique:')} ${chalk.blue(uniqueLinks)}\n${chalk.cyan('Broken:')} ${chalk.cyan(brokenLinks)}`))
                      })
                      .catch((erro) => {
                        console.error(erro);
                      });
                  } else if (options.stats) {
                    verificaLinks(resultado)
                      .then(({ totalLinks, uniqueLinks }) => {
                        console.log(chalk.yellow(`\nEstatísticas dos links do arquivo: ${chalk.underline.yellow(nomeDeArquivo)}\n${chalk.magenta('Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('Unique:')} ${chalk.blue(uniqueLinks)}`))
                      })
                      .catch((erro) => {
                        console.error(erro);
                      });
                  } else if (resultado.length === 0) {
                    console.log(chalk.red('\n', `\u2718 Não há links no arquivo ${chalk.underline.red(nomeDeArquivo)} \u2718`))
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
        .then(links => {
          if (options.stats && options.validate) {
            verificaLinks(links)
              .then(({ totalLinks, uniqueLinks, brokenLinks }) => {
                console.log(chalk.yellow(`\n\u2714 Estatísticas dos links:\n${chalk.magenta('- Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('- Unique:')} ${chalk.blue(uniqueLinks)}\n${chalk.cyan('- Broken:')} ${chalk.cyan(brokenLinks)}`))
              })
              .catch((erro) => {
                console.error(erro);
              });
          } else if (options.stats) {
            verificaLinks(links)
              .then(({ totalLinks, uniqueLinks }) => {
                console.log(chalk.yellow(`\n\u2714 Estatísticas dos links: \n${chalk.magenta('- Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('- Unique:')} ${chalk.blue(uniqueLinks)}`))
              })
              .catch((erro) => {
                console.error(erro);
              });
          } else if (links.length === 0) {
            console.log(chalk.red('\n', '\u2718 Não há links no arquivo \u2718'))
          } else {
            imprimeLista(options.validate, links);
          }
        })
    } 
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      throw new Error(`O caminho "${path}" é inválido`);
    }
    console.error(chalk.red(`Erro: ${erro instanceof Error ? erro.message : erro}`));
  }
}

// function mdLinks(path, options) {
//   return new Promise((resolve, reject) => {
//     try {
//       if (!path) throw new Error('Path indefinido ou nulo');
      
//       if (fs.lstatSync(path).isDirectory()) { 
//         fs.promises.readdir(path)
//           .then(arquivos => {
//               const promises = arquivos.map((nomeDeArquivo) => {
//                   return pegaArquivo(`${path}/${nomeDeArquivo}`)
//                     .then(resultado => {
//                       if (options.stats && options.validate) {
//                         return verificaLinks(resultado)
//                           .then(({ totalLinks, uniqueLinks, brokenLinks }) => {
//                             console.log(chalk.yellow(`\nEstatísticas dos links do arquivo: ${chalk.underline.yellow(nomeDeArquivo)}\n${chalk.magenta('Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('Unique:')} ${chalk.blue(uniqueLinks)}\n${chalk.cyan('Broken:')} ${chalk.cyan(brokenLinks)}`));
//                             return resultado;
//                           })
//                           .catch((erro) => {
//                             console.error(erro);
//                             return [];
//                           });
//                       } else if (options.stats) {
//                         return verificaLinks(resultado)
//                           .then(({ totalLinks, uniqueLinks }) => {
//                             console.log(chalk.yellow(`\nEstatísticas dos links do arquivo: ${chalk.underline.yellow(nomeDeArquivo)}\n${chalk.magenta('Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('Unique:')} ${chalk.blue(uniqueLinks)}`));
//                             return resultado;
//                           })
//                           .catch((erro) => {
//                             console.error(erro);
//                             return [];
//                           });
//                       } else if (resultado.length === 0) {
//                         console.log(chalk.red('\n', `\u2718 Não há links no arquivo ${chalk.underline.red(nomeDeArquivo)} \u2718`));
//                         return [];
//                       } else { 
//                         imprimeLista(options.validate, resultado, nomeDeArquivo);
//                         return resultado;
//                       }
//                     });
//               });
//               Promise.all(promises).then(results => {
//                 resolve(results.flat());
//               });
//           })
//       }
//       else if (fs.lstatSync(path).isFile() && !path.endsWith('.md')) { 
//         console.log(chalk.red('\n', `\u2718 Extensão inválida \u2718`));
//         resolve([]);
//       } 
//       else {
//         pegaArquivo(path)
//           .then(links => {
//             if (options.stats && options.validate) {
//               verificaLinks(links)
//                 .then(({ totalLinks, uniqueLinks, brokenLinks }) => {
//                   console.log(chalk.yellow(`\n\u2714 Estatísticas dos links:\n${chalk.magenta('- Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('- Unique:')} ${chalk.blue(uniqueLinks)}\n${chalk.cyan('- Broken:')} ${chalk.cyan(brokenLinks)}`));
//                   resolve(links);
//                 })
//                 .catch((erro) => {
//                   console.error(erro);
//                   resolve([]);
//                 });
//             } else if (options.stats        ) {
//               verificaLinks(links)
//                 .then(({ totalLinks, uniqueLinks }) => {
//                   console.log(chalk.yellow(`\n\u2714 Estatísticas dos links:\n${chalk.magenta('- Total:')} ${chalk.magenta(totalLinks)}\n${chalk.blue('- Unique:')} ${chalk.blue(uniqueLinks)}`));
//                   resolve(links);
//                 })
//                 .catch((erro) => {
//                   console.error(erro);
//                   resolve([]);
//                 });
//             } else if (links.length === 0) {
//               console.log(chalk.red('\n', `\u2718 Não há links no arquivo ${chalk.underline.red(path)} \u2718`));
//               resolve([]);
//             } else { 
//               imprimeLista(options.validate, links, path);
//               resolve(links);
//             }
//           })
//           .catch((erro) => {
//             console.error(erro);
//             resolve([]);
//           });
//       }
//     } catch (erro) {
//       console.error(erro);
//       reject(erro);
//     }
//   });
// }    

export default mdLinks;