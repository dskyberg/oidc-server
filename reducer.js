const { conformIdTokenClaims } = require("oidc-provider/lib/helpers/defaults");

const arrys = [
    [1,2,3,4],
    [5,6,7,8],
    [1,4,6,7],
    [9]
];

const claims = {
    address: ['address'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name', 'updated_at'],
};

const scopes = ["email", "profile", 'blah']
const keys = Object.keys(claims)
console.log('keys:',keys)
const scope_claims = Array.from(new Set(scopes.map(scope => {
    if(keys.includes(scope))
    {
        return claims[scope]
    }
    return []
}).flat()));
console.log('scopes:', scope_claims)
