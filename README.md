# ConexãoTech RO 2026 — Mapa interativo

Mapa em SVG baseado na planta fornecida do evento na Faculdade Unisapiens. Versão em desenvolvimento, no Checkpoint 02, para conferência visual; ainda não é a versão oficial final.

## Abrir o projeto

Abra `dist/index.html` em um navegador moderno, mantendo a pasta `dist` com seus arquivos. Não é necessário instalar dependências. Para servir por HTTP, use qualquer servidor estático apontado para `dist`.

Para gerar um único HTML que contém as imagens, os dados, os estilos e o código, com Node.js 20 ou superior:

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

Verifica sintaxe JavaScript, dados, entradas principais e sincronização do HTML. A conferência visual em desktop/celular e os testes em dispositivos reais continuam pendentes por limitações do ambiente de desenvolvimento.

## Próximos checkpoints

3. Revisar fidelidade, portas, contornos, circulação e posições.
4. Implementar seleção de ambientes, painéis, pesquisa e filtros.
5. Refinar a experiência e as animações.
6. Validar responsividade, acessibilidade, dados e preparar publicação no Sites.

A grafia “Whashington”, pavimentos ambíguos e o significado dos símbolos azuis da referência ainda exigem validação. Não foram inventados horários, programação ou expositores.

## Créditos e marcas

Desenvolvido e criado por [6xAs](https://my-user-profile.vercel.app).

As marcas e a planta foram fornecidas para este projeto. Este repositório não concede licença de uso das marcas ou de redistribuição desses materiais.
