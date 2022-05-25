const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/go', {
    target: 'http://1.14.48.224:8088',
    changeOrigin: true,

  }))
}


