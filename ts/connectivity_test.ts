// tslint:disable: no-console
import * as configuration from "./config";
import Realm = require("realm")

Realm.Sync.setLogLevel('debug')

function authUserPass (username: string, password: string, create = false) {
  const credentials = Realm.Sync.Credentials.usernamePassword(
    username,
    password,
    create
  )
  return Realm.Sync.User.login(`https://${configuration.address}`, credentials).then(user => {
    console.log(`Login complete: ${configuration.username}\nUser Identity: ${user.identity}`)
    console.log("Requesting Email confirmation")
    if (configuration.confirmation_email != "") {
      Realm.Sync.User.requestEmailConfirmation(`https://${configuration.address}` ,configuration.confirmation_email).then(() => {
          console.log("Mail Sent")
      }).catch((error) => {
          console.log(error)
      });
    }
  }).catch(error => {
    if (error === 'AuthError: The provided credentials are invalid or the user does not exist.') {
      return authUserPass(username, password, true)
    } else {
      console.log('Login failed >> ' + error)
    }
  })
}

async function authJwt (jwt: string) {
  const credentials = Realm.Sync.Credentials.jwt(jwt)
  const user = await Realm.Sync.User.login(`https://${configuration.address}`, credentials);
    console.log(`Login complete for ${configuration.jwt}\nUser Identity: ${user.identity}`);
}

async function main () {
  let loggedInUser: any = ""
  if (configuration.username !== '' && configuration.password !== '') {
    loggedInUser = await authUserPass(configuration.username, configuration.password)
  }

  if (configuration.jwt !== '') {
    loggedInUser = await authJwt(configuration.jwt)
  }

  if (loggedInUser) {
    Realm.Sync.User.current.logout()
    console.log('Logout complete')
  }
}

main()