//import chalk from 'chalk';

function extraiLinks(arrLinks) {
    return arrLinks.map((objetoLink) => objetoLink.href)
}

function checaStatus (listaURLs) {
    return Promise.all(
        listaURLs.map((url) => {
        return fetch(url)
        .then(response => `${response.status} - ${response.statusText}`)
        .catch(erro => manejaErros(erro))
    })
  )
}
  
function manejaErros (erro) {
    if (erro.cause.code === 'ENOTFOUND') {
        return 'Link não encontrado';
    } else {
     return 'Ocorreu algum erro';
    }
}

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
  