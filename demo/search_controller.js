export default {
  searchURL(query) {
    return `https://${this.datanode}/fulltext/inside.php?item_id=${this.itemID}&doc=${this.docID}&path=${this.path}&q=${query}`;
  },

  performSearch(query) {
    const req = new XMLHttpRequest();
    req.addEventListener('load', ({ target }) => {
      const e = new Event('BookReader:SearchCallback');
      e.detail = {
        results: JSON.parse(target.responseText).matches,
      };
      document.dispatchEvent(e);
    });
    req.open('GET', this.searchURL(query));
    req.send();
  },

  fetchMetadata(identifier, cb) {
    const req = new XMLHttpRequest();
    const self = this;

    req.addEventListener('load', function mdapiXHR() {
      const metadataJSON = JSON.parse(this.responseText);
      Object.assign(self, {
        itemID: metadataJSON.metadata.identifier,
        docID: metadataJSON.metadata.identifier,
        datanode: metadataJSON.d1,
        path: metadataJSON.dir,
      });
      cb && cb();
    });
    req.open('GET', `https://archive.org/metadata/${identifier}/`);
    req.send();
  },
};
