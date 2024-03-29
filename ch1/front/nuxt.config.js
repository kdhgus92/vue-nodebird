module.exports = {
  head: {
    title: 'NodeBird',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover'
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge'
      },
      {
        hid: 'desc',
        name: 'description',
        content: '제로초의 NodeBird SNS'
      },
      {
        hid: 'ogtitle',
        name: 'og:title',
        content: 'NodeBird'
      },
      {
        hid: 'ogdesc',
        name: 'og:description',
        content: '제로초의 NodeBird SNS'
      },
      {
        hid: 'ogtype',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'ogimage',
        property: 'og:image',
        content: 'https://vue.nodebird.com/vue-nodebird.png'
      },
      {
        hid: 'ogurl',
        property: 'og:url',
        content: 'https://vue.nodebird.com'
      }
    ],
    link: [{ rel: 'shortcut icon', href: '/vue-nodebird.png' }]
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
    locales: ['ko'] // moment 한국어로 나오도록 설정
  },
  build: {
    analyze: false, // webpack bundle analyzer라는 파일 생성해준다. 배포전 빌드할 때만 True 
    extend(config, { isClient, isServer, isDev }) {
      if (isServer && !isDev) {
        config.devtool = 'hidden-source-map';
      }
      console.log('webpack', config, isServer, isClient);
    }
  },
  server: {
    port: process.env.PORT || 3081,
  }
};
