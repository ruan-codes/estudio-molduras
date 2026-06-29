// MANIFESTO DE MOLDURAS
// ----------------------------------------------------------------------------
// Para adicionar uma moldura real enviada pelo cliente:
// 1. Salve o arquivo (PNG, WebP ou SVG, com fundo transparente e janela vazia
//    onde a foto aparece) dentro de src/assets/frames/
//    ex: src/assets/frames/aniversario.png
// 2. Importe o arquivo no topo deste arquivo:
//    import aniversarioImg from '../assets/frames/aniversario.png'
// 3. Adicione uma entrada no array `frames` abaixo, apontando `src` para a
//    variável importada. O `ratio` é opcional — se omitido, o app usa a
//    proporção real da imagem automaticamente. O `category` é só cosmético,
//    usado para agrupar com um título na tira de seleção (ver FrameStrip.jsx).
//
// Não há limite de quantidade. A ordem do array é a ordem que aparece na
// tira de molduras na tela — frames da mesma categoria devem ficar
// agrupados em sequência pra os cabeçalhos de seção funcionarem direito.
// ----------------------------------------------------------------------------

import classicoSvg from '../assets/frames/classico.svg'
import douradoSvg from '../assets/frames/dourado.svg'
import washiSvg from '../assets/frames/washi.svg'
import natalSvg from '../assets/frames/natal.svg'
import juninaSvg from '../assets/frames/junina.svg'
import carnavalSvg from '../assets/frames/carnaval.svg'
import pascoaSvg from '../assets/frames/pascoa.svg'
import anoNovoSvg from '../assets/frames/anonovo.svg'

export const frames = [
  // --- Gerais ---------------------------------------------------------------
  {
    id: 'classico',
    name: 'Clássico',
    desc: 'Borda branca estilo polaroide',
    category: 'Gerais',
    src: classicoSvg,
  },
  {
    id: 'dourado',
    name: 'Cantos Dourados',
    desc: 'Linha fina + ornamento',
    category: 'Gerais',
    src: douradoSvg,
  },
  {
    id: 'washi',
    name: 'Fita Washi',
    desc: 'Cantos com fita colorida',
    category: 'Gerais',
    src: washiSvg,
  },

  // --- Eventos e datas comemorativas -----------------------------------------
  {
    id: 'natal',
    name: 'Natal',
    desc: 'Guirlanda de luzes e azevinho',
    category: 'Eventos',
    src: natalSvg,
  },
  {
    id: 'junina',
    name: 'Festa Junina',
    desc: 'Bandeirinhas e xadrez',
    category: 'Eventos',
    src: juninaSvg,
  },
  {
    id: 'carnaval',
    name: 'Carnaval',
    desc: 'Serpentina e confete',
    category: 'Eventos',
    src: carnavalSvg,
  },
  {
    id: 'pascoa',
    name: 'Páscoa',
    desc: 'Ovinhos em tons pastel',
    category: 'Eventos',
    src: pascoaSvg,
  },
  {
    id: 'ano-novo',
    name: 'Ano Novo',
    desc: 'Dourado com fogos de artifício',
    category: 'Eventos',
    src: anoNovoSvg,
  },

  // Exemplo de como vai ficar quando o cliente enviar os arquivos reais:
  // {
  //   id: 'aniversario',
  //   name: 'Aniversário',
  //   desc: 'Tema de festa enviado pelo cliente',
  //   category: 'Eventos',
  //   src: aniversarioImg,
  // },
]