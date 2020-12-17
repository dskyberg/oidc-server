const { interactionPolicy: { Prompt } } = require('oidc-provider'); // require('oidc-provider');
const accepted = require('./accepted');

module.exports = () => new Prompt(
    {name: 'accept_terms', requestable: true},
    (ctx) => {
        const {oidc} = ctx;
        return {
            // Values to be passed to the Checks.
        }
    },
    // Check to make
    accepted(),
);
