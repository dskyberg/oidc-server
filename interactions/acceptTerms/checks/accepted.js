const { interactionPolicy: { Check} } = require('oidc-provider');
const CHECK_NAME = 'my_check'
const FAIL_MESSAGE = 'End-User acceptance of terms and conditions could not be obtained';
module.exports = () => new Check(CHECK_NAME, FAIL_MESSAGE, (ctx) => {
    const { oidc } = ctx;
    return false;
});