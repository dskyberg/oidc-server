import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  logo: {
    height: 44,
    width: 126.5,

  }
}));

export default function Header(props) {
  const classes = useStyles();
  return (
      <AppBar elevation={1}>
          <Toolbar >
            <img src="/public/images/idp_logo.svg" alt="logo" className={classes.logo} />
          </Toolbar>
      </AppBar>
  );
}
