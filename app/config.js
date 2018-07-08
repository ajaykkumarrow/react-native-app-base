require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign(
  {
    apiHost: process.env.APIHOST || '104.211.96.30',
    apiPort: process.env.APIPORT || 80,
    apiBase: '/api',
    app: {
      title: 'InstaBike',
      description: 'A mobile application by CAMS',
    }
  },
  environment
);
