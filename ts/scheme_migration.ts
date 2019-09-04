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

async function migrate () {
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

migrate()
