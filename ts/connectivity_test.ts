// tslint:disable: no-console
import * as configuration from "./config";
import Realm = require("realm")

Realm.Sync.setLogLevel('debug')

function authUserPass (username, password, create = false) {
  const credentials = Realm.Sync.Credentials.usernamePassword(
    username,
    password,
    create
  )
  return Realm.Sync.User.login(`https://${configuration.address}`, credentials).then(user => {
    console.log(`Login complete: ${configuration.username}\nUser Identity: ${user.identity}`)
  }).catch(error => {
    if (error === 'AuthError: The provided credentials are invalid or the user does not exist.') {
      return authUserPass(username, password, true)
    } else {
      console.log('Login failed >> ' + error)
    }
  })
}

function authJwt (jwt) {
  const credentials = Realm.Sync.Credentials.jwt(jwt)
  return Realm.Sync.User.login(`https://${configuration.address}`, credentials).then(user => {
    console.log(`Login complete for ${configuration.jwt}\nUser Identity: ${user.identity}`)
  })
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