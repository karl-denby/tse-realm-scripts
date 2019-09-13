// tslint:disable: no-console
import Realm = require("realm");
import { Credentials, User } from "realm-graphql-client";
import * as configuration from "./config";

async function main() {
  const credentials = Credentials.usernamePassword(configuration.username, configuration.password);
  const user = await User.authenticate(credentials, `https://${configuration.address}`);
  console.log(user);
}

main();
