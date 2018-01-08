# theme-import-webpack-plugin

## Usage

### Install
```
npm install theme-import-webpack-plugin --save-dev
```

### webpack
```
const ThemeImportWebpackPlugin = require('theme-import-webpack-plugin');

// set theme in THEME env or npm_config_theme or in options.theme

module.exports = {
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: ['node_modules'],
        plugins: [
            new ThemeResolveWebpackPlugin({
                rule: /^@theme/,
                path: path.resolve(__dirname, './src/themes'),
            }),
        ],
        alias: {
        }
    }
};

```

### Options

- @param {String} options.path Path to theme folder, required param

- @param {RegExp} [options.rule=/^@theme/]

- @param {String} [options.env='THEME']

- @param {String} [options.defaultTheme='default'] If file doesn't exist in your theme, it will resolve from defaultTheme folder.

- @param {Array} [options.extensions=['.vue', '.js' , '.json']]

- @param {String} [options.theme] Also you can pass the theme in env or npm_config_theme
### Example

```
npm run dev --theme=dark

or

THEME=dark npm run dev

or pass theme in optio
```

```
path
    dark
        config
        assets
        components
    default
        config
        assets
        components
```











