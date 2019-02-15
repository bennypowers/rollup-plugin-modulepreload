import test from 'tape';
import { rollup } from 'rollup';
import modulepreload from '../';
import fs from 'fs';

test('writes modulepreload link to document head', async function(assert) {
  await fs.promises.writeFile(__dirname + '/index.html', '<html><head></head><body></body></html>', 'utf-8')

  const bundle = await rollup({
    input: 'test/samples/basic.js',
    plugins: [modulepreload({ index: __dirname + '/index.html' })]
  });

  await bundle.generate({ dir: 'output', format: 'es', });

  assert.equal(
    await fs.promises.readFile(`${__dirname}/index.html`, 'utf-8'),
    '<html><head><link rel="modulepreload" href="output/chunk-ef81ce85.js"></head><body></body></html>'
  );
  assert.end();
});

test('writes modulepreload link with specified prefix', async function(assert) {
  await fs.promises.writeFile(__dirname + '/index.html', '<html><head></head><body></body></html>', 'utf-8')

  const bundle = await rollup({
    input: 'test/samples/basic.js',
    plugins: [modulepreload({ index: __dirname + '/index.html', prefix: 'modules' })]
  });

  await bundle.generate({ dir: 'output', format: 'es', });

  assert.equal(
    await fs.promises.readFile(`${__dirname}/index.html`, 'utf-8'),
    '<html><head><link rel="modulepreload" href="modules/chunk-ef81ce85.js"></head><body></body></html>'
  );
  assert.end();
});

test('takes synchronous shouldPreload predicate', async function(assert) {
  await fs.promises.writeFile(__dirname + '/index.html', '<html><head></head><body></body></html>', 'utf-8')

  const bundle = await rollup({
    input: 'test/samples/basic.js',
    plugins: [
      modulepreload({
        index: __dirname + '/index.html',
        prefix: 'modules',
        shouldPreload: ({ code }) => code.includes('hi')
      })]
  });

  await bundle.generate({ dir: 'output', format: 'es', });

  assert.equal(
    await fs.promises.readFile(`${__dirname}/index.html`, 'utf-8'),
    '<html><head><link rel="modulepreload" href="modules/chunk-ef81ce85.js"></head><body></body></html>'
  );
  assert.end();
});

test('takes async shouldPreload predicate', async function(assert) {
  await fs.promises.writeFile(__dirname + '/index.html', '<html><head></head><body></body></html>', 'utf-8')

  const bundle = await rollup({
    input: 'test/samples/basic.js',
    plugins: [
      modulepreload({
        index: __dirname + '/index.html',
        prefix: 'modules',
        shouldPreload:({ facadeModuleId }) =>
          fs.promises.readFile(facadeModuleId, 'utf-8')
            .then(file => file.includes('hi'))
      })]
  });

  await bundle.generate({ dir: 'output', format: 'es', });

  assert.equal(
    await fs.promises.readFile(`${__dirname}/index.html`, 'utf-8'),
    '<html><head><link rel="modulepreload" href="modules/chunk-ef81ce85.js"></head><body></body></html>'
  );
  assert.end();
});
