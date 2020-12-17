import React from 'react';
import {storesContext} from '../stores/StoresContext'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Header from '../components/Header'
import DebugDetails from '../components/DebugDetails'
import SelectAccount from './SelectAccount'
import Login from './Login'
import Consent from './Consent'
import Oops from './Oops'

const useStyles = makeStyles((theme) => ({

  container: {
    marginTop: 90,
  },
}));


export default function App(props) {
  const classes = useStyles();
  const {globalStore} = React.useContext(storesContext)

  const handleChange = (panel) => (event, isExpanded) => {
    setArrowImage(isExpanded ? arrowImages[1] : arrowImages[0])
    setExpanded(isExpanded ? panel : false);
  };

  let view
  switch(globalStore.prompt.name) {
    case 'select_account': {
      view = <SelectAccount />
      break;
    }
    case 'login': {
      view = <Login />
      break;
    }
    case 'consent': {
      view = <Consent />
      break;
    }
    default: {
      view = <Oops />
    }
  }

  return (
    <div>
      <Header />
      <Container className={classes.container} maxWidth="sm">
        {view}
      </Container>
      <DebugDetails />
    </div>
  );
}
