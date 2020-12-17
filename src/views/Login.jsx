import React from 'react'
import {storesContext} from '../stores/StoresContext'
import fetch from '../util/fetch'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import FormHeader from '../components/FormHeader'

import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
    root: {
      width: 450,
      marginTop: 20
    },
    input: {
      marginLeft: 0,
      marginRight: 60,
    },
    label: {
      marginLeft:0,
      marginBottom: 20,
    },
    margin: {
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 20,
      width: '100%',
    },
    logo: {
      height: 44,
      width: 126.5,
    },
    leftButton: {
      marginLeft: 'auto',
      marginRight: 10,
      width: '50%',
      height: 48,
    },
    rightButton: {
      marginLeft: 10,
      marginRight: 'auto',
      width: '50%',
      height: 48,
      backgroundColor: '#008140',
    }
    }));


 export default function Login(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const {globalStore} = React.useContext(storesContext)

    const handleChange = (event) => {
      setChecked(event.target.checked );
    }
    const handleUsernameChange = (event) => {
      setUsername(event.target.value)
    }
    const handlePasswordChange = (event) => {
      setPassword(event.target.value)
    }

    const handleLoginClick = () => {
      let formData = {
        login: username,
        password: password
      }
      fetch(globalStore.uris.continue, formData)
    }

    const handleCancelClick = () => {
      fetch(globalStore.uris.abort, formData)
    }
    return (
      <Card className={classes.root} >

        <CardContent>
          <FormHeader />
        </CardContent>

        <CardContent>

          <FormControl className={classes.margin} variant="outlined">
            <FormHelperText id="username-helper-text">Username</FormHelperText>
            <OutlinedInput
              id="username"
              className={classes.input}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              labelWidth={0}
              value={username}
              onChange={handleUsernameChange}
            />
            {globalStore.flash !== null &&
            <FormHelperText id="username-helper-text" error>{globalStore.flash}</FormHelperText>
            }
          </FormControl>

          <FormControl className={classes.margin} variant="outlined">
            <FormHelperText id="password-helper-text">Password</FormHelperText>
            <OutlinedInput
              id="password"
              className={classes.input}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              type="password"
              value={password}
              labelWidth={0}
              onChange={handlePasswordChange}
            />
          </FormControl>

          <FormControlLabel
            className={classes.margin}
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                name="remember-me"
                color="primary"
              />
            }
            label="Remember Me"
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" className={classes.leftButton}>Cancel</Button>
          <Button variant="contained" color="primary" className={classes.rightButton} onClick={handleLoginClick}>Sign In</Button>
        </CardActions>
        <CardContent>
          <Typography variant="body1" className={classes.margin}>Forgot Username or Password?</Typography>
          <Typography variant="body1" className={classes.margin}>Setup Online Access</Typography>
        </CardContent>
      </Card>
    );
}

