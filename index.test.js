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

  it('env is empty, resolve default theme', (done) => {
    const resolver = createResolver({
      rule: /^@theme/,
      path: path.resolve(__dirname, './__mocks__/themes'),
    });
    resolver.resolve({}, __dirname, '@theme/index', (err, result) => {
      expect(result).toEqual(path.resolve(__dirname, './__mocks__/themes/default/index.js'));
      done();
    });
  });


  it('custom theme, file exist only in default theme', (done) => {
    process.env.THEME = 'custom';
    const resolver = createResolver({
      rule: /^@theme/,
      path: path.resolve(__dirname, './__mocks__/themes'),
    });
    resolver.resolve({}, __dirname, '@theme/onlyInDefault', (err, result) => {
      expect(result).toEqual(path.resolve(__dirname, './__mocks__/themes/default/onlyInDefault.js'));
      done();
    });
  });

  it('custom theme, resolve file from custom', (done) => {
    process.env.THEME = 'custom';
    const resolver = createResolver({
      path: path.resolve(__dirname, './__mocks__/themes'),
    });
    resolver.resolve({}, __dirname, '@theme/index', (err, result) => {
      expect(result).toEqual(path.resolve(__dirname, './__mocks__/themes/custom/index.js'));
      done();
    });
  });

  it('foo in custom', (done) => {
    process.env.THEME = 'custom';
    const resolver = createResolver({
      path: path.resolve(__dirname, './__mocks__/themes'),
    });
    resolver.resolve({}, __dirname, '@theme/foo', (err, result) => {
      expect(result).toEqual(path.resolve(__dirname, './__mocks__/themes/custom/foo.js'));
      done();
    });
  });

  it('foo/index.vue in default with custom theme', (done) => {
    process.env.THEME = 'custom';
    const resolver = createResolver({
      path: path.resolve(__dirname, './__mocks__/themes'),
    });
    resolver.resolve({}, __dirname, '@theme/foo/index.vue', (err, result) => {
      expect(result).toEqual(path.resolve(__dirname, './__mocks__/themes/default/foo/index.vue'));
      done();
    });
  });

});
