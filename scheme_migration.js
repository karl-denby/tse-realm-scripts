/* eslint-disable no-console */
var Realm = require('realm')
var Config = require('./config')
var Scheme = require('./scheme')

Realm.Sync.setLogLevel('debug')

function openRealmAsUser (user) {
  const config = user.createConfiguration({
    sync: {
      url: `realms://${Config.address}${Config.path}`,
      fullSynchronization: true
    },
    schema: [Scheme.CarSchema, Scheme.PersonSchema]
  })
  return Realm.open(config).then(realm => {
    realm.write(() => {
      const myCar = realm.create('Car', {
        make: 'Honda',
        model: 'Civic',
        miles: 1000
      })
      myCar.miles += 20 // Update a property value
    })
  })
}

function authUserPass (username, password, create = false) {
  const credentials = Realm.Sync.Credentials.usernamePassword(
    username,
    password,
    create
  )
  return Realm.Sync.User.login(`https://${Config.address}`, credentials).then(user => {
    console.log(`Login complete: ${Config.username}\nuser Identity: ${user.identity}`)
    openRealmAsUser(user)
  }).catch(error => {
    if (error === 'AuthError: The provided credentials are invalid or the user does not exist.') {
      // If the users doesn't exist, catch this and try to create the user
      return authUserPass(username, password, true)
    } else {
      // Log whatever the problem was
      console.log('>> Login failed <<\n' + error)
    }
  })
}

function authJwt (jwt) {
  const credentials = Realm.Sync.Credentials.jwt(jwt)
  return Realm.Sync.User.login(`https://${Config.address}`, credentials).then(user => {
    console.log(`Login complete for ${Config.jwt} + \nuser Identity: ${user.identity}`)
  })
}

async function main () {
  let realmUser = ''

  if (Config.username !== '' && Config.password !== '') {
    realmUser = await authUserPass(Config.username, Config.password)
  }

  if (Config.jwt !== '') {
    realmUser = await authJwt(Config.jwt)
  }

  if (realmUser !== '') {
    Realm.Sync.User.current.logout()
    console.log('Logout complete')
  }
}

main()
