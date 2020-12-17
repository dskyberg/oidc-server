import React from 'react'
import fetch from '../util/fetch'
import {storesContext} from '../stores/StoresContext'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FormHeader from '../components/FormHeader'
const useStyles = makeStyles((theme) => ({
    root: {
      width: 550,
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
    bottomButton: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 10,
      width: '100%',
      height: 48,
    },
    topButton: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      height: 48,
      backgroundColor: '#008140',
    }
    }));


 export default function Login(props) {
    const classes = useStyles();
    const {globalStore} = React.useContext(storesContext)

    const handleContinue = (event) => {
      //post interaction/uid/continue
      fetch(globalStore.uris.fail, formData)
    }

    const handleChange = (event) => {
      let formData = {
        switch: true,
      }
      fetch(globalStore.uris.success, formData)
    }

    return (
      <Card className={classes.root} >
        <CardContent>
          <FormHeader />
        </CardContent>

        <CardContent>
          <Button variant="contained" color="primary" className={classes.topButton} onClick={handleContinue}>
            <Typography display="inline">Continue as </Typography>
            <Typography>{globalStore.email}</Typography>
          </Button>
          <Button variant="contained" className={classes.bottomButton}>Switch account</Button>
        </CardContent>
      </Card>
    );
}

