import test from 'tape';
import { rollup } from 'rollup';
import modulepreload from '../';
import { readFile, writeFile } from 'fs/promises';

const INDEX_SRC =
  '<html><head></head><body></body></html>';

const PRELOADS_A =
  '<html><head><link rel="modulepreload" href="output/a-934b9454.js"></head><body></body></html>';

test('writes modulepreload link to document head', async function(assert) {
  await writeFile(__dirname + '/index.html', INDEX_SRC, 'utf-8')

  const bundle = await rollup({
    input: 'test/samples/basic.js',
    plugins: [modulepreload({ index: __dirname + '/index.html' })]
  });

  await bundle.generate({ dir: 'output', format: 'es', });

  const ACTUAL =
    await readFile(`${__dirname}/index.html`, 'utf-8');

  assert.equal(ACTUAL, PRELOADS_A);

  assert.end();
});

test('writes modulepreload link with specified prefix', async function(assert) {
  await writeFile(__dirname + '/index.html', INDEX_SRC, 'utf-8')

  const bundle = await rollup({
    input: 'test/samples/basic.js',
    plugins: [modulepreload({ index: __dirname + '/index.html' })]
  });

  await bundle.generate({ dir: 'output', format: 'es', });

  const ACTUAL =
    await readFile(`${__dirname}/index.html`, 'utf-8');

  assert.equal(ACTUAL, PRELOADS_A);
  assert.end();
});

test('takes synchronous shouldPreload predicate', async function(assert) {
  await writeFile(__dirname + '/index.html', INDEX_SRC, 'utf-8')

  const bundle = await rollup({
    input: 'test/samples/basic.js',
    plugins: [
      modulepreload({
        index: __dirname + '/index.html',
        shouldPreload: ({ code }) =>
          !!code && code.includes('hi')
      })]
  });

  await bundle.generate({ dir: 'output', format: 'es', });

  const ACTUAL =
    await readFile(`${__dirname}/index.html`, 'utf-8');

  assert.equal(ACTUAL, PRELOADS_A);
  assert.end();
});

test('takes async shouldPreload predicate', async function(assert) {
  await writeFile(__dirname + '/index.html', INDEX_SRC, 'utf-8')

  const bundle = await rollup({
    input: 'test/samples/basic.js',
    plugins: [
      modulepreload({
        index: __dirname + '/index.html',
        async shouldPreload({ facadeModuleId }) {
          if (!facadeModuleId) return false;
          const file = await readFile(facadeModuleId, 'utf-8');
          return file.includes('hi');
        }
      })]
  });

  await bundle.generate({ dir: 'output', format: 'es', });

  const ACTUAL =
    await readFile(`${__dirname}/index.html`, 'utf-8');

  assert.equal(ACTUAL, PRELOADS_A);
  assert.end();
});
