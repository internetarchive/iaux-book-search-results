[![Build Status](https://travis-ci.com/internetarchive/iaux-book-search-results.svg?branch=master)](https://travis-ci.com/internetarchive/iaux-book-search-results)
[![codecov](https://codecov.io/gh/internetarchive/iaux-book-search-results/branch/master/graph/badge.svg)](https://codecov.io/gh/internetarchive/iaux-book-search-results)

# \<ia-book-search-results>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
npm i ia-book-search-results
```
or
```bash
yarn add @internetarchive/ia-menu-slider
```

## Usage
```html
<script type="module">
  import 'ia-book-search-results/ia-book-search-results.js';
</script>

<ia-book-search-results .query='bristol'></ia-book-search-results>
```

Supply the element with an optional array of search results to immediately
render. Each result can have these properties:

```js
{
  title: 'Book title', // The item's title
  cover: '//archive.org/img/cover.jpg', // The item's cover image
  hits: ['Hello {{{world}}}'], // Search results taken from the `matches` property in returned search results
}
```

## Styling

```css
ia-book-search-results {
  --primaryTextColor: #fff;
  --activeButtonBg: #282828;
  --searchResultText: #adaedc;
  --searchResultBg: #272958;
  --searchResultBorder: #fff;
}
```

## Linting with ESLint
To scan the project for linting errors, run
```bash
npm run lint
```

## Testing with Karma
To run the suite of karma tests, run
```bash
npm run test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
npm run test:watch
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `es-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`
