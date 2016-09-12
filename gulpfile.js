var gulp = require('gulp');
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var path = require('path');

function buildMain() {

  return rollup.rollup({
    entry: './src/js-mq-attrs.js',
    external: ['js-mq'],
    plugins: [
      nodeResolve({ jsnext: true }),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }).then((bundle) => {

    //return Promise.all([
      //bundle.write({
      //  format: 'es',
      //  dest: './dist/js-mq-attrs.es2015.js',
      //  sourceMap: true,
      //}),
      return bundle.write({
        format: 'umd',
        moduleName: 'mq.attrs',
        globals: { 'js-mq': 'mq' },
        dest: './dist/js-mq-attrs.js',
        sourceMap: true
      })
    //]);

  })
}

function buildDocs() {
  return rollup.rollup({
    entry: './docs/demo/demo.js',
    plugins: [
      nodeResolve(),
      commonjs(),
      babel()
    ]
  }).then((bundle) => {

    return bundle.write({
      format: 'iife',
      dest: './docs/demo/demo-es5.js',
      sourceMap: true
    });

  })
}

gulp.task('main', buildMain);
gulp.task('docs', buildDocs);

gulp.task('default', ['main', 'docs']);

gulp.task('watch', ['default'], () => {
  gulp.watch('./src/*.js', ['default']);
  gulp.watch('./docs/demo/*.js', ['docs']);
});
