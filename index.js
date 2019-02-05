const { JSDOM } = require('jsdom');
const { writeFile } = require('fs').promises;
const path = require('path');

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const snd = ([, snd]) => snd;

const defaultShouldPreload = ({ facadeModuleId, exports, isDynamicEntry }) =>
  !!(isDynamicEntry || (exports.length && !facadeModuleId))

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
module.exports = function modulepreload({ index, prefix, shouldPreload = defaultShouldPreload } = {}) {
  return {
    name: 'modulepreload',

    async generateBundle({ format, dir }, bundle) {
      if (format !== 'es') return;
      const dom = await JSDOM.fromFile(index);

      Object.entries(bundle)
        .filter(compose(shouldPreload, snd))
        .map(([path]) => `${prefix || dir}/${path}`)
        .map(createLinkElement(dom))
        .forEach(link => dom.window.document.head.appendChild(link))

      await writeFile(path.resolve(index), dom.serialize(), 'utf-8');
    }
  };
}
