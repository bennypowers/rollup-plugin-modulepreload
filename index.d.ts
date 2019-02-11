import { OutputOptions, OutputBundle } from 'rollup'
interface Options {
}

export function modulepreload(options: Options): {
  name: 'modulepreload',
  generateBundle: (outputOptions: OutputOptions, bundle: OutputBundle) => void
}
