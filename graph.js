"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Realm = require('realm');
var Config = require('./config');
const realm_graphql_client_1 = require("realm-graphql-client");
async function main() {
    const credentials = realm_graphql_client_1.Credentials.usernamePassword(Config.username, Config.password);
    const user = await realm_graphql_client_1.User.authenticate(credentials, `https://${Config.address}`);
    console.log(user);
}
main();
//# sourceMappingURL=graph.js.map