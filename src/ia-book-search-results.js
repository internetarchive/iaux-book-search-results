import { html, LitElement } from 'lit-element';
import closeIcon from '@internetarchive/icon-collapse-sidebar';
import bookSearchResultsCSS from './styles/ia-book-search-results.js';
import { BookSearchResult } from './book-search-result.js';

customElements.define('book-search-result', BookSearchResult);

export class IABookSearchResults extends LitElement {
  static get styles() {
    return bookSearchResultsCSS;
  }

  static get properties() {
    return {
      results: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.results = [];

    this.bindBookReaderListeners();
  }

  bindBookReaderListeners() {
    document.addEventListener('BookReader:SearchCallback', this.setResults.bind(this));
  }

  setResults({ detail }) {
    this.results = detail.results;
  }

  unsetSelectedMenuOption(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('menuTypeSelected', {
      bubbles: true,
      composed: true,
      detail: {
        id: 'search',
      },
    }));
  }

  setQuery(e) {
    this.query = e.currentTarget.value;
  }

  performSearch(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('bookSearchInitiated', {
      bubbles: true,
      composed: true,
      detail: {
        query: this.query,
      },
    }));
  }

  get resultsCount() {
    const count = this.results.length;
    return count ? html`<p>(${count} result${count > 1 ? 's' : ''})</p>` : html``;
  }

  render() {
    return html`
      <header>
        <div>
          <h3>Search inside</h3>
          ${this.resultsCount}
        </div>
        <a href="#" class="close" @click=${this.unsetSelectedMenuOption}>${closeIcon}</a>
      </header>
      <form action="" method="get" @submit=${this.performSearch}>
        <fieldset>
          <input name="all_files" id="all_files" type="checkbox" />
          <label class="checkbox" for="all_files">Search all files</label>
          <input type="search" name="query" @keyup=${this.setQuery} />
        </fieldset>
      </form>
      <ul>
        ${this.results.map(match => html`<book-search-result .match=${match}></book-search-result>`)}
      </ul>
    `;
  }
}
