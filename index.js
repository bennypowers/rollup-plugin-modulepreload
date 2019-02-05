const { JSDOM } = require('jsdom');
const { writeFile } = require('fs').promises;
const path = require('path');

const createLinkElement = dom => path => {
  const link = dom.window.document.createElement('link');
  link.rel = 'modulepreload';
  link.href = path;
  return link;
}
/**
 * Imports css as lit-element `css`-tagged constructible style sheets.
 * @param  {Object} [options={}]
 * @return {Object}
 */
module.exports = function modulepreload({ index, prefix } = {}) {
  return {
    name: 'modulepreload',

    async generateBundle({ format, dir }, bundle) {
      if (format !== 'es') return;
      const dom = await JSDOM.fromFile(index);

      Object.entries(bundle)
        .filter(([, { isDynamicEntry }]) => isDynamicEntry)
        .map(([path]) => `${prefix || dir}/${path}`)
        .map(createLinkElement(dom))
        .forEach(link => dom.window.document.head.appendChild(link))

      await writeFile(path.resolve(index), dom.serialize(), 'utf-8');
    }
  };
}
