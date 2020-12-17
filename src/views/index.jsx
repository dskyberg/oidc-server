/**
 * This file is the entry point in webpack.config.js.  It is rendered in the browser.
 * It is the client side version of
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {storesContext, setInitialState} from '../stores/StoresContext';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';

setInitialState(window.__INITIAL_STATE__);

function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
  );
}

ReactDOM.hydrate(<Main />, document.querySelector('#root'));
