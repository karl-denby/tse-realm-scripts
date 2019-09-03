var Realm = require('realm')
var Config = require('./config')
import { Credentials, User } from 'realm-graphql-client';

async function main () {
  const credentials = Credentials.usernamePassword(Config.username, Config.password);
  const user = await User.authenticate(credentials, `https://${Config.address}`);
  console.log(user)
}

main()
