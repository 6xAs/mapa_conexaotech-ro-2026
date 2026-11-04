# Refinamento visual v2 — Checkpoint 01: diagnóstico

Status: diagnóstico concluído, aguardando aprovação para implementação. Esta etapa altera somente documentação. O início com sidebar retraída é um requisito confirmado pelo usuário; ainda não foi implementado neste checkpoint.

## Base e isolamento

- Repositório: https://github.com/6xAs/mapa_conexaotech-ro-2026
- Branch de refinamento: `feature/conexaotech-map-visual-v2`.
- Base remota: `66ddb0f6d080aa1e018d832d3e4b9dc830e7e8b5`, a mesma versão publicada em produção.
- Sem alterações locais pendentes antes do trabalho.
- O histórico de main local é anterior ao envio inicial por API; a nova branch local foi criada com os objetos correspondentes ao histórico remoto e a mesma árvore de arquivos, preservando main local.
- Produção: https://mapaconexaotech-ro-2026.vercel.app. Não realizar merge nem publicação em produção nesta sequência sem solicitação explícita.

## Estrutura inspecionada

| Arquivo | Responsabilidade | Diagnóstico |
| --- | --- | --- |
| dist/index.html | Cabeçalho, sidebar, entradas, legenda, mapa, controles e crédito | Sidebar sempre aberta em desktop. Mobile transforma o aside em display:contents e mantém os acessos acima do mapa. Sem botão para abrir/fechar. |
| dist/styles.css | Interface, responsividade e estados | Grade lateral fixa de 270/300 px. Breakpoint mobile em 700 px. Seletores compactados e ajustes cumulativos dificultam a manutenção. |
| dist/app.js | Zoom, pan, gestos, atalhos, ajuda e animações | Pointer Events, coordenadas via getScreenCTM e viewBox compartilhado. Não existem busca, filtros nem seleção genérica das salas. |
| dist/assets/map.svg | Planta, rótulos, marcas, ilustrações e pegadas | Desenho predominantemente plano. Geometria e textos explícitos, sem sistema de regiões interativas por ambiente. |
| dist/data/spaces.json | 28 registros de ambientes e serviços | IDs, categoria, dimensões e validação; duas entradas principais confirmadas. Estacionamentos e escadas existem graficamente, mas não têm registros próprios para pesquisa. |
| dist/data/circulation.json | Trechos documentados das pegadas | O SVG contém uma cópia já desenhada desses percursos; mudanças precisam manter os dois arquivos consistentes. |
| scripts/build.mjs | Sincronização dos dados e SVG no HTML e geração independente | Preservar: permite abertura sem servidor. Validação estrutural não substitui testes de navegador. |
| package.json | Build e check | Sem dependências de terceiros. Node.js >=20; implantação atual realizada com Node.js 24. |

## Assets e referências

Disponíveis no projeto: planta SVG, dez instâncias de ilustrações vetoriais (cantinas, pipoca, computadores, Maker e piscina), pegadas vetoriais e marcas PNG fornecidas. O logo roxo é a versão atual; versões branca e cinza permanecem como originais. A marca Unisapiens está preservada.

A planta raster original foi examinada durante o desenvolvimento e permanece a fonte para a disposição espacial. A captura enviada anteriormente mostrou o texto da Sala Whashington ultrapassando a sala; a revisão atual já divide esse nome em linhas e limita a largura dos rótulos.

As duas imagens isométricas mencionadas no novo prompt não acompanham o material disponível nesta solicitação. Não é possível afirmar correspondência estética com uma imagem ainda não examinada. A direção 2.5D descrita pode ser planejada; a comparação com a referência principal permanece pendente de seu fornecimento.

Não gerar fachadas, portas, janelas ou vegetação como se fossem documentação factual do edifício. Vegetação só deve ser acrescentada nas faixas paisagísticas reconhecíveis da planta, sem cobrir circulação ou nomes. Salas sem identificação continuam presentes, sem nomes ou informações inventadas.

## Recursos existentes a preservar

- Zoom de 100% a 500%, arraste, pinça e redefinição do enquadramento.
- Navegação por teclado no mapa e foco visível.
- Centralização nos dois acessos principais, Informações e Credenciamento.
- Destaque dos trechos de circulação próximos à entrada selecionada.
- Flutuação suave das ilustrações, controle de pausa e movimento reduzido.
- Marcas oficiais, crédito e link 6xAs.
- Um único sistema de coordenadas para planta, ícones e pegadas.

Esses recursos foram identificados por inspeção do código. Seu funcionamento visual completo em diferentes navegadores e dispositivos ainda precisa de teste.

## Lacunas e prioridades

