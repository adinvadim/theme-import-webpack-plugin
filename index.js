'use strict';
const assign = require('object-assign');
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

ThemeImportWebpackPlugin.prototype.apply = function (resolver) {
  const options = this.options;
  const theme =
    process.env[options.env] ||
    process.env[`npm_config_${options.env.toLowerCase()}`] ||
    options.theme;

  const attempts = [];
  const target = resolver.ensureHook('parsed-resolve');

  theme && attempts.push(theme);
  attempts.push(options.defaultTheme);
  resolver.getHook('resolve').tapAsync("ThemeImportPlugin", (request, resolveContext, callback) => {
    if (!options.rule.test(request.request)) {
      return callback();
    }
    const dirPath = request.path;

    forEachBail(
      attempts,
      function (theme, innerCallback) {
        const file = request.request.replace(
          options.rule,
          resolver.join(options.path, theme),
        );
        const obj = assign({}, request, {
          request: file
        });
        return resolver.doResolve(
          target,
          obj,
          `found file: ${file}`,
          resolveContext,
          innerCallback,
        );
      },
      function (err, result) {
        if(err) return callback(err);

        // Don't allow other aliasing or raw request
        if(result === undefined) return callback(null, null);
        callback(null, result);
      }
    );
  });
};

module.exports = ThemeImportWebpackPlugin;
