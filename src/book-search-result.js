import { nothing } from 'lit-html';
import { html, LitElement } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

export class BookSearchResult extends LitElement {
  static get properties() {
    return {
      match: { type: Object },
    };
  }

  constructor() {
    super();

    this.matchRegex = new RegExp('{{{(.+?)}}}', 'g');
  }

  createRenderRoot() {
    return this;
  }

  highlightedHit(hit) {
    return html`
      <p>${unsafeHTML(hit.replace(this.matchRegex, '<mark>$1</mark>'))}</p>
    `;
  }

  render() {
    const { match } = this;
    const coverImage = html`<img src="${match.cover}" />`;
    return html`
      <li>
        ${match.cover ? coverImage : nothing}
        <h4>${match.title}</h4>
        ${this.highlightedHit(match.text)}
      </li>
    `;
  }
}
