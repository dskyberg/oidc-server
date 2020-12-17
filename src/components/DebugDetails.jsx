import React from 'react'
import clsx from 'clsx'
import {storesContext} from '../stores/StoresContext'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
    width: '100%',
  },
  summary: {
    display: 'flex',
    alignItems: "center" ,
    justifyContent: "center",
  },
  summaryOpen: {

  },
  heading: {
    color: 'grey',
  },
  detail: {
    marginLeft: 20,
  },
  arrows: {
    marginTop:7,
    marginRight: 10,
    height: 10,
  }
}));

const arrowImages = [
    '/public/images/arrow-right.svg',
    '/public/images/arrow-up.svg'
]

export default function DebugDetails(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false)
  const [arrowImage, setArrowImage] = React.useState(arrowImages[0])
  const {globalStore, debugStore} = React.useContext(storesContext)

  const handleClick = () =>  {
      console.log('handleClick')
    const isExpanded = !expanded
    setArrowImage(isExpanded ? arrowImages[1] : arrowImages[0])
    setExpanded(isExpanded);
  };


  return (
      <div id="debug-details" className={classes.root}>
        <Box id="debug-details-summary" onClick={handleClick} className={clsx(classes.summary, expanded && classes.summaryOpen)}>
            <img src={arrowImage} alt={expanded == false ? 'arrow-right' : 'arrow-up'}  className={classes.arrows} />
            <Typography className={classes.heading}>{`(click to ${expanded===false ? 'expand' : 'close'}) DEBUG information`}</Typography>
        </Box>
        <div id="debug-details-detail" hidden={expanded === false} className={classes.detail}>
        <Grid container spacing={0}>
            <Grid item xs={2}><Typography variant="h6">uid</Typography></Grid>
            <Grid item xs={10}><pre>{JSON.stringify(globalStore.uid, null,3)}</pre></Grid>

            <Grid item xs={2}><Typography variant="h6">prompt</Typography></Grid>
            <Grid item xs={10}><pre>{JSON.stringify(globalStore.prompt, null,3)}</pre></Grid>

            <Grid item xs={2}><Typography variant="h6">client</Typography></Grid>
            <Grid item xs={10}><pre>{JSON.stringify(debugStore.client, null,3)}</pre></Grid>

            <Grid item xs={2}><Typography variant="h6">params</Typography></Grid>
            <Grid item xs={10}><pre>{JSON.stringify(debugStore.params, null,3)}</pre></Grid>

            <Grid item xs={2}><Typography variant="h6">session</Typography></Grid>
            <Grid item xs={10}><pre>{JSON.stringify(debugStore.session, null,3)}</pre></Grid>

          </Grid>
        </div>
      </div>
  );
}
