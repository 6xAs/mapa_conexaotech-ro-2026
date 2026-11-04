# Checkpoint 04 — Marcadores e tipografia

Etapa implementada na branch de refinamento, preservando o acabamento 2.5D aprovado e a geometria da planta.

## Entrega

- Etiquetas vetoriais com fundo claro, borda e símbolo por categoria, estados de hover, foco e seleção.
- Família tipográfica alinhada à interface, com fonte do sistema como fallback, e distinção entre nome e informação complementar.
- Tamanho de texto estável em pixels de tela durante o zoom. Os pontos das etiquetas usam o mesmo sistema de coordenadas SVG do mapa e são derivados dos rótulos existentes.
- Visibilidade progressiva: uma etiqueta só aparece se couber no ambiente e inteiramente na área visível. Os nomes originais permanecem visíveis quando não há espaço; nenhuma sala ou informação de serviço é removida.
- Etiquetas visíveis permitem localizar o ambiente por clique, Enter ou Espaço. O destino recebe realce e centralização, com anúncio textual para leitores de tela.
- Arrastar a partir de uma etiqueta continua movendo o mapa; deslocamentos superiores a seis pixels não selecionam um destino.
- Etiquetas ocultas não entram na navegação por teclado. Os marcadores usam grupo acessível, estado aria-pressed e título descritivo.

## Validação

Playwright Chromium em HTML independente, com desktop 1440×1000, celular 390×844, tela estreita 320×640 e paisagem 844×390. Verificados visibilidade progressiva, conteúdo dentro das etiquetas, seleção por clique e teclado, anúncio de destino, arraste iniciado sobre marcador sem seleção acidental, reset, estado de foco e ausência de rolagem horizontal. Regressão dos controles, sidebar, atalhos, enquadramento e movimento reduzido em desktop/celular. Sem erros de execução ou console nos fluxos testados.

Capturas do mapa geral, detalhe do Auditório e zoom mobile inspecionadas contra a versão anterior. Conferidos nomes, contraste por categoria, legibilidade, proporções da interface, ícones e preservação dos volumes. A planta SVG, dimensões dos ambientes e dados oficiais não foram alterados nesta etapa.

A família Inter não foi baixada ou incorporada: a pilha de fontes da interface é compartilhada, com fallbacks locais. Não foram adicionadas dependências à aplicação.

## Próxima etapa

Após aprovação da prévia, animar as pegadas em sequência e refinar as microinterações. Busca, filtros e painéis gerais continuam no checkpoint de interatividade. Testes em aparelhos físicos e outros navegadores permanecem para a revisão final. Não publicar esta branch em produção automaticamente.
