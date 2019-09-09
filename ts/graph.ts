// tslint:disable: no-console
import * as configuration from "./config";
import Realm = require("realm")
import { Credentials, User } from 'realm-graphql-client';

async function main () {
  const credentials = Credentials.usernamePassword(configuration.username, configuration.password);
  const user = await User.authenticate(credentials, `https://${configuration.address}`);
  console.log(user)
}

main()
