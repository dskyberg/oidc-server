## How-To
### Prerequisits
* OIDC Client: This server was tested with https://github.com/dskyberg/oidc-client-spa
* Node: Before you begin, ensure Node is installed.  This has been tested with Node 14.0.4.

Download this repository
````bash
$ git clone https://github.com/dskyberg/oidc-server.git
````

Install the node components
````bash
$ cd oidc-server
$ npm install
````

Run the server
````bash
$ npm start
````
The server should be running

## Accounts (Users)
The user accounts are defined in [support/users.js](./spport/users.js)

Paswords are not currently validated by the server.  So, no passwords are in the users.js file.

To change any account attributes, just update an account in users.js and restart the server.
## Clients
Clients are currently configured directly in [support/configuration.js](./support/configuration.js), near the top of the file.

To modify or add a client, simply update configuration.js and restart the server.
