# Correções de locais e navegação

Ajustes solicitados pelo usuário após a prévia do Checkpoint 06. Mantidos na branch de refinamento, sem publicação em produção.

- Banheiro acima do Credenciamento: confirmado no 2º andar, no mesmo plano do Auditório e da Sala Whashington. A informação aparece no desenho, na lista de resultados e no painel. Categoria Banheiros separada de Serviços.
- Anfiteatro 01 à direita e Anfiteatro 02 à esquerda: identificadores, nomes, dados e alvos de seleção corrigidos. APGs preservadas.
- Quatro bebedouros incorporados nos pontos dos símbolos azuis da planta original, agora identificados pelo usuário como fontes de água. Não se atribuiu pavimento aos pontos sem confirmação específica.
- Bebedouros com símbolo de gota, categoria própria, descrição de posição, seleção e busca por “água”, “fonte de água” ou “bebedouro”. Os nomes são iguais; a posição diferencia os quatro resultados sem criar numeração oficial.
- Faixa de atalhos visível no topo para Bebedouros, Banheiros, Anfiteatros, Laboratórios, Auditório, Entradas e Todos os locais. A faixa pode ser rolada horizontalmente em telas pequenas.
- Sidebar com cartões de categorias e contagens, preservando seu estado inicial retraído. As categorias abrem a lista filtrada; cada local centraliza o mapa e abre suas informações.

## Verificação

Build e npm run check aprovados. Playwright Chromium em 1440×1000, 390×844, 320×640, 768×1024 e 844×390: posições dos anfiteatros, pavimento do banheiro, quatro pontos de água, busca por aliases, filtro de banheiros, contagens, navegação pelos atalhos e painéis. Sem erros de execução/console ou rolagem horizontal nos fluxos testados.

Capturas do mapa geral, do banheiro no segundo andar, da categoria Bebedouros, do detalhe de um ponto de água e da visualização mobile foram inspecionadas. O desenho original fornecido segue como referência espacial, com as correções explícitas do usuário prevalecendo sobre a numeração anterior dos anfiteatros.
