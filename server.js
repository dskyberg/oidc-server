/* eslint-disable no-console */

const path = require('path');
const render = require('koa-ejs');
const set = require('lodash/set');
const Koa = require('koa');
const helmet = require('koa-helmet');
const mount = require('koa-mount');
const serve = require('koa-static');
const staticCache = require('koa-static-cache');
const koaLogger = require('koa-logger-middleware');
const winston = require('winston')

const { Provider } = require('oidc-provider'); // require('oidc-provider');

const Account = require('./support/account');
const configuration = require('./support/configuration');
const op = require('./routes/op');
const ssr = require('./routes/ssr');

// Enable runtime transpiling for jsx files.
const register = require('@babel/register')

const { PORT = 3082, ISSUER = `http://localhost:${PORT}` } = process.env;
configuration.findAccount = Account.findAccount;

const app = new Koa();


// configure the Winston logger middleware.
const loggerOptions = {
  logger: winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
        colorize: true,
      })
    ]
  }),
}
app.use(koaLogger(loggerOptions));

app.use(helmet());

render(app, {
  cache: false,
  viewExt: 'ejs',
  layout: '_layout',
  root: path.join(__dirname, 'ejs_views'),
});


if (process.env.NODE_ENV === 'production') {
  app.proxy = true;
  set(configuration, 'cookies.short.secure', true);
  set(configuration, 'cookies.long.secure', true);

  app.use(async (ctx, next) => {
    if (ctx.secure) {
      await next();
    } else if (ctx.method === 'GET' || ctx.method === 'HEAD') {
      ctx.redirect(ctx.href.replace(/^http:\/\//i, 'https://'));
    } else {
      ctx.body = {
        error: 'invalid_request',
        error_description: 'do yourself a favor and only use https',
      };
      ctx.status = 400;
    }
  });
}

// Add the static file handler.  Any files in '/public' will be served with this
// So, to load a css file, use:
// <link rel="stylesheet" type="text/css" href="/public/mystyles.css" />
app.use(mount('/public', serve('./public')));
app.use(staticCache(path.join(__dirname,'public')))

let server;
(async () => {
  let adapter;
  if (process.env.MONGODB_URI) {
    adapter = require('./adapters/mongodb'); // eslint-disable-line global-require
    await adapter.connect();
  }

  const provider = new Provider(ISSUER, { adapter, ...configuration });

  provider.use(helmet());

  app.use(op(provider).routes());
  app.use(ssr(provider).routes())
  app.use(mount(provider.app));
  server = app.listen(PORT, () => {
    console.log(`application is listening on port ${PORT}, check its /.well-known/openid-configuration`);
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});
