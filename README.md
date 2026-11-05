# ConexãoTech RO 2026 — Mapa interativo

Mapa em SVG baseado na planta fornecida do evento na Faculdade Unisapiens. Versão com acabamento 2.5D, navegação por categorias e programação de 04/11 e 05/11, revisada para publicação.

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

## Busca e informações

Abra “Explorar mapa” para buscar por nome/identificação e filtrar categorias. Selecione na lista ou no desenho para abrir as informações disponíveis. No celular, o painel fica na parte inferior; Escape ou o botão de fechar retornam ao mapa. O zoom chega a 800%. Consulte `docs/checkpoint-06-interatividade.md`.

## Locais e pontos de água

A navegação superior e os cartões da sidebar destacam categorias de locais. Os quatro bebedouros indicados na planta têm categoria própria e podem ser buscados por “água”. O banheiro acima do Credenciamento está identificado no 2º andar. A numeração dos anfiteatros foi corrigida: 01 à direita e 02 à esquerda. Veja `docs/ajustes-locais-bebedouros.md`.

## Programação de 04/11

O roteiro fornecido foi associado a 11 espaços. Use o atalho “Programação · 04/11” ou abra um ambiente para consultar as atividades no painel existente. Títulos e palestrantes também podem ser pesquisados. Os dados ficam em `dist/data/programacao.json`; o build valida as associações e incorpora a agenda ao HTML. O horário sem atividade no Anfiteatro 02 está sinalizado. No bloco central, o Lab 03 foi removido e sua área incorporada ao Lab 02; Labs 04/05 mantidos conforme o roteiro. Veja `docs/programacao-04-11.md`.

## Revisão final

O Checkpoint 07 reúne a verificação funcional, os ajustes de contraste e a conferência de acessibilidade automática. Consulte `docs/checkpoint-07-qualidade-final.md` para o escopo e os limites dos testes.

## Programação de 05/11 e filtro de data

O filtro “Data da programação”, em “Explorar mapa”, alterna entre 04/11 e 05/11. A data padrão é 05/11. Os dados de 04/11 foram preservados integralmente em `days`, dentro de `dist/data/programacao.json`; buscas, filtro de locais com programação e painéis usam somente o dia selecionado. Locais ausentes no roteiro do dia mostram um aviso de ausência de atividade ou oficina.

O `ROTEIRO 05_11.pdf` contém 13 horários em oito locais. O Auditório tem a última atividade às 20h40. O documento informa a mesma atividade de Janus Pantoja às 19h no Anfiteatro 02 e no Lab 02; ambos os registros foram preservados, sem inferir uma correção. Lab 01, Lab 05 e APG 01 não têm programação em 05/11, mas mantêm as atividades de 04/11.

Validação desta alteração: build, check, preservação integral dos dados anteriores e testes em Chromium da troca de datas, isolamento das buscas, contagem de locais, painel sem atividade e restauração da agenda anterior, horário do Auditório e filtro em tela mobile sem rolagem horizontal.
