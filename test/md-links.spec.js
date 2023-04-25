import fs from 'fs';
import chalk from 'chalk';
import { pegaArquivo } from "../src/index.js";
import { jest } from '@jest/globals';
import mdLinks from '../src/index.js';
import imprimeLista from '../src/imprimeLista.js';
import { listaValidada } from '../src/validacao-stats.js';
import { verificaLinks } from '../src/validacao-stats.js';
import { checaStatus } from '../src/validacao-stats.js';

describe('pegaArquivo', () => {
  it('deve ser uma função', () => {
    expect(typeof pegaArquivo).toBe('function');
  });
  
  it('Deve retornar um array de objetos com as informações de links do arquivo', async () => {
    const caminhoDoArquivo = 'arquivo-teste.md';
    const conteudoDoArquivo = '[Google](https://www.google.com)';
    jest.spyOn(fs.promises, 'readFile')
      .mockImplementation(() => Promise.resolve(conteudoDoArquivo));
    const resultado = await pegaArquivo(caminhoDoArquivo);
    const resultadoEsperado = [
      {
        href: 'https://www.google.com',
        text: 'Google',
        file: caminhoDoArquivo,
      },
    ];
    expect(resultado).toEqual(resultadoEsperado);
  });

  it('Deve retornar um erro caso o arquivo não exista', async () => {
    const caminhoDoArquivo = 'arquivo-inexistente.md';
    const mensagemDeErro = `- ✘ Não existe arquivo no diretório ✘`;
    jest.spyOn(fs.promises, 'readFile')
      .mockImplementation(() => Promise.reject(new Error('Arquivo não encontrado')));
    await expect(pegaArquivo(caminhoDoArquivo)).rejects.toThrow(mensagemDeErro);
  });
});

describe('imprimeLista', () => {
  it('deve imprimir lista de links válidos', async () => {
    const valida = true;
    const resultado = [      { text: 'Link 1', href: 'http://www.link1.com', file: 'file1', status: 200 },      { text: 'Link 2', href: 'http://www.link2.com', file: 'file2', status: 404 }    ];
    const identificador = 'Identificador';

    console.log = jest.fn();

    await imprimeLista(valida, resultado, identificador);

    if (console.log.mock.calls.length > 0) {
      expect(console.log.mock.calls[0][0]).toContain(`Lista de links válidos:`);
      expect(console.log.mock.calls[0][0]).toContain(identificador);
      expect(console.log.mock.calls[1][0]).toContain(`file1 | http://www.link1.com | 200 | Link 1`);
      expect(console.log.mock.calls[2][0]).toContain(`file2 | http://www.link2.com | 404 | Link 2`);
    }
  });

  it('deve imprimir lista de links inválidos', async () => {
    const valida = false;
    const resultado = [{ text: 'Link 1', href: 'http://www.link1.com', file: 'file1.md' }, { text: 'Link 2', href: 'http://www.link2.com', file: 'file2.md' },];
    const identificador = 'Identificador';
  
    await imprimeLista(valida, resultado, identificador);
  
    expect(console.log.mock.calls.length).toBe(resultado.length + 1);
    expect(console.log.mock.calls[0][0]).toContain(`Lista de links:`);
    expect(console.log.mock.calls[0][0]).toContain(identificador);
    expect(console.log.mock.calls[1][0]).toContain(`file1 | http://www.link1.com | Link 1`);
    expect(console.log.mock.calls[2][0]).toContain(`file2 | http://www.link2.com | Link 2`);
  });
});

describe('listaValidada', () => {
  it('deve retornar uma promessa', () => {
    const resultado = listaValidada([{ href: 'http://google.com' }]);
    expect(resultado).toBeInstanceOf(Promise);
  });

  it('deve retornar um array de objetos com o atributo status atualizado', () => {
    const links = [
      { href: 'http://google.com' },
      { href: 'http://facebook.com' },
      { href: 'http://linkedin.com' },
    ];

    return listaValidada(links).then((resultado) => {
      expect(resultado).toBeInstanceOf(Array);

      resultado.forEach((item) => {
        expect(item).toHaveProperty('href');
        expect(item).toHaveProperty('status');
      });
    });
  });
});

describe('verificaLinks', () => {
  it('deve retornar uma promessa', () => {
    const resultado = verificaLinks([{ href: 'http://google.com' }]);
    expect(resultado).toBeInstanceOf(Promise);
  });

  it('deve retornar um objeto com as propriedades totalLinks, uniqueLinks e brokenLinks', () => {
    const links = [
      { href: 'http://google.com' },
      { href: 'http://facebook.com' },
      { href: 'http://linkedin.com' },
    ];

    return verificaLinks(links).then((resultado) => {
      expect(resultado).toHaveProperty('totalLinks');
      expect(resultado).toHaveProperty('uniqueLinks');
      expect(resultado).toHaveProperty('brokenLinks');
    });
  });

  it('deve lidar corretamente com erros', () => {
    const links = [];

    return verificaLinks(links).catch((erro) => {
      expect(erro).toBeInstanceOf(Error);
    });
  });
});

describe('checaStatus', () => {
  it('verifica se todas as URLs estão OK', async () => {
    const urls = ['https://www.google.com', 'https://www.facebook.com'];
    const resultado = await checaStatus(urls);
    expect(resultado).toEqual([`${chalk.green('OK')} | ${chalk.green('200')}`, `${chalk.green('OK')} | ${chalk.green('200')}`]);
  });
});


describe('mdLinks', () => {
  
  it('mdLinks deve ser uma função', () => {
    expect(typeof mdLinks).toBe('function');
  });

  test('mdLinks deve lançar um erro se o caminho for inválido', () => {
    expect(() => mdLinks('caminho/inválido')).toThrowError(/O caminho "caminho\/inválido" é inválido/);
  });
});
