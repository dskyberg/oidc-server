/* eslint-disable no-console, max-len, camelcase, no-unused-vars */
const path = require('path');

const { strict: assert } = require('assert');
const querystring = require('querystring');
const crypto = require('crypto');
const { inspect } = require('util');

const isEmpty = require('lodash/isEmpty');
const bodyParser = require('koa-body');
const Router = require('koa-router');

const { renderError } = require('oidc-provider/lib/helpers/defaults'); // make your own, you'll need it anyway
const Account = require('../../support/account');
const config = require('../../support/configuration');
//import render from '../ssr/render'
const keys = new Set();

const debug = (obj) => querystring.stringify(Object.entries(obj).reduce((acc, [key, value]) => {
  keys.add(key);
  if (isEmpty(value)) return acc;
  acc[key] = inspect(value, { depth: null });
  return acc;
}, {}), '<br/>', ': ', {
  encodeURIComponent(value) { return keys.has(value) ? `<strong>${value}</strong>` : value; },
});

const scopeClaims = (scopes) => {
  const keys = Object.keys(config.claims)
  const scope_claims = Array.from(new Set(scopes.map(scope => {
    if(keys.includes(scope))
    {
        return config.claims[scope]
    }
    return []
  }).flat()));
  console.log(scope_claims)
  return scope_claims
}

module.exports = (provider) => {
  const router = new Router();
  const { constructor: { errors: { SessionNotFound } } } = provider;
  router.use(async (ctx, next) => {
    ctx.set('Pragma', 'no-cache');
    ctx.set('Cache-Control', 'no-cache, no-store');
    try {
      await next();
    } catch (err) {
      if (err instanceof SessionNotFound) {
        ctx.status = err.status;
        const { message: error, error_description } = err;
        renderError(ctx, { error, error_description }, err);
      } else {
        throw err;
      }
    }
  });

  router.get('/interaction/:uid', async (ctx, next) => {
    const {
      uid, prompt, params, session,
    } = await provider.interactionDetails(ctx.req, ctx.res);
    const client = await provider.Client.find(params.client_id);

    switch (prompt.name) {
      case 'select_account': {
        if (!session) {
          return provider.interactionFinished(ctx.req, ctx.res, {
            select_account: {},
          }, { mergeWithLastSubmission: false });
        }

        const account = await provider.Account.findAccount(ctx, session.accountId);
        const { email } = await account.claims('prompt', 'email', { email: null }, []);

        return ctx.render('select_account', {
          client,
          uid,
          email,
          details: prompt.details,
          params,
          title: 'Sign-in',
          session: session ? debug(session) : undefined,
          dbg: {
            params: debug(params),
            prompt: debug(prompt),
          },
        });
      }
      case 'login': {
        const props = {
          prompt,
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Sign In',
          google: ctx.google,
          session: session ? debug(session) : undefined,
          uris: {
            continue: `/interaction/${uid}/login`,
            abort: '/interaction/${uid}abort/'
          },
          dbg: {
            params: debug(params),
            prompt: debug(prompt)
          },
        }
        return ctx.render('login', props);
        //ctx.type = 'html'
        //ctx.body = render(ctx.url, props)
        return
      }
      case 'consent': {
        const scope_claims = scopeClaims(prompt.details.scopes.new)

        const props = {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Authorize',
          session: session ? debug(session) : undefined,

          dbg: {
            params: debug(params),
            prompt: debug(prompt),
            scope_claims: debug(scope_claims),
          },

          uris: {
            continue: `/interaction/${uid}/confirm`,
            abort: `/interaction/${uid}/abort`
          },
        }
        //console.log('consent props:', props)
        return ctx.render('interaction', props);
        //render('interaction', props)
        //return
      }
      default:
        return next();
    }
  });

  const body = bodyParser({
    text: false, json: false, patchNode: true, patchKoa: true,
  });


  router.post('/interaction/:uid/login', body, async (ctx) => {
    const { prompt: { name } } = await provider.interactionDetails(ctx.req, ctx.res);
    assert.strictEqual(name, 'login');

   try {
    const { uid, prompt, params } = await provider.interactionDetails(ctx.req, ctx.res);
    const client = await provider.Client.find(params.client_id);

    const accountId = await Account.authenticate(ctx.req.body.login, ctx.req.body.password);

    if (!accountId) {

      ctx.render('login', {
        client,
        uid,
        details: prompt.details,
        params: {
          ...params,
          login_hint: ctx.req.body.login,
        },
        title: 'Sign-in',
        flash: 'Invalid email or password.',
      });
      return;

      //ctx.status = 404
      //ctx.type = 'json'
      //ctx.body = JSON.stringify({error: 'Invalid email or password.'})
      //return
    }

    const result = {
      login: {
        account: accountId,
      },
    };

    await provider.interactionFinished(ctx.req, ctx.res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    console.log('Devistating error:', err)
    //next(err);
  }

  });

  router.post('/interaction/:uid/continue', body, async (ctx) => {
    const interaction = await provider.interactionDetails(ctx.req, ctx.res);
    const { prompt: { name, details } } = interaction;
    assert.strictEqual(name, 'select_account');

    if (ctx.request.body.switch) {
      if (interaction.params.prompt) {
        const prompts = new Set(interaction.params.prompt.split(' '));
        prompts.add('login');
        interaction.params.prompt = [...prompts].join(' ');
      } else {
        interaction.params.prompt = 'login';
      }
      await interaction.save();
    }

    const result = { select_account: {} };
    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  });

  router.post('/interaction/:uid/confirm', body, async (ctx) => {
    const { prompt: { name, details } } = await provider.interactionDetails(ctx.req, ctx.res);
    assert.strictEqual(name, 'consent');

    const consent = {};

    // any scopes you do not wish to grant go in here
    //   otherwise details.scopes.new.concat(details.scopes.accepted) will be granted
    consent.rejectedScopes = [];

    // any claims you do not wish to grant go in here
    //   otherwise all claims mapped to granted scopes
    //   and details.claims.new.concat(details.claims.accepted) will be granted
    consent.rejectedClaims = [];

    // replace = false means previously rejected scopes and claims remain rejected
    // changing this to true will remove those rejections in favour of just what you rejected above
    consent.replace = false;

    const result = { consent };
    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: true,
    });
  });

  router.get('/interaction/:uid/abort', async (ctx) => {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };

    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  });

  return router;
};
