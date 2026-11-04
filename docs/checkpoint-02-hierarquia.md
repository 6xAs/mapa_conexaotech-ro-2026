# Checkpoint 02 — Hierarquia visual e sidebar

Implementado na branch `feature/conexaotech-map-visual-v2`, a partir de `cef83c4`. Não altera produção.

## Mudanças visíveis

- Sidebar fechada desde o HTML inicial, em toda visita, com botão persistente “Explorar mapa”.
- Painel desktop expansível; painel mobile sobreposto, com fechamento, Escape, foco contido e retorno de foco. Conteúdo fechado fica inerte.
- Atalhos para Maker, Auditório, Anfiteatro 01 e Lab 01, além das duas entradas principais; centralização e realce do destino.
- Maker, auditório, anfiteatros e APGs em roxo; laboratórios em azul; entradas principais em verde; cantinas em laranja; piscina em ciano. São convenções visuais da interface.
- Tons e bordas discretos em salas sem identificação e serviços; rótulos principais com maior peso visual.
- Interface mais compacta, legenda atualizada e mapa usando toda a largura quando o painel está fechado.
- Ícones, animação leve, pausa, marcas oficiais e crédito preservados.

## Verificação

Browser plugin indisponível; usado Playwright Chromium em ferramentas temporárias fora do projeto. Nenhuma dependência foi adicionada à aplicação. A limitação de navegador dos checkpoints anteriores foi superada neste turno com permissão de rede e bibliotecas temporárias.

Testados desktop 1440×1000, celular 390×844, tela estreita 320×640, tablet 768×1024 e paisagem 844×390. Verificados: estado inicial/reload, abertura e fechamento, Escape e retorno de foco, foco contido no modal, câmera mantida ao abrir o painel, atalhos com seleção, reset, pinça via eventos de toque nativos do navegador, ausência de rolagem horizontal, textos dentro dos limites declarados e movimento reduzido. Sem erros de execução ou console nos fluxos principais.

Foi encontrado e corrigido excesso de largura no cabeçalho a 320 px. A geometria de todos os elementos da planta, os textos e as posições das ilustrações foram comparados com a base por XML e preservados. npm run check e build aprovados.

Capturas desktop, mobile e painel foram inspecionadas em comparação com a versão anterior. Comparados: espaço dedicado ao mapa, marca roxa, controles, hierarquia cromática, rótulos e apresentação do painel. Este é um refinamento de hierarquia sobre a planta existente, não a etapa de transformação isométrica.

## Próximo checkpoint

Aguardar validação desta prévia para iniciar a evolução 2.5D de construções, pisos, piscina e paisagismo. As referências isométricas citadas no prompt ainda não foram disponibilizadas. Busca, filtros e painéis gerais permanecem no checkpoint de interatividade. Não foram inventadas descrições, destinos ou rotas.
