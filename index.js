'use strict';
const path = require('path');
const assign = require('object-assign');
const fs = require('fs');
const forEachBail = require('enhanced-resolve/lib/forEachBail');

/**
 * @class
 * @param {Object} options
 * @param {String} options.path Path to theme folder, required param
 * @param {RegExp} [options.rule=/^@theme/]
 * @param {String} [options.env='THEME']
 * @param {String} [options.defaultTheme='default']
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
    },
    options,
  );
}

ThemeImportWebpackPlugin.prototype.apply = function (compiler) {
  const options = this.options;
  const theme =
    process.env[options.env] ||
    process.env[`npm_config_${options.env.toLowerCase()}`] ||
    options.theme;

  const attempts = [];

  theme && attempts.push(theme);
  attempts.push(options.defaultTheme);
  compiler.plugin('resolve', function (request, finalCallback) {
    if (!options.rule.test(request.request)) {
      return finalCallback();
    }
    const dirPath = request.path;

    forEachBail(
      attempts,
      function (theme, innerCallback) {
        const file = request.request.replace(
          options.rule,
          path.join(options.path, theme),
        );
        const obj = assign({}, request, {
          request: file
        });
        return compiler.doResolve(
          'parsed-resolve',
          obj,
          `found file: ${file}`,
          innerCallback,
        );
      },
      function (...args) {
        return finalCallback(...args);
      }
    );
  });
};

module.exports = ThemeImportWebpackPlugin;
