# Checkpoint 06 — Busca, filtros e informações

Implementado na branch de refinamento, mantendo a sidebar retraída no carregamento e sem publicar em produção.

## Recursos

- Busca por nomes e identificadores, ignorando acentos, espaços e zeros de numeração; aceita variações como “laboratório 02”, “lab02” e “apg2”.
- Filtros pelas categorias presentes nos registros da planta, contagem de resultados, mensagem de lista vazia e limpeza da busca/filtro.
- Lista com os 31 pontos identificados: os 28 registros anteriores e os dois pontos de estacionamento/escadas que já estavam desenhados. Os estacionamentos mantêm o mesmo nome, diferenciados apenas pela posição na planta; não foram criados setores oficiais.
- Seleção por regiões da planta, etiquetas, lista e teclado. Áreas sem identificação permanecem apenas como arquitetura, sem painéis.
- Painel com nome, categoria, pavimento quando informado, identificação e observações disponíveis. Dados ausentes não foram inventados. A grafia ainda pendente da Sala Whashington continua sinalizada.
- Painel lateral no desktop e painel inferior não modal no celular, permitindo explorar o mapa. O mapa e seus controles reservam espaço acima do painel inferior.
- Câmara adaptada à proporção real da área disponível; o centro é preservado ao redimensionar. O zoom de seleção considera as dimensões do espaço e a tela. Limite de aproximação ampliado para 800% para leitura no celular.
- Foco visível, anúncio de seleção, Escape para fechar, retorno de foco e navegação no formulário com teclado. Arraste e pinça não abrem painéis acidentalmente.

## Dados e desenho

Escadas e estacionamentos foram associados aos elementos que já existiam no SVG. Os retângulos/polígono transparentes são áreas de interação, não novos contornos oficiais. A área de toque das escadas exclui o Elevador, evitando seleção errada. A aparência das escadas foi preservada explicitamente após reorganizar o grupo SVG.

Os nomes e cores do acabamento anterior foram mantidos. O filtro reduz o destaque cromático dos demais espaços, mas conserva a arquitetura e os textos. Selecionar um espaço fora do filtro limpa a busca/filtro para torná-lo visível na lista.

## Validação

Playwright Chromium em desktop 1440×1000, celular 390×844, tela estreita 320×640, tablet 768×1024 e paisagem 844×390:

- Busca com e sem acento, aliases, numeração e filtro de cinco laboratórios.
- Estado vazio, limpeza, listagem completa e distinção dos dois estacionamentos.
- Painéis com Auditório no 2º andar, Lab 04 sem pavimento inventado e aviso de grafia da Sala Whashington.
- Centro do espaço selecionado dentro da área utilizável do mapa, sem ficar sob o painel inferior.
- Seleção por região e teclado, fechamento por Escape, arraste sem seleção acidental e pinça via eventos de toque nativos do navegador.
- Salas sem identificação sem painel e Elevador selecionável sem interceptação pelas Escadas.
- Ausência de rolagem horizontal e de erros de execução/console nos fluxos testados.

Uma tentativa de clicar diretamente no retângulo do Maker foi interceptada pela própria etiqueta, que corretamente ocupa a camada superior. O teste de região foi ajustado para um ponto exposto do mesmo ambiente; não se alterou a interface para contornar o teste. A revisão visual encontrou e corrigiu perda de preenchimento das escadas após a mudança de grupo.

npm run check e build aprovados. Capturas da busca, do filtro e dos painéis desktop/mobile foram inspecionadas. Sem dependências adicionais na aplicação.

## Próxima etapa

Após validação, realizar o Checkpoint 07: revisão final de legibilidade, fidelidade, acessibilidade, desempenho e compatibilidade. Aparelhos físicos e outros navegadores continuam pendentes. Os símbolos de acessibilidade e pavimentos ambíguos da referência ainda exigem confirmação da organização. Produção não foi atualizada.
