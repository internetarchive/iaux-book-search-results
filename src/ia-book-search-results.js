import { nothing } from 'lit-html';
import { html, LitElement } from 'lit-element';
import bookSearchResultsCSS from './styles/ia-book-search-results.js';
import { BookSearchResult } from './book-search-result.js';

customElements.define('book-search-result', BookSearchResult);

export class IABookSearchResults extends LitElement {
  static get styles() {
    return bookSearchResultsCSS;
  }

  static get properties() {
    return {
      query: { type: String },
      renderHeader: { type: Boolean },
      results: {
        type: Array,
      },
    };
  }

  constructor() {
    super();

    this.results = [];
    this.renderHeader = false;

    this.bindBookReaderListeners();
  }

  bindBookReaderListeners() {
    document.addEventListener('BookReader:SearchCallback', this.setResults.bind(this));
  }

  setResults({ detail }) {
    this.results = detail.results;
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

  selectResult() {
    this.dispatchEvent(new CustomEvent('closeMenu', {
      bubbles: true,
      composed: true,
    }));
  }

  get resultsCount() {
    const count = this.results.length;
    return count ? html`<p>(${count} result${count > 1 ? 's' : ''})</p>` : nothing;
  }

  get headerSection() {
    const header = html`<header>
      <h3>Search inside</h3>
      ${this.resultsCount}
    </header>`;
    return this.renderHeader ? header : nothing;
  }

  render() {
    return html`
      ${this.headerSection}
      <form action="" method="get" @submit=${this.performSearch}>
        <fieldset>
          <input name="all_files" id="all_files" type="checkbox" />
          <label class="checkbox" for="all_files">Search all files</label>
          <input type="search" name="query" @keyup=${this.setQuery} .value=${this.query} />
        </fieldset>
      </form>
      <ul>
        ${this.results.map(match => html`<book-search-result .match=${match} @resultSelected=${this.selectResult}></book-search-result>`)}
      </ul>
    `;
  }
}
