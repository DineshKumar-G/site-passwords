const path = require("path");

module.exports = {
  // chainWebpack: (config) => {
  //   config.resolve.alias.set('@', path.resolve(__dirname, 'client/src'));
  // },
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        ws: true,
        changeOrigin: true,
      },
    },
  },

  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
  },

  transpileDependencies: ["quasar"],
};
