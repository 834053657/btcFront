const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  define: {
    __KG_API_ENV__: process.env.KG_API_ENV,
    __KG_DATATIME__: new Date().toLocaleString(),
  },
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
      define: {
        __KG_API_ENV__: process.env.KG_API_ENV,
        __KG_DATATIME__: new Date().toLocaleString(),
      },
    },
    test: {
      define: {
        __KG_API_ENV__: process.env.KG_API_ENV,
        __KG_DATATIME__: new Date().toLocaleString(),
      },
    },
    production: {
      define: {
        __KG_API_ENV__: process.env.KG_API_ENV,
        __KG_DATATIME__: new Date().toLocaleString(),
      },
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: false,
  publicPath: '/',
  hash: true,
};
