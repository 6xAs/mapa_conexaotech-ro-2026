# Checkpoint 05 — Animações e dinamismo

Branch: feature/conexaotech-map-visual-v2. Sem alterações em produção.

## Implementado

- Animação contínua dos 49 pares de pegadas, com defasagem progressiva por trecho. A onda altera somente a opacidade; nenhum desenho sai de sua posição original.
- Destaque verde nos trechos associados à entrada selecionada, mantendo o significado ilustrativo da circulação. Não são rotas calculadas, de evacuação ou acessibilidade.
- Pausa e retomada compartilhadas entre pegadas, ícones flutuantes e efeitos decorativos. Abas inativas suspendem os movimentos.
- Aproximação e centralização por seleção com interpolação de 260 ms, interrompida por arraste, zoom manual, teclado ou reenquadramento.
- Movimento reduzido aplica enquadramento imediato e desativa as animações.
- Feedback breve nos contornos e etiquetas selecionados, entrada suave dos painéis e resposta discreta dos controles ao pressionar.
- Medidas das etiquetas reutilizadas entre quadros para evitar novas leituras de largura durante cada atualização da câmera.

## Validação

Playwright Chromium em 1440×1000 e 390×844. Conferidos: animação aplicada a todos os pares, defasagens em ordem crescente, variação de opacidade entre passos, pausa estável, retomada, seleção com aproximação gradual, seleção imediata com movimento reduzido/pausa, interrupção por reset, sidebar e seleção mobile. Sem erros de execução ou console nos fluxos testados.

Comparação XML com a versão anterior confirmou que a geometria e os textos de toda a camada camera permanecem iguais. As pegadas preservam transformações e posições antes e depois da animação. Capturas desktop e mobile inspecionadas; a animação foi verificada por seus estados no navegador, não apenas pelas imagens estáticas. npm run check e build aprovados.

## Próximo checkpoint

Após validação, implementar pesquisa por nomes/identificadores, filtros por categoria, seleção geral e painéis informativos, com revisão dos gestos e adaptação ao celular. Aparelhos físicos e outros navegadores continuam para a qualidade final.
