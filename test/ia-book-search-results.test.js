import {
  html,
  fixture,
  expect,
  oneEvent,
} from '@open-wc/testing';
import sinon from 'sinon';
import { IABookSearchResults } from '../src/ia-book-search-results.js';

customElements.define('ia-book-search-results', IABookSearchResults);

const container = (results = []) => (
  html`<ia-book-search-results .results=${results}></ia-book-search-results>`
);

const searchQuery = 'Bristol';

const results = [{
  text: `In the drawing of caricatures and cartoons\u2014or any other com' mercial art, for that matter\u2014the artist should know something about the processes of reproduction for that particular form of art work. For pen and ink work the engraving is made on a sine printing plate. It is not necessary, however, to know all about these processes of reproduction. The artist should know that all work intended for line rqproducttons should be made on white paper or {{{${searchQuery}}}} Board with black drawing ink. The drawing to be reproduced is photographed on a chemically treated sine plate, which is then treated with acid. This acid eats away the surface of the sine, except the photographed' lines, which are left in relief, somewhat like printing type. Colored inks do not photograph well; neither does black ink on colored paper.`,
  cover: '//placehold.it/30x44',
  title: 'Book title',
  par: [{
    boxes: [{
      r: 2672, b: 792, t: 689, page: 24, l: 2424,
    }],
    b: 1371,
    t: 689,
    page_width: 3658,
    r: 3192,
    l: 428,
    page_height: 5357,
    page: 24,
  }],
}, {
  text: `Drawings intended for sale should be made on a good grade of {{{${searchQuery}}}} Board, and a margin left all the way around the drawings. They should be mailed flat, and'require first class postage. Enclose postage for the return of the drawings. Only send good drawings of a reason- able quantity. Enclose a neat and terse letter to the one you are sending the drawings to, written with pen and ink or typewriter if possible, on`,
  par: [{
    boxes: [{
      r: 698, b: 4460, t: 4324, page: 86, l: 450,
    }],
    b: 4938,
    t: 4207,
    page_width: 3658,
    r: 3196,
    l: 432,
    page_height: 5357,
    page: 86,
  }],
}];

describe('<ia-book-search-results>', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('sets default properties', async () => {
    const el = await fixture(container(results));

    expect(el.results).to.equal(results);
  });

  it('sets results when passed in via event object', async () => {
    const el = await fixture(container());

    el.setResults({ detail: { results } });
    expect(el.results).to.equal(results);
  });

  it('listens for a custom search callback event on the document', async () => {
    IABookSearchResults.prototype.setResults = sinon.fake();
    const el = await fixture(container());
    const event = new Event('BookReader:SearchCallback');

    event.detail = { results };
    document.dispatchEvent(event);
    expect(el.setResults.callCount).to.equal(1);
    expect(el.setResults.firstArg).to.equal(event);
  });

  it('renders results that contain the book title', async () => {
    sinon.replace(IABookSearchResults.prototype, 'createRenderRoot', function createRenderRoot() { return this; });
    const el = await fixture(container(results));

    expect(el.innerHTML).to.include(`${results[0].title}`);
  });

  it('renders results that contain a highlighted match', async () => {
    sinon.replace(IABookSearchResults.prototype, 'createRenderRoot', function createRenderRoot() { return this; });
    const el = await fixture(container(results));

    expect(el.innerHTML).to.include(`<mark>${searchQuery}</mark>`);
  });

  it('renders results that contain an optional cover image', async () => {
    sinon.replace(IABookSearchResults.prototype, 'createRenderRoot', function createRenderRoot() { return this; });
    const el = await fixture(container(results));

    expect(el.innerHTML).to.include(`<img src="${results[0].cover}">`);
  });

  it('sets a query prop when search input receives input', async () => {
    const el = await fixture(container(results));
    const searchInput = el.shadowRoot.querySelector('[name="query"]');

    searchInput.value = searchQuery;
    searchInput.dispatchEvent(new Event('keyup'));

    expect(el.query).to.equal(searchQuery);
  });

  it('emits a custom event when search form submitted', async () => {
    const el = await fixture(container(results));

    setTimeout(() => (
      el.shadowRoot.querySelector('form').dispatchEvent(new Event('submit'))
    ));
    const response = await oneEvent(el, 'bookSearchInitiated');

    expect(response).to.exist;
  });

  it('uses a singular noun when one result given', async () => {
    const el = await fixture(container([results[0]]));
    const resultsCount = await fixture(el.resultsCount);

    expect(resultsCount.innerHTML).to.include('1 result');
  });

  it('can render header with active options count', async () => {
    const el = await fixture(container(results));
    el.renderHeader = true;

    await el.updateComplete;

    expect(el.shadowRoot.querySelector('header p').innerText).to.include('2');
  });

  it('emits a resultSelected event when a search result is clicked', async () => {
    const el = await fixture(container(results));

    setTimeout(() => (
      el.shadowRoot.querySelector('book-search-result').querySelector('li').click()
    ));
    const response = await oneEvent(el, 'resultSelected');

    expect(response).to.exist;
  });

  it('emits a closeMenu event when a search result is clicked', async () => {
    const el = await fixture(container(results));

    setTimeout(() => (
      el.shadowRoot.querySelector('book-search-result').querySelector('li').click()
    ));
    const response = await oneEvent(el, 'closeMenu');

    expect(response).to.exist;
  });
});