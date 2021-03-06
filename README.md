# theme-import-webpack-plugin

💅 Theme resolver webpack plugin

## Usage

### Install
```
npm install theme-import-webpack-plugin --save-dev
```

### Webpack config
```
const ThemeImportWebpackPlugin = require('theme-import-webpack-plugin');

// set theme in THEME env or npm_config_theme or in options.theme

module.exports = {
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: ['node_modules'],
        plugins: [
            new ThemeImportWebpackPlugin({
                rule: /^@theme/,
                path: path.resolve(__dirname, './src/themes'),
            }),
        ],
        alias: {
        }
    }
};

```

### Plugin options

- `@param {String}` options.path Path to theme folder, required param

- `@param {RegExp} [options.rule=/^@theme/]`

- `@param {String} [options.env='THEME']` Change this option

- `@param {String} [options.defaultTheme='default']` If file doesn't exist in your theme, it will resolve from defaultTheme folder.

- `@param {Array} [options.extensions=['.js', '.vue', '.json']]`

- `@param {String} [options.theme]` Also you can pass the theme in env or npm_config_theme

### Example

```
npm run dev --theme=dark
```

or

```
THEME=dark npm run dev
```
or just pass `options.theme = 'dark'`

```
path
    dark
        config
        assets
        components
            Hello
    default
        config
        assets
        components
            Hello
            App
```

theme=dark
```javascript
const Hello = require('@theme/components/Hello');
// resolve to the ./src/themes/dark/components/Hello
```

theme=default
```javascript
const Hello = require('@theme/components/Hello');
// resolve to the ./src/themes/default/components/Hello because in dark theme doesn't exist
```

theme=dark
```javascript
const Hello = require('@theme/components/App');
// resolve to the ./src/themes/default/components/App because in dark theme doesn't exist
```
