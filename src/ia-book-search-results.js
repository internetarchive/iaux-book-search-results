/* eslint-disable class-methods-use-this */
import { nothing } from 'lit-html';
import { html, LitElement } from 'lit-element';
import '@internetarchive/ia-activity-indicator/ia-activity-indicator';
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
      queryInProgress: { type: Boolean },
      renderHeader: { type: Boolean },
      renderSearchAllFiles: { type: Boolean },
      displayResultImages: { type: Boolean },
      errorMessage: { type: String },
      results: {
        type: Array,
      },
    };
  }

  constructor() {
    super();

    this.results = [];
    this.queryInProgress = false;
    this.renderHeader = false;
    this.renderSearchAllFields = false;
    this.displayResultImages = false;
    this.errorMessage = '';

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
    const input = e.currentTarget.querySelector('input[type="search"]');
    if (!input || !input.value) {
      return;
    }
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

  cancelSearch() {
    this.queryInProgress = false;
    this.dispatchSearchCanceled();
  }

  dispatchSearchCanceled() {
    this.dispatchEvent(new CustomEvent('bookSearchCanceled', {
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

  get searchMultipleControls() {
    const controls = html`
      <input name="all_files" id="all_files" type="checkbox" />
      <label class="checkbox" for="all_files">Search all files</label>
    `;
    return this.renderSearchAllFiles ? controls : nothing;
  }

  get loadingIndicator() {
    return html`
      <div class="loading">
        <ia-activity-indicator mode="processing"></ia-activity-indicator>
        <p>Searching</p>
      </div>
    `;
  }

  get resultsSet() {
    const resultsClass = this.displayResultImages ? 'show-image' : '';
    return html`
      <ul class="results ${resultsClass}">
        ${this.results.map(match => html`
            <book-search-result
              .match=${match}
              @resultSelected=${this.selectResult}
            ></book-search-result>
          `)}
      </ul>
    `;
  }

  get searchForm() {
    return html`
      <form action="" method="get" @submit=${this.performSearch}>
        <fieldset>
          ${this.searchMultipleControls}
          <input type="search" name="query" @keyup=${this.setQuery} .value=${this.query} />
        </fieldset>
      </form>
    `;
  }

  get setErrorMessage() {
    return html`
      <p class="error-message">${this.errorMessage}</p>
    `;
  }

  render() {
    return html`
      ${this.headerSection}
      ${this.searchForm}
      ${this.queryInProgress ? this.loadingIndicator : nothing}
      ${this.errorMessage ? this.setErrorMessage : nothing}
      ${this.results.length ? this.resultsSet : nothing}
    `;
  }
}
