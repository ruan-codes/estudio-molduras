// MANIFESTO DE MOLDURAS
// ----------------------------------------------------------------------------
// Para adicionar uma moldura real enviada pelo cliente:
// 1. Salve o arquivo PNG (fundo transparente, janela vazia onde a foto aparece)
//    dentro de src/assets/frames/   ex: src/assets/frames/aniversario.png
// 2. Importe o arquivo no topo deste arquivo:
//    import aniversarioImg from '../assets/frames/aniversario.png'
// 3. Adicione uma entrada no array `frames` abaixo, apontando `src` para a
//    variável importada. O `ratio` é opcional — se omitido, o app usa a
//    proporção real do PNG automaticamente.
//
// Não há limite de quantidade. A ordem do array é a ordem que aparece na
// tira de molduras na tela.
// ----------------------------------------------------------------------------

import classicoSvg from '../assets/frames/classico.svg'
import douradoSvg from '../assets/frames/dourado.svg'
import washiSvg from '../assets/frames/washi.svg'

export const frames = [
  {
    id: 'classico',
    name: 'Clássico',
    desc: 'Borda branca estilo polaroide',
    src: classicoSvg,
  },
  {
    id: 'dourado',
    name: 'Cantos Dourados',
    desc: 'Linha fina + ornamento',
    src: douradoSvg,
  },
  {
    id: 'washi',
    name: 'Fita Washi',
    desc: 'Cantos com fita colorida',
    src: washiSvg,
  },

  // Exemplo de como vai ficar quando o cliente enviar os arquivos reais:
  // {
  //   id: 'aniversario',
  //   name: 'Aniversário',
  //   desc: 'Tema de festa enviado pelo cliente',
  //   src: aniversarioImg,
  // },
]
