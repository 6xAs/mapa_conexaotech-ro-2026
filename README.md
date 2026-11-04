# ConexãoTech RO 2026 — Mapa interativo

Mapa em SVG baseado na planta fornecida do evento na Faculdade Unisapiens. Versão em desenvolvimento, com hierarquia visual v2 no Checkpoint 02, para conferência visual; ainda não é a versão oficial final.

## Abrir o projeto

Abra `dist/index.html` em um navegador moderno, mantendo a pasta `dist` com seus arquivos. Não é necessário instalar dependências. Para servir por HTTP, use qualquer servidor estático apontado para `dist`.

Para gerar um único HTML que contém as imagens, os dados, os estilos e o código, com Node.js 24.x:

```sh
npm run build
```

O resultado fica em `artifacts/mapa-conexaotech.html`. A pasta de artefatos não é versionada.

## Recursos atuais

- Arquitetura em SVG com coordenadas proporcionais e salas sem identificação preservadas.
- Entradas principais confirmadas: Informações e Credenciamento.
- Zoom, arraste, pinça, reenquadramento e atalhos para as entradas.
- Ilustrações vetoriais de alimentação, pipoca, computadores, Maker e piscina.
- Flutuação discreta, botão de pausa e respeito a movimento reduzido.
- Pegadas baseadas na circulação ilustrada na planta, com destaque próximo à entrada selecionada. Não são rotas calculadas ou garantia de acessibilidade.
- Logo roxo do evento com transparência e proporções preservadas.

Com o mapa em foco, use as setas para mover, +/− para zoom e Home para restaurar o enquadramento.

## Organização

- `dist/index.html`: interface e cópias incorporadas do SVG/dados, para abertura sem servidor.
- `dist/assets/map.svg`: fonte do desenho, regiões, ilustrações e pegadas.
- `dist/assets/logos/`: marcas fornecidas, preservadas sem alterações.
- `dist/data/spaces.json`: identificações, dimensões e estado de validação.
- `dist/data/circulation.json`: documentação dos trechos ilustrados.
- `dist/app.js`: navegação, gestos, ajuste de texto e controles.
- `dist/styles.css`: estilos e comportamento responsivo.
- `scripts/build.mjs`: sincronização do SVG/dados no HTML e geração independente.
- `LEIA-ME.md`: histórico do checkpoint e limites da validação.

Depois de editar o SVG ou os dados, execute `npm run build` para atualizar a cópia incorporada. Mudanças de geometria precisam ser refletidas tanto no SVG quanto nos dados dos ambientes; o build não redesenha a planta nem calcula caminhos.

## Verificar

```sh
npm run check
```

Verifica sintaxe JavaScript, dados, entradas principais e sincronização do HTML. O refinamento v2 foi validado em Chromium automatizado, com desktop, celular, tablet e paisagem. Veja `docs/checkpoint-02-hierarquia.md`. Testes em aparelhos físicos e outros navegadores permanecem pendentes.

## Próximos checkpoints

3. Revisar fidelidade, portas, contornos, circulação e posições.
4. Implementar seleção de ambientes, painéis, pesquisa e filtros.
5. Refinar a experiência e as animações.
6. Validar responsividade, acessibilidade, dados e preparar publicação no Sites.

A grafia “Whashington”, pavimentos ambíguos e o significado dos símbolos azuis da referência ainda exigem validação. Não foram inventados horários, programação ou expositores.

## Créditos e marcas

Desenvolvido e criado por [6xAs](https://my-user-profile.vercel.app).

As marcas e a planta foram fornecidas para este projeto. Este repositório não concede licença de uso das marcas ou de redistribuição desses materiais.

## Build na Vercel

A configuração versionada em `vercel.json` define `dist` como pasta de publicação e executa `node scripts/build.mjs`. O Node está fixado na série 24.x pelo `package.json`. Como não há dependências, a instalação é omitida; o build não precisa invocar npm e evita o aviso de configuração `cache-dir` observado no ambiente. Se dependências forem adicionadas, revisar essa configuração.

As branches de refinamento devem gerar apenas previews. A produção continua associada a `main`.

## Refinamento visual v2

A sidebar inicia retraída; use “Explorar mapa” para abrir as entradas, os atalhos e a legenda. No celular, o painel fecha após escolher um atalho. As cores diferenciam as prioridades sem alterar a geometria da planta. O acabamento 2.5D acrescenta volumes estilizados, materiais, vegetação e veículos nas posições indicadas pela referência. Não representa levantamento arquitetônico de alturas ou fachadas reais.

Detalhes do acabamento e verificação: `docs/checkpoint-03-acabamento-25d.md`.

## Etiquetas e tipografia

Os ambientes recebem etiquetas com símbolos de categoria conforme o espaço disponível no zoom. Clique ou use Enter/Espaço para localizar o ambiente. Arrastar sobre uma etiqueta continua movimentando o mapa. Consulte `docs/checkpoint-04-marcadores-tipografia.md` para o escopo e a validação.

## Animações

As pegadas recebem uma sequência discreta de opacidade sem deslocamento. O botão de pausa controla pegadas e ícones; movimento reduzido mantém os elementos estáticos e torna o enquadramento imediato. A seleção aproxima o ambiente suavemente e os controles manuais interrompem o movimento. Consulte `docs/checkpoint-05-animacoes.md`.
