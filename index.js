'use strict';
const path = require('path');
const assign = require('object-assign');
const fs = require('fs');

/**
 * @class
 * @param {Object} options
 * @param {String} options.path Path to theme folder, required param
 * @param {RegExp} [options.rule=/^@theme/]
 * @param {String} [options.env='THEME']
 * @param {String} [options.defaultTheme='default']
 * @param {Array} [options.extensions=['.js', '.vue', '.json']]
 * @param {String} [options.theme]
 * @constructor
 */
function ThemeImportWebpackPlugin(options) {
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

function existsSync(file, extensions) {
  const filename = path.basename(file);
  if(/^.*\.[^.]+$/.test(filename)) {
    return fs.existsSync(file);
  }
  return extensions.some(item => {
    return fs.existsSync(file + item);
  });
}

ThemeImportWebpackPlugin.prototype.apply = function(compiler) {
  const options = this.options;
  const theme =
    process.env[options.env] ||
    process.env[`npm_config_${options.env.toLowerCase()}`] ||
    options.theme ||
    options.defaultTheme;

  compiler.plugin('resolve', function(request, finalCallback) {
    if (options.rule.test(request.request)) {
      let file = request.request.replace(
        options.rule,
        path.join(options.path, theme),
      );
      const isExist = existsSync(file, options.extensions);

      // If file doesn't exist in theme then will resolve one from default
      if (!(theme !== options.defaultTheme && isExist)) {
        file = request.request.replace(
          options.rule,
          path.join(options.path, options.defaultTheme),
        );
      }
      request.request = file;
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

module.exports = ThemeImportWebpackPlugin;
