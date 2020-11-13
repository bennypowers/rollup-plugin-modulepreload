# rollup-plugin-modulepreload
Rollup plugin to add [modulepreload links](https://html.spec.whatwg.org/multipage/links.html#link-type-modulepreload) from generated chunks. Users may customize which chunks are preloaded using the `shouldPreload` option.

## Usage

```js
import config from './rollup.config.rest.js'
import modulepreload from 'rollup-plugin-modulepreload';

export default {
  plugins: [
    modulepreload({
      prefix: 'modules',
      index: 'public/index.html',
    })
  ]
}
```

This will write something like the following to the `<head>` of index.html
```html
<link rel="modulepreload" href="modules/chunk-47ckl37a.js">
```

## Options

|Name|Accepts|Default|
|-----|-----|-----|
|`index`|Path to index.html to modify.|`undefined`|
|`prefix`|Path to prepend to chunk filenames in link tag `href` attribute.|your bundle's `dir` option|
|`shouldPreload`|Predicate which takes a [`ChunkInfo`](https://rollupjs.org/guide/en#generatebundle)|[Default predicate](#default-predicate)|

### Determining Which Chunks to Preload
You can customize the function which determines whether or not to preload a chunk by passing a `shouldPreload` predicate, which takes a [`ChunkInfo`](https://rollupjs.org/guide/en#generatebundle) object.

It can be synchronous:
```js
function shouldPreload({ code }) {
  return !!code && code.includes('INCLUDE THIS CHUNK');
}

export default {
  input: 'src/index.js',
  plugins: [
    modulepreload({
      index: 'public/index.html',
      prefix: 'modules',
      shouldPreload,
    })
  ]
}
```

or asynchronous:
```js
import { readFile } from 'fs/promises'; // node ^14

async function shouldPreload(chunk) {
  if (!chunk.facadeModuleId)
    return false;

  const file =
    await readFile(chunk.facadeModuleId, 'utf-8');

  return file.includes('INCLUDE THIS CHUNK');
}

export default {
  input: 'src/index.js',
  plugins: [
    modulepreload({
      index: 'public/index.html',
      prefix: 'modules',
      shouldPreload,
    })
  ]
}
```

The <a name="default-predicate">Default Predicate</a> is :
```js
const defaultShouldPreload =
  ({ exports, facadeModuleId, isDynamicEntry }) =>
    !!(
      // preload dynamically imported chunks
      isDynamicEntry ||
      // preload generated intermediate chunks
      (exports && exports.length && !facadeModuleId)
    );
```
