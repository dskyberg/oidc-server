import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

const useStyles = makeStyles((theme) => ({
    root: {
      width: 450,
      marginTop: 20
    },
    }));


 export default function Login(props) {
    const classes = useStyles();

    return (
      <Card className={classes.root} >
        <CardContent>
        <Typography variant="h4">Oops!</Typography>
        <Typography variant="h6">Something went wrong</Typography>
        </CardContent>
      </Card>
    );
}

