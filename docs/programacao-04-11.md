# Programação de 04/11 e alteração dos laboratórios

Fonte: ROTEIRO 04_11.pdf, duas páginas fornecidas pelo usuário. O usuário confirmou tratar-se do dia 04/11; a programação foi registrada como 2026-11-04 no contexto do evento de 2026. O original foi preservado.

O PDF usa fontes Type 3 sem mapeamento textual legível. As páginas foram renderizadas e conferidas visualmente antes da transcrição. Nenhuma instrução do documento foi executada; ele foi utilizado somente como fonte das atividades.

## Correspondência

| Local do roteiro | Espaço do mapa | Horários |
| --- | --- | --- |
| AUDITÓRIO | Auditório | 18h50, 19h55, 21h00 |
| SALA WASHINGTON | Sala Washington, mantendo o identificador interno anterior | 18h50, 19h55, 21h00 |
| ANFITEATRO 1 | Anfiteatro 01, à direita | 18h50, 19h55, 21h00 |
| ANFITEATRO 2 | Anfiteatro 02, à esquerda | 18h50 sem conteúdo no roteiro; 19h55 e 21h00 com atividades |
| LAB 1 | Lab 01 | 19h00 |
| LAB 2 | Lab 02 ampliado | 19h00 |
| LAB 4 | Lab 04 | 19h00 |
| LAB 5 | Lab 05 | 19h00 |
| ESPAÇO MAKER | Espaço Maker | 19h00 |
| APG1 | APG 01 | 19h00 |
| APG2 | APG02 | 19h00 |

São 19 horários em 11 espaços, com 18 atividades descritas e um horário sem título/palestrante. Não foram inferidos horários de término. Os títulos e palestrantes estão em dist/data/programacao.json, separados do desenho, com a página e seção de origem.

## Alteração espacial

Removido Lab 03 do bloco central e dos dados pesquisáveis. Lab 02 passa de x=851/largura=60 para x=800/largura=111, absorvendo a área anterior do Lab 03 sem alterar o Lab 01. O computador do Lab 03 foi removido e o ícone do Lab 02 foi redimensionado/reposicionado. Os Labs 04 e 05 foram mantidos porque ambos possuem atividades no roteiro fornecido.

O roteiro confirma a grafia Sala Washington; o nome foi padronizado no mapa e na navegação. A grafia anterior Whashington permanece como alias de busca, sem mudar o identificador interno e as associações existentes.

## Interface e verificação

Programação exibida no painel informativo já existente, organizada cronologicamente, com data 04/11, hora inicial, título e palestrante(s). O Anfiteatro 02 às 18h50 informa explicitamente a lacuna do roteiro. A programação não é atribuída a locais sem atividades na fonte.

Atalho “Programação · 04/11” e filtro de locais com programação; busca estendida a títulos e palestrantes. Buscas completas por identificadores numéricos são resolvidas pelos IDs dos espaços, sem confundir números com horários das atividades.

Build valida os vínculos de cada atividade com um espaço existente, formatos de data/hora, palestrantes e lacunas sinalizadas. A programação é incorporada ao HTML independente junto com os demais dados.

Playwright Chromium: 19 horários/11 locais, agenda do Auditório, lacuna do Anfiteatro 02, busca por Anderson Seixas e abertura do Lab 05, palestrantes do APG1, exclusão do Lab 03 e quatro laboratórios restantes, ampliação do Lab 02, Sala Washington, locais sem programação e responsividade em 1440×1000, 390×844, 320×640, 768×1024 e 844×390. Sem erros de execução/console ou rolagem horizontal nos fluxos testados. Capturas desktop e mobile inspecionadas.

Mudanças apenas na branch de testes. Não houve merge nem publicação em produção.
