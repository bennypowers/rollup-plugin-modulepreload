# rollup-plugin-modulepreload
Rollup plugin to add modulepreload links from generated chunks.

## Usage

```js
import config from './rollup.config.rest.js'
import modulepreload from 'rollup-plugin-modulepreload';

export default {
  plugins: [
    // <link rel="modulepreload" href="modules/chunk-47ckl37a.js">
    //    -> public/index.html
    modulepreload({
      prefix: 'modules',
      index: 'public/index.html',
    })
  ]
}
```

## Options

|Name|Accepts|Default|
|-----|-----|-----|
|`index`|Path to index.html to modify.|`undefined`|
|`prefix`|Path to prepend to chunk filenames in link tag `href` attribute.|your bundle's `dir` option|
