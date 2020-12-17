const low = require("lowdb");
const Memory = require("lowdb/adapters/Memory");

const db = low(new Memory());
const users = require("./users");
db.defaults({
  users: users,
}).write();

//const store = new Map();
const logins = new Map();
const { nanoid } = require("nanoid");

class Account {
  constructor(id) {
    this.accountId = id || nanoid();
    //this.profile = profile;
    //store.set(this.accountId, this);
  }

  /**
   * @param use - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   */

  async claims(use, scope) {
    // eslint-disable-line no-unused-vars
    try {
      const id = this.accountId;
      const account = db.get("users").find({ id: id }).value();
      if (!account) {
        console.log("claims: could not find account:", id);
        return undefined;
      }
      console.log("claims: found account:", id);
      return {
        sub: this.accountId, // it is essential to always return a sub claim

        address: {
          country: "000",
          locality: "000",
          postal_code: "000",
          region: "000",
          street_address: "000",
        },
        birthdate: account.birthdate,
        email: account.email,
        email_verified: account.email_verified,
        family_name: account.family_name,
        gender: account.gender,
        given_name: account.given_name,
        locale: account.locale,
        name: account.name,
        phone_number: account.phone_number,
        phone_number_verified: account.phone_number_verified,
        roles: account.roles,
        updated_at: account.updated_at,
      };
    } catch (err) {
      console.log("claims panic:", err);
    }
  }

  static async findByFederated(provider, claims) {
    const id = `${provider}.${claims.sub}`;
    if (!logins.get(id)) {
      logins.set(id, new Account(id));
    }
    return logins.get(id);
  }

  /*
  static async findByLogin(login) {
    if (!logins.get(login)) {
      console.log('findByLogin login not found:', login)
      const lowercased = String(login).toLowerCase();
      const account = db.get('users').find({email: lowercased}).value();
      if (!account) {
        console.log('ERROR: findByLogin Unable to find accountId:', lowercased)
        return undefined;
      }

      logins.set(login, new Account(account.id));
    }

    return logins.get(login);
  }
*/
  /*
  static async findAccount(ctx, id, token) { // eslint-disable-line no-unused-vars
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context
    if (!store.get(id)) new Account(id); // eslint-disable-line no-new
    return store.get(id);
  }
  */

  static async findAccount(ctx, id, token) {
    // eslint-disable-line no-unused-vars
    // This would ideally be just a check whether the account is still in your storage
    console.log("findAccount: looking for", id);
    //const lowercased = String(email).toLowerCase();
    const account = db.get("users").find({ id: id }).value();
    if (!account) {
      console.log("ERROR: findAccount Unable to find accountId:", id);
      return undefined;
    }
    console.log("findAccount: returning account:", account.id);
    return new Account(account.id);
  }

  // This can be anything you need to authenticate a user
  static async authenticate(email, password) {
    try {
      console.log("authenticate: authenticating account:", email);
      const lowercased = String(email).toLowerCase();
      const account = db
        .get("users")
        .find({
          email: lowercased,
        })
        .value();
      console.log("authenticate: returing account:", account.id);
      return account.id;
    } catch (err) {
      console.log("authenticate panic:", err);
      return undefined;
    }
  }
}

module.exports = Account;
