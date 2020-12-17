import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';


const optimist_600 = {
  fontFamily: 'Optimist',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 600,
  src: 'url(/public/fonts/Optimist_W_SBdIt.woff2) format("woff2"), url(/public/fonts/Optimist_W_SBdIt.woff) format("woff"), url(/public/fonts/Optimist_W_SBdIt.ttf) format("truetype")'
}


const optimist_400 = {
  fontFamily: 'Optimist',
  fontWeight: 400,
  src: 'url(/public/fonts/Optimist_W_Rg.woff2) format("woff2"), url(/public/fonts/Optimist_W_Rg.woff) format("woff"), url(/public/fonts/Optimist_W_Rg.ttf) format("truetype")'
}

const optimist_italics_400 = {
  fontFamily: 'Optimist',
  fontStyle: 'italic',
  fontWeight: 400,
  src: 'url(/public/fonts/Optimist_W_It.woff2) format("woff2"), url(/public/fonts/Optimist_W_It.woff) format("woff"), url(/public/fonts/Optimist_W_It.ttf) format("truetype")'
}

const optimist_200 = {
  fontFamily: 'Optimist',
  fontWeight: 200,
  src: 'url(/public/fonts/Optimist_W_Lt.woff2) format("woff2"), url(/public/fonts/Optimist_W_Lt.woff) format("woff"), url(/public/fonts/Optimist_W_Lt.ttf) format("truetype")'
}

const optimist_italics_200 = {
    fontFamily: 'Optimist',
    fontStyle: 'italic',
    fontWeight: 200,
    src: 'url(/public/fonts/Optimist_W_LtIt.woff2) format("woff2"), url(/public/fonts/Optimist_W_LtIt.woff) format("woff"), url(/public/fonts/Optimist_W_LtIt.ttf) format("truetype")'
}


// Create a theme instance.
const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          backgroundColor: '#fafafa',
        },
        body: {
          backgroundColor: '#fafafa',
        },
        '@font-face': [optimist_600, optimist_400, optimist_italics_400, optimist_200, optimist_italics_200]
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#fff',
        color: '#011728',
      }
    }
  },
  typography: {
    fontFamily: 'Optimist, Arial'
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
