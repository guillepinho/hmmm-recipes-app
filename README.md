# Boas-vindas ao repositório do projeto App de Receitas, que chamamos de "Hmmm!"

Este projeto foi desenvolvido em equipe, durante o módulo de front-end do curso de desenvolvimento de software na Trybe, com a seguinte equipe:

SM: Guillepinho
TL: Lucas Dainez
Team:
  - Maycol Mohr
  - Leonardo Araujo
  - Henrique Rocha

Fique a vontade para contribuir e utilizar.

O app de receitas utiliza o que há de mais moderno dentro do ecossistema React: Hooks e Context API!

Nesta aplicação é possível ver, buscar, filtrar, favoritar e acompanhar o processo de preparação de receitas e drinks!

Os dados das receitas vêm de 2 APIs distintas, uma para comidas e outra para bebidas.

O layout tem como foco dispositivos móveis, então todos os protótipos vão estar desenvolvidos em telas menores (de 360px de largura).

Para visualizar o projeto: https://guillepinho.github.io/hmmm-recipes-app

## APIs utilizadas

#### `TheMealDB API`

O [TheMealDB](https://www.themealdb.com/) é um banco de dados aberto, mantido pela comunidade, com receitas e ingredients de todo o mundo.

Os end-points são bastante ricos, você pode [vê-los aqui](https://www.themealdb.com/api.php)

#### `The CockTailDB API`

Bem similar (inclusive mantida pela mesma entidade) a TheMealDB API, só que focado em bebidas.

Os end-points também são bastante ricos, você pode [vê-los aqui](https://www.thecocktaildb.com/api.php)

## Detalhes técnicos

### localStorage

O uso de `localStorage` é utilizado para que as informações não se percam caso a pessoa atualize a página.

### Bibliotecas

#### `clipboard-copy`

Para os componentes que contêm a funcionalidade de favoritar pratos ou bebidas, foi utilizada a biblioteca `clipboard-copy` para copiar as informações da receita. Essa biblioteca já vem instalada no projeto.

Para mais informações, consulte a [documentação](https://www.npmjs.com/package/clipboard-copy)

### Funcionalidades

Nesse projeto, a pessoa que estiver utilizando o app pode procurar uma receita especifica, explorar receitas baseado em diferentes critérios, favoritar e fazer as receitas entre outras funcionalidades.

As telas sofrem variações dependendo do tipo da receita (se é comida ou bebida, no caso).


#### `Tela de login`

#### `Barra de busca - Header`

#### `Menu inferior`

#### `Tela principal de receitas`

#### `Tela de detalhes de uma receita`
 
#### `Tela de receita em progresso`

#### `Tela de receitas feitas`

#### `Tela de receitas favoritas`

#### `Tela de explorar`

#### `Tela de explorar bebidas ou comidas`

#### `Tela de explorar ingredientes`

#### `Tela de explorar por local de origem/area`

#### `Tela de perfil`