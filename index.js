'use strict';
const path = require('path');
const assign = require('object-assign');

/**
 * @class
 * @param {Object} options
 * @param {String} options.path Path to theme folder, required param
 * @param {RegExp} [options.rule=/^@theme/]
 * @param {String} [options.env='THEME']
 * @param {String} [options.defaultTheme='default']
 * @param {Array} [options.extensions=['.vue', '.js' , '.json']]
 * @param {String} [options.theme]
 * @constructor
 */
function ThemeResolverWebpackPlugin(options) {
  this.options = assign(
    {},
    {
      rule: /^@theme/,
      env: 'THEME',
      defaultTheme: 'default',
      extensions: ['.js', '.vue', '.json'],
    },
    options,
  );
}

function existsSync(fsExistsSync, file, extensions) {
  return extensions.some(item => {
    return fsExistsSync(file + item);
  });
}

ThemeResolverWebpackPlugin.prototype.apply = function(compiler) {
  const options = this.options;
  const fs = compiler.fileSystem;
  let theme =
    process.env[options.env] ||
    process.env[`npm_config_${options.env.toLowerCase()}`] ||
    options.theme ||
    options.defaultTheme;

  compiler.plugin('before-resolve', function(request, finalCallback) {
    if (options.rule.test(request.request)) {
      let file = request.request.replace(
        options.rule,
        path.join(options.path, theme),
      );
      const isExist = existsSync(fs.existsSync, file, options.extensions);

      if (theme != options.defaultTheme && isExist) {
        request.request = file;
      } else {
        theme = options.defaultTheme;
        file = request.request.replace(
          options.rule,
          path.join(options.path, theme),
        );
        request.request = file;
      }
      return this.doResolve(
        'parsed-resolve',
        request,
        `found file: ${file}`,
        finalCallback,
      );
    }
    return finalCallback();
  });
};

module.exports = ThemeResolverWebpackPlugin;
