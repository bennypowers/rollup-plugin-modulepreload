const { JSDOM } = require('jsdom');
const { writeFile } = require('fs').promises;
const path = require('path');
const compose = require('crocks/helpers/compose')
const curry = require('crocks/helpers/curry')
const map = require('crocks/pointfree/map')

const snd = ([, snd]) => snd;

const getPath = ([x]) => x;

const createLinkHref = prefix => path => `${prefix}/${path}`

const createLinkElement = dom => path => {
  const link = dom.window.document.createElement('link');
  link.rel = 'modulepreload';
  link.href = path;
  return link;
}

const defaultShouldPreload = ({ facadeModuleId, exports, isDynamicEntry }) =>
  !!(isDynamicEntry || (exports.length && !facadeModuleId))

const mapAsync = curry(f => xs => Promise.all(xs.map(f)));

const filterAsync = curry(f => async xs => {
  const filterMap = await mapAsync(f, xs);
  return xs.filter((_, index) => filterMap[index]);
})

const getPreloadChunks = async (shouldPreload, bundle) => await
  filterAsync(compose(shouldPreload, snd), Object.entries(bundle))

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

      const createLinkFromChunk = compose(
        createLinkElement(dom),
        createLinkHref((typeof prefix !== "undefined") ? prefix : dir),
        getPath,
      );

      const appendToDom = link =>
        dom.window.document.head.appendChild(link);

      await getPreloadChunks(shouldPreload, bundle)
        .then(map(createLinkFromChunk))
        .then(map(appendToDom));

      await writeFile(path.resolve(index), dom.serialize(), 'utf-8')
    }
  };
}
