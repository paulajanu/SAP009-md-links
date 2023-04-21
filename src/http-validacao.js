import chalk from 'chalk';

function extraiLinks(arrLinks) {
    return arrLinks.map((objetoLink) => objetoLink.href)
}

function checaStatus (listaURLs) {
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
        //.then(response => `${response.status} - ${response.statusText}`)
        .catch(erro => {
            if (erro.cause.code === 'ENOTFOUND') {
                return chalk.red('Link não encontrado');
            } else { 
             return chalk.red('Ocorreu algum erro');
            }
        })
    }))
}
  
// function manejaErros (erro) {
//     if (erro.cause.code === 'ENOTFOUND') {
//         return 'Link não encontrado';
//     } else {
//      return 'Ocorreu algum erro';
//     }
// }

export default function listaValidada (listaDeLinks) {
    const links = extraiLinks(listaDeLinks);
    return checaStatus(links)
    .then((status) => {
        return listaDeLinks.map((objeto, indice) => ({
            ...objeto,
            status: status[indice]
        }));
    });
}
  