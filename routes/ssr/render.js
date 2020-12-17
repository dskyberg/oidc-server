/* eslint-disable no-console, max-len, camelcase, no-unused-vars */
/**
* Copyright (c) 2020 David Skyberg and Swankymutt.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* renderServer.jsx
 * This is the server side main rendering function, called by ./index
 * The file renderClient mirrors the JSX below.
*/
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import {storesContext, setInitialState} from '../../src/stores/StoresContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import theme from '../../src/views/theme'
import App from '../../src/views/App'
import Login from '../../src/views/Login'
import { useStaticRendering } from 'mobx-react'
useStaticRendering(true)

/**
 * Inject the body and css into the html to be returned
 * props parameter:
 * body, css, title, docType
 */
const renderFullPage = (props) => {
  const {css, body, ...rest} = props;
  const {title} = props
  const initialState = JSON.stringify(rest, null, 3)
  return `<!DOCTYPE html>
  <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <meta name="theme-color" content="#000000" />
        <style id="jss-server-side">${css}</style>
        <script>
          window.__INITIAL_STATE__ = ${ initialState};
        </script>

      </head>
      <body>
      <script async src="/public/js/bundle.js"></script>
      <div id="root">${body}</div>
    </body>
  </html>
  `
}

export default (url, props) => {
    const sheets = new ServerStyleSheets();
    const context = {}
    const {prompt} = props
    const initialState = JSON.parse(JSON.stringify(props, (key, value)=>{return  value === undefined ? null : value}))
    console.log('rendering page', JSON.stringify(props, null, 3))
    setInitialState(initialState);

    // Render the component to a string.
    const html = ReactDOMServer.renderToString(
      sheets.collect(
          <StaticRouter location={url} context={context}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
               <App />
            </ThemeProvider>
          </StaticRouter>
      ),
    );

    // Grab the CSS from our sheets.
    const css = sheets.toString();

    // Send the rendered page back to the client.
    return renderFullPage({ body: html, css: css, ...initialState});
  }
