import chalk from 'chalk';

function checkStatus (listaURLs) {
    return Promise.all(
        listaURLs.map((url) => {
        return fetch(url)
        .then(response => {
            if (response.ok) {
                return `${chalk.green('OK')} | ${chalk.green(response.status)}`
            } else {
                return `${chalk.red('FAIL')} | ${chalk.red(response.status)}`
            }
        })
        .catch(erro => {
            if (erro.cause.code === 'ENOTFOUND') {
                return chalk.red('Link não encontrado');
            } else { 
             return chalk.red('Ocorreu algum erro');
            }
        })
    })) 
}
  

function validatedList(arrLinks) {
    return checkStatus(arrLinks.map((objetoLink) => objetoLink.href))
    .then((status) => {
        return arrLinks.map((objeto, indice) => ({
            ...objeto,
            status: status[indice]
        }));
    });
}

function checkLinks(arrLinks) {
    const totalLinks = arrLinks.length;
  
    const uniqueLinks = new Set(arrLinks.map((objetoLink) => objetoLink.href)).size;
  
    return checkStatus(arrLinks.map((objetoLink) => objetoLink.href))
      .then((statusLinks) => {
        const brokenLinks = statusLinks.filter(status => status.startsWith(chalk.red('FAIL'))).length;
  
        return { totalLinks, uniqueLinks, brokenLinks };
      })
      .catch((erro) => {
        console.error(erro);
      });
}

export {checkStatus, validatedList, checkLinks}