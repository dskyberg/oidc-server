import React from 'react'
import {storesContext} from '../stores/StoresContext'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import FormHeader from '../components/FormHeader'

const useStyles = makeStyles((theme) => ({
    root: {
      width: 450,
      marginTop: 20
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
      },
      tos: {
        marginLeft: 'auto',
        marginRight: 10,
        width: '50%',
      },
      privacy: {
        marginLeft: 10,
        marginRight: 'auto',
        width: '50%',
      },
    }
));

 export default function Consent(props) {
    const classes = useStyles();
    const {globalStore} = React.useContext(storesContext)

    const newAuthorization = (details) => {
        if ([details.scopes.accepted, details.scopes.rejected, details.claims.accepted, details.claims.rejected].every(({ length }) => length === 0)) {
            return <li>This is a new authorization</li>
        }
        return null
    }

    const previouslyConfirmed = (details) => {
        if ([details.scopes.new, details.claims.new].every(({ length }) => length === 0)) {
           return  <li>The client is asking you to confirm previously given authorization</li>
        }
        return null
    }

    const listNewScopes = (details) => {
        const newScopes = new Set(details.scopes.new); newScopes.delete('openid'); newScopes.delete('offline_access')
        if (newScopes.size) {
            return (
                <React.Fragment>
                    <li>scopes:</li>
                    <ul>
                        { Array.from(newScopes).map( (scope, key) => <li key={key}>{scope}</li>)
                        }
                    </ul>
                </React.Fragment>
            )
        }
        return null
    }

    const listNewClaims = (details) => {
        const newClaims = new Set(details.claims.new); ['sub', 'sid', 'auth_time', 'acr', 'amr', 'iss'].forEach(Set.prototype.delete.bind(newClaims))
        if (newClaims.size) {
            return (
                <React.Fragment>
                    <li>claims:</li>
                    <ul>
                        {Array.from(newClaims).map((claim, key) => <li key={key}>{claim}</li>)}
                    </ul>
                </React.Fragment>
            )
        }
        return null
    }

    const isOfflineAccess = (details, params) => {
        let message = 'the client is asking to have offline access to this authorization'
        if (!details.scopes.new.includes('offline_access')) {
            message = message + ' (which you\'ve previously granted)'
        }
        if (params.scope && params.scope.includes('offline_access')) {
            return (
                <li>
                    {message}
                </li>
            )
        }
        return null
    }

    const listScopesAndClaims = (details, params) => {
        return (
            <ul>
                {newAuthorization(details)}
                {previouslyConfirmed(details)}
                {listNewScopes(details)}
                {listNewClaims(details)}
                {isOfflineAccess(details, params)}
            </ul>
        )
    }

    return (
      <Card className={classes.root} >
        <CardContent>
            <FormHeader />
        </CardContent>
        <CardContent>
            {listScopesAndClaims(globalStore.prompt.details, globalStore.params)}
        </CardContent>
        <CardActions>
            <Button variant="contained" className={classes.leftButton}>Decline</Button>
            <Button variant="contained" color="primary" className={classes.rightButton} >Accept</Button>
        </CardActions>
        <CardContent>
            <Box display="flex" margin={3}>
            <Typography display="inline" variant="body1" className={classes.tos}>[Terms of Service]</Typography>
            <Typography display="inline" variant="body1" className={classes.privacy}>[Privacy Policy]</Typography>
            </Box>
        </CardContent>
      </Card>
    );
}

