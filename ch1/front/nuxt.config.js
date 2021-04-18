module.exports = {
  head: {
    title: 'NodeBird'
  },
  modules: ['@nuxtjs/axios'],
  buildModules: ['@nuxtjs/vuetify', '@nuxtjs/moment'],
  plugins: [],
  vuetify: {},
  axios: {
    browserBaseURL: 'http://localhost:3085',
    baseURL: 'http://localhost:3085',
    https: false
  },
  moment: {
    locales: ['ko']
  },
  build: {
    analyze: false,
    extend(config, { isClient, isServer, isDev }) {
      if (isServer && !isDev) {
        config.devtool = 'hidden-source-map';
      }
      console.log('webpack', config, isServer, isClient);
    }
  },
  server: {
    port: 3080
  }
};
