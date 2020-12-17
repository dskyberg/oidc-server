/* eslint-disable no-console, max-len, camelcase, no-unused-vars */
import path from 'path';
import Router from 'koa-router'
const bodyParser = require('koa-body');

import render from './render'

const client = {
  applicationType: 'web',
  grantTypes: [ 'refresh_token', 'authorization_code' ],
  idTokenSignedResponseAlg: 'RS256',
  postLogoutRedirectUris: [ 'http://localhost:3000/logout/response' ],
  requireAuthTime: false,
  responseTypes: [ 'code' ],
  subjectType: 'public',
  tokenEndpointAuthMethod: 'none',
  introspectionEndpointAuthMethod: 'none',
  revocationEndpointAuthMethod: 'none',
  requestUris: [],
  clientId: 'test_app',
  clientSecret: 'abc123',
  redirectUris: [ 'http://localhost:3000/login/response' ]
}
const params = {
  client_id: 'test_app',
  code_challenge: 'zn2QR1XC1JH3k3CpbjBVcIVXdsCuCgctIzhfBYGBQ_4',
  code_challenge_method: 'S256',
  redirect_uri: 'http://localhost:3000/login/response',
  response_mode: 'query',
  response_type: 'code',
  scope: 'openid profile',
  state: '912dc8ade84546f08d63f42fb0dca8b3'
}


const verifyCredentials = (uid, credentials) => {
  console.log('verifyCredentials:', credentials)
  return true
}

module.exports = (provider) => {
  const router = new Router({prefix: "/app"});

  const { constructor: { errors: { SessionNotFound } } } = provider;
  router.use(bodyParser({
    text: false, json: false, patchNode: true, patchKoa: true,
  }))
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

    // /app/login
    router.get('/:uid/select_account', async (ctx) => {
      const uid = ctx.params.uid
      const title = 'Select Account'
      const session = null
      const email = 'bob.smith@example.com'
      const prompt = {
        name: 'select_account',
        reasons: [ 'no_session' ],
        details: {
          max_age: undefined,
          login_hint: undefined,
          id_token_hint: undefined
        }
      }

      const uris = {
        success: `/app/${uid}/continue`,
        fail: '/app/${uid}/abort'
      }

      const props = {
        title: title,
        email: email,
        uid: uid,
        session: session,
        uris: uris,
        prompt: prompt,
        params: params,
        client: client
      }

      // To pass initial state into the mobx state manager, populate the value
      // here.  Then, renderServer will render the values in a script in
      // the html head.  The renderClient routine will then pull the values from
      // the script and hydrate mobx.
       ctx.body = render(ctx.url, props);
      return;
    });


  // /app/login
  router.get('/:uid/login', async (ctx) => {
    const uid = ctx.params.uid
    const title = 'Sign In'
    const session = null
    const email = 'bob.smith@example.com'
    const prompt = {
      name: 'login',
      reasons: [ 'no_session' ],
      details: {
        max_age: undefined,
        login_hint: undefined,
        id_token_hint: undefined
      }
    }

    const uris = {
      continue: `/app/${uid}/login`,
      abort: '/app/${uid}abort/'
    }
/*
    const props = {
      title: title,
      email: email,
      uid: uid,
      session: session,
      uris: uris,
      prompt: prompt,
      params: params,
      client: client
    }
*/
  const props = {
    prompt,
    client,
    uid,
    details: prompt.details,
    params,
    title: 'Sign In',
    google: ctx.google,
    session: session ? debug(session) : undefined,
  }
  console.log('login props:', props)

    // To pass initial state into the mobx state manager, populate the value
    // here.  Then, renderServer will render the values in a script in
    // the html head.  The renderClient routine will then pull the values from
    // the script and hydrate mobx.
     ctx.body = render(ctx.url, props);
    return;
  });

  router.post('/:uid/login', async (ctx) => {
    const uid = ctx.params.uid
    if(verifyCredentials('', ctx.request.body)){
      // Credentials verified.  Complete the step
      ctx.redirect(`/app/${uid}/consent`)
      return
    }
    // Failed. Return an error
    ctx.status = 404
    ctx.body = JSON.stringify({error: 'Invalid email or password.'})
  })

  router.get('/:uid/consent', async (ctx) => {
    const uid = ctx.params.uid
    const title = 'Authorize'
    const email = 'bob.smith@example.com'
    const session = {
      accountId: 'IDWkjBQfWNqcenwDQTLsH',
      uid: 'FpQiwOkdJDCe2l_Ejd1ku',
      cookie: 'R0E95mZ71Eo9q7qr_qRoQ',
    }
    const prompt = {
      name: 'consent',
      reasons: ['scope_missing'],
      details: {
        scopes: {
          new: [ 'openid', 'profile' ],
          accepted: [],
          rejected: []
        },
        claims: {
          new: [],
          accepted: [],
          rejected: []
        },
      },
    }

    const uris = {
      continue: `/app//${uid}/confirm`,
      abort: `/app/${uid}/abort`
    }

    // To pass initial state into the mobx state manager, populate the value
    // here.  Then, renderServer will render the values in a script in
    // the html head.  The renderClient routine will then pull the values from
    // the script and hydrate mobx.

    const props = {
      title: title,
      email: email,
      uid: uid,
      session: session,
      uris: uris,
      prompt: prompt,
      params: params,
      client: client
    }

    ctx.body = render(ctx.url, props);
    return;
  });


  return router;
};

