# Estúdio de Molduras

App React (Vite) onde o usuário tira uma foto pela câmera ou envia um arquivo, escolhe uma moldura e baixa o resultado já composto, em PNG.

## Como rodar localmente

Pré-requisito: Node.js 18+ instalado.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. A câmera só funciona em `localhost` ou em conexão HTTPS — isso é exigência do navegador, não do app.

## Gerar build de produção

```bash
npm run build
```

Gera a pasta `dist/` com arquivos estáticos, prontos para subir em qualquer hospedagem (Netlify, Vercel, GitHub Pages, S3, um servidor Nginx simples, etc.). Não há backend — tudo roda no navegador do usuário, então qualquer hospedagem de arquivos estáticos serve.

```bash
npm run preview   # testa o build localmente antes de publicar
```

## Estrutura do projeto

```
src/
  components/      componentes de UI (Viewfinder, Controls, FrameStrip, etc.)
  hooks/           useCamera.js — toda a lógica de getUserMedia
  utils/canvas.js  composição da foto com a moldura no <canvas>
  data/frames.js   MANIFESTO das molduras — é aqui que se cadastra cada moldura
  assets/frames/   arquivos de imagem das molduras (PNG/SVG)
  styles/          tokens.css (cores/fontes) + global.css
```

## Como adicionar as molduras reais (quando o cliente enviar)

As molduras de demonstração (`classico`, `dourado`, `washi`) são só placeholders para o app funcionar de cara. Quando os templates definitivos chegarem:

1. Peça que os arquivos sejam **PNG com fundo transparente**, com uma "janela" vazia no centro (ou onde quer que a foto deva aparecer) — é exatamente como um porta-retrato físico: a moldura é a borda, o miolo fica vazio para a foto.
2. Salve cada arquivo em `src/assets/frames/`, por exemplo `src/assets/frames/aniversario.png`.
3. Abra `src/data/frames.js` e:
   - importe o arquivo no topo: `import aniversarioImg from '../assets/frames/aniversario.png'`
   - adicione um item no array `frames`:
     ```js
     {
       id: 'aniversario',
       name: 'Aniversário',
       desc: 'Tema de festa',
       src: aniversarioImg,
     }
     ```
4. Salve. A moldura já aparece na tira de seleção, na ordem em que foi adicionada ao array.

Não é preciso ajustar proporção manualmente — o app lê a proporção real do PNG e ajusta o canvas de composição automaticamente. Funciona tanto para molduras quadradas, quanto retrato ou paisagem.

## Upload de moldura pelo próprio usuário final

Já vem pronto: o botão "+ Adicionar minha moldura (PNG)" na tira de molduras deixa qualquer visitante carregar um PNG do próprio computador/celular e usá-lo na hora, sem precisar de nenhuma alteração de código. Essas molduras ficam disponíveis só durante a sessão (não são salvas em servidor).

## Possíveis próximos passos

Não estavam no escopo desta primeira versão, mas ficam fáceis de plugar depois, se fizer sentido:
- Zoom/arraste da foto dentro da moldura antes de baixar.
- Galeria com histórico de fotos (precisaria de backend + storage).
- Compartilhamento direto para redes sociais (Web Share API).
- Múltiplos formatos de exportação (story 9:16, quadrado, etc.) — a base de `renderComposite` já suporta qualquer proporção, só falta UI para escolher.
