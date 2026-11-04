# Checkpoint 03 — Acabamento 2.5D

Versão de teste sobre a hierarquia visual aprovada. A aplicação foi preservada e nenhuma dependência foi adicionada.

## Implementado

- Faces laterais sob os contornos existentes, sombras ambientais e bordas iluminadas, com maior volume nos ambientes protagonistas.
- Profundidade discreta nos blocos sem identificação, mantendo-os sem informações inventadas.
- Piso modular na circulação e textura sutil na pavimentação do estacionamento.
- Água da piscina com gradiente de profundidade, reflexos estáticos e contorno interno.
- Vegetação estilizada apenas nas faixas verdes visíveis na planta original, próximas aos estacionamentos.
- Dois veículos nas posições em que já aparecem ilustrados na referência.
- Sidebar retraída, ícones flutuantes, controles, marcas e crédito preservados.

Os volumes são uma convenção visual. Não documentam alturas reais, fachadas, portas, telhados ou janelas. O topo de cada ambiente permanece nas coordenadas originais; a extrusão é decorativa. A planta não foi inclinada globalmente para preservar leitura e alinhamento.

## Validação

Comparados por XML os contornos e rótulos dos 28 ambientes: posições e dimensões preservadas. Verificadas referências SVG e sincronização do HTML.

Playwright Chromium, via HTML independente local, em 1440×1000 e 390×844: sidebar fechada no carregamento/reload, abertura sem mudar câmera, atalhos Maker e Credenciamento com destaque, Escape e retorno de foco, modal mobile, reenquadramento, ausência de rolagem horizontal, rótulos dentro dos limites declarados e movimento reduzido. Sem erros de execução ou console nos fluxos testados.

Capturas de desktop e celular inspecionadas contra o checkpoint anterior: mudanças limitadas a materiais, sombras, extrusões e ilustrações de paisagismo/estacionamento. Interfaces e identificação dos espaços preservadas.

## Limites e próximo checkpoint

As referências isométricas citadas no prompt ainda não estão disponíveis. Esta entrega é um acabamento vetorial 2.5D estilizado baseado na planta, sem alegação de correspondência semirrealista com imagens não examinadas. Aparelhos físicos e outros navegadores não foram testados.

Após validação, avançar para marcadores e tipografia, com legibilidade por níveis de zoom. Não publicar esta branch em produção automaticamente.
