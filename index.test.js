const ResolverFactory = require('enhanced-resolve').ResolverFactory;
const plugin = require('./index.js');
const path = require('path');

const createResolver = options =>
  ResolverFactory.createResolver({
    fileSystem: require('fs'),
    plugins: [new plugin(options)],
    extensions: ['.vue', '.js', '.json'],
  });

describe('Resolve behavior', () => {
  afterEach(() => {
    delete process.env.THEME;
  });

  it('env is empty, resolve default theme', done => {
    var resolver = createResolver({
      rule: /^@theme/,
      path: path.resolve(__dirname, './__mocks__/themes'),
    });
    resolver.resolve({}, __dirname, '@theme/index', function(err, result) {
      expect(result).toEqual(
        path.resolve(__dirname, './__mocks__/themes/default/index.js'),
      );
      done();
    });
  });

  it('custom theme, resolve file from custom', done => {
    process.env.THEME = 'custom';
    var resolver = createResolver({
      path: path.resolve(__dirname, './__mocks__/themes'),
    });
    resolver.resolve({}, __dirname, '@theme/index', function(err, result) {
      expect(result).toEqual(
        path.resolve(__dirname, './__mocks__/themes/custom/index.js'),
      );
      done();
    });
  });

  it('custom theme, file exist only in default theme', done => {
    process.env.PLATFORM = 'custom';
    var resolver = createResolver({
      rule: /^@theme/,
      path: path.resolve(__dirname, './__mocks__/themes'),
    });
    resolver.resolve({}, __dirname, '@theme/onlyInDefault', function(err, result) {
      expect(result).toEqual(
        path.resolve(__dirname, './__mocks__/themes/default/onlyInDefault.js'),
      );
      done();
    });
  });
});
