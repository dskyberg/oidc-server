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

const useStyles = makeStyles((theme) => ({
    logo: {
      height: 42,
      width: 126.5,
    },
    }));

export default function FormHeader(props) {
    const classes = useStyles();
    const {globalStore} = React.useContext(storesContext)
    const {title} = globalStore

    return (
        <React.Fragment>
          <Box display="flex" width="100%"  alignItems="center" justifyContent="center">
            <img src="/public/images/idp_logo.svg" alt="logo" className={classes.logo} />
        </Box>
        <Box display="flex" width="100%"  alignItems="center" justifyContent="center">
          <Typography variant="h4">{title}</Typography>
        </Box>
        </React.Fragment>
    )
}