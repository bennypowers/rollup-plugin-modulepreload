import { OutputOptions, OutputBundle, RenderedChunk } from 'rollup'

type SyncOrAsyncPredicate = (chunk: RenderedChunk & { code: string, map: any  }) => Boolean | Promise<Boolean>

interface Options {
   index: string;
   prefix: string;
   shouldPreload?: SyncOrAsyncPredicate
}

export function modulepreload(options: Options): {
  name: 'modulepreload',
  generateBundle: (outputOptions: OutputOptions, bundle: OutputBundle) => void
}
