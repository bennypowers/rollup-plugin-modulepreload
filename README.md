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
modulepreload({
  index: 'public/index.html',
  prefix: 'modules',
  shouldPreload: ({ code }) => code.includes('INCLUDE THIS CHUNK'),
})
```

or asynchronous:
```js
modulepreload({
  index: 'public/index.html',
  prefix: 'modules',
  shouldPreload: ({ facadeModuleId }) =>
    fs.promises.readFile(facadeModuleId, 'utf-8')
      .then(file => file.includes('INCLUDE THIS CHUNK')),
})
```

The <a name="default-predicate">Default Predicate</a> is :
```js
const defaultShouldPreload = ({ facadeModuleId, exports, isDynamicEntry }) =>
  !!(isDynamicEntry || (exports.length && !facadeModuleId))
```