1. **Sidebar retraída por padrão:** implementar estado inicial fechado no HTML/CSS, antes da execução do JavaScript, evitando abertura momentânea no carregamento. Botão persistente “Explorar mapa”, aria-expanded/aria-controls, suporte a teclado e Escape. Em desktop, expansão controlada; em celular, painel sobreposto com fechamento e retorno de foco. Conteúdo fechado não pode receber foco. Abrir/fechar preserva a região central e o zoom da câmera. Não persistir automaticamente um estado aberto entre visitas.
2. **Hierarquia:** Maker, auditório, anfiteatros, APGs, laboratórios e acessos precisam de contraste diferenciado. Informações continua marcada como entrada principal por confirmação anterior, mesmo sendo serviço de apoio na hierarquia do prompt. Cobertura não será apresentada como palco ou área de atividades sem confirmação.
3. **Legibilidade:** fitLabels atualmente pode reduzir demais a fonte para caber. Preferir quebras e níveis de detalhe, preservando nomes principais. No celular, o enquadramento completo torna rótulos pequenos; a solução deve combinar aproximação e informações HTML acessíveis.
4. **Interações:** criar regiões SVG identificadas e seleção por toque/teclado, sem transformar arrastes em cliques. Conectar busca, filtros e painel aos dados reais. Dar IDs aos elementos já desenhados que ainda não estão no inventário pesquisável; não inventar novos locais.
5. **Profundidade:** sombras, volumes discretos e materiais podem ser adicionados sem alterar o contorno-base. Evitar inclinação global da planta: ela reduz leitura e exige transformar rótulos e seleção. Preferir extrusão 2.5D localizada sobre as mesmas coordenadas.
6. **Pegadas:** hoje apenas os trechos ativos recebem variação de opacidade; falta uma sequência contínua e ordenada em cada percurso. Implementar tempos positivos/negativos coerentes por passo, sem deslocar as marcas, preservando pausa e movimento reduzido. Não apresentá-las como evacuação, trajeto acessível ou cálculo de rota.
7. **Arquitetura:** separar estado de navegação, sidebar, seleção e filtros em módulos pequenos quando necessário, mantendo JavaScript nativo. Evitar repetição manual de coordenadas entre SVG e JSON para novos marcadores. Manter o fluxo de build que incorpora o desenho ao HTML.

## Viabilidade técnica

| Mudança | Abordagem proposta | Novos gráficos necessários? |
| --- | --- | --- |
| Sidebar retraída, busca, filtros e painéis | HTML semântico, CSS responsivo e estado JavaScript | Não |
| Hierarquia cromática e tipografia | Tokens roxo, azul, verde, laranja, ciano e cinza; contraste verificado | Não; as cores são convenções da interface, não categorias oficiais |
| Marcadores e áreas selecionáveis | Grupos SVG com IDs ligados aos registros; foco/seleção consistentes | Não para símbolos simples |
| Piscina e pisos | Gradientes SVG, reflexos estáticos e padrões leves | Não |
| Sombras e volume | Formas SVG deslocadas sob o contorno, luz coerente e filtros limitados | Não para um acabamento 2.5D vetorial |
| Árvores e veículos | Pequenos símbolos vetoriais nas posições permitidas pela referência | Não para uma representação estilizada |
| Semirrealismo específico da referência | Comparação e eventual ilustração otimizada, mantendo interação vetorial | Exige primeiro as referências isométricas; novos assets só se a estética não puder ser atingida com SVG |
| Animação sequencial das pegadas | CSS opacity com defasagem por passo | Não |

Não há justificativa atual para adicionar engine 3D, GSAP ou dependências de animação. Inter é declarada, mas não está empacotada; o navegador utiliza uma fonte do sistema se ela não estiver instalada. Uma família local licenciada pode ser avaliada no checkpoint tipográfico.

## Sequência proposta para aprovação

1. **Este checkpoint — diagnóstico:** branch e documento; sem alterações de interface.
2. **Hierarquia visual:** incluir o ajuste explícito da sidebar retraída por padrão e aplicar os níveis de destaque. Validar expansão/recolhimento em desktop e mobile antes de avançar.
3. **Evolução 2.5D:** refinar protagonistas, piscina, pavimentação, estacionamento e paisagismo reconhecido; manter a posição de todas as estruturas.
4. **Marcadores e tipografia:** padronizar ícones, textos e níveis de detalhe sem esconder informações essenciais.
5. **Animações:** sequência das pegadas e microinterações com pausa e movimento reduzido.
6. **Interatividade e responsividade:** completar pesquisa, filtros, seleção e painel lateral/bottom sheet; testar gestos, teclado e orientação.
7. **Qualidade final:** comparar planta e referências, testar navegadores, revisar dados e desempenho.

Cada etapa terá commit próprio, verificações disponíveis, resumo, preview na Vercel quando houver mudanças visuais e aprovação antes da próxima. Previews devem usar target preview e esta branch. Não criar outro projeto Vercel ou publicar em produção automaticamente.

## Verificações e pendências

- Conferidos o estado limpo da árvore local, a versão de main remota, o código, os dados e os assets.
- npm run check e npm run build disponíveis para validar a base e a sincronização dos arquivos.
- Neste checkpoint não há uma nova visualização para comparar; o mapa permanece idêntico ao publicado.
- Testes visuais anteriores ficaram bloqueados pelo ambiente: runtime Node REPL não reconhece o caminho local e não há navegador automatizado utilizável. Reavaliar disponibilidade ao iniciar a implementação; não declarar gestos ou responsividade visualmente aprovados sem teste.
- Solicitar as referências isométricas ausentes para comparação estética antes do Checkpoint 03.
- Continuam pendentes a grafia “Whashington”, os pavimentos ambíguos e a interpretação dos símbolos de acessibilidade.
