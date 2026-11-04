# Checkpoint 07 — Revisão final de qualidade

Revisão executada com autorização explícita do usuário para finalizar e publicar em produção.

## Verificações aprovadas

- Build e validação estrutural: 34 pontos identificados e duas entradas principais, IDs únicos, coordenadas dentro do mapa, agenda associada somente a espaços existentes e formatos de data/hora válidos.
- Programação: 19 horários em 11 locais, sendo 18 atividades descritas e um horário sem atividade no Anfiteatro 02. A lacuna permanece sinalizada, sem horários de término presumidos.
- Fidelidade das correções: Anfiteatro 01 à direita e 02 à esquerda; banheiro indicado no segundo andar; quatro bebedouros; Lab 03 removido e Lab 02 ampliado; Labs 04/05 preservados conforme o roteiro.
- Testes funcionais em Chromium: busca por nome/identificador/atividade/palestrante, categorias, lista vazia e limpeza, programação, seleção, painéis e fechamento por teclado.
- Interações da planta: seleção de região, Elevador independente das Escadas, áreas sem identificação sem painéis, arraste sem seleção acidental e pinça por eventos de toque nativos.
- Responsividade: 1440×1000, 390×844, 320×640, 768×1024 e 844×390. Sem rolagem horizontal nos fluxos testados.
- Animações: sequência das pegadas, pausa e movimento reduzido já conferidos nos checkpoints anteriores; geometria preservada.
- Acessibilidade automática com axe-core: tela geral, sidebar, painel de programação e tela mobile. Corrigidos os contrastes dos textos auxiliares e o papel acessível do grupo de etiquetas.
- Arquivos carregados na interface somam aproximadamente 240 KB antes da compressão, sem framework ou dependências de terceiros em tempo de execução. O desenho e a programação estão incorporados no HTML, preservando a abertura independente.

## Ajustes finais

Removidos os avisos visuais de prévia/checkpoint. A interface passa a apresentar o nome do evento e a programação de 04/11. Mantidos o crédito 6xAs, as marcas originais e a sinalização de dados ausentes.

## Limites da verificação

A avaliação automática não substitui todos os testes manuais de acessibilidade. Aparelhos físicos, leitores de tela reais e navegadores além de Chromium não foram avaliados. A representação 2.5D é estilizada, sem pretensão de documentar fachadas ou alturas reais. Pavimentos não confirmados não são inventados.

O arquivo de programação é específico de 04/11/2026. Outras datas exigem novo roteiro. O horário de 18h50 do Anfiteatro 02 continua sem título e palestrante na fonte.

## Publicação

Integração da branch de refinamento em main e implantação em produção autorizadas pelo usuário nesta etapa. O resultado da implantação é conferido na Vercel e no endereço público após a integração.
