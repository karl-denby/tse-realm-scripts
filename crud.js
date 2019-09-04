/* eslint-disable no-console */
var Realm = require('realm');
var Config = require('./config');
Realm.Sync.setLogLevel('debug');
// Define your models and their properties
const CarSchema = {
    name: 'Car',
    properties: {
        make: 'string',
        model: 'string',
        miles: {
            type: 'int',
            default: 0
        }
    }
};
const PersonSchema = {
    name: 'Person',
    primaryKey: 'name',
    properties: {
        name: 'string',
        birthday: { type: 'date', indexed: true },
        cars: 'Car[]',
        picture: 'data?'
    }
};
function authUserPass(username, password, create = false) {
    const credentials = Realm.Sync.Credentials.usernamePassword(username, password, create);
    return Realm.Sync.User.login(`https://${Config.address}`, credentials).then(user => {
        console.log(`Login complete: ${Config.username}\nUser Identity: ${user.identity}`);
    }).catch(error => {
        if (error === 'AuthError: The provided credentials are invalid or the user does not exist.') {
            return authUserPass(username, password, true);
        }
        else {
            console.log('Login failed >> ' + error);
        }
    });
}
function authJwt(jwt) {
    const credentials = Realm.Sync.Credentials.jwt(jwt);
    return Realm.Sync.User.login(`https://${Config.address}`, credentials).then(user => {
        console.log(`Login complete for ${Config.jwt}\nUser Identity: ${user.identity}`);
    });
}
async function main() {
    let loggedInUser = '';
    if (Config.username !== '' && Config.password !== '') {
        loggedInUser = await authUserPass(Config.username, Config.password);
    }
    if (Config.jwt !== '') {
        loggedInUser = await authJwt(Config.jwt);
    }
    const user = await Realm.Sync.User.current;
    const config = await user.createConfiguration({
        sync: {
            url: `realms://${Config.address}${Config.path}`,
            fullSynchronization: true,
            error: err => console.log(err)
        },
        schema: [CarSchema, PersonSchema]
    });
    // Async Open
    await Realm.open(config).then(realm => {
        console.log('Async first open');
    }).catch(error => {
        console.log(error);
    });
    // Sync Open
    const realm = new Realm(config);
    // Create
    realm.write(() => {
        realm.create('Person', {
            name: 'Tom',
            birthday: '2000-01-01',
            car: {
                make: 'Toyota',
                model: 'Tank',
                miles: 12345
            }
        });
        realm.create('Person', {
            name: 'Dick',
            birthday: '2000-01-01',
            car: {
                make: 'Datsun',
                model: 'on-Do',
                miles: 54321
            }
        });
        realm.create('Person', {
            name: 'Harry',
            birthday: '2000-01-01',
            car: {
                make: 'Honda',
                model: 'H100S',
                miles: 987213
            }
        });
    });
    // Read
    let results = realm.objects('Person').filtered('birthday == $0', '2000-01-01');
    console.log(`Found ${results.length} people named with a birthday of 2000-01-01`);
    // Update
    results = realm.objects('Person').filtered('name == $0', 'Dick');
    realm.write(() => {
        results.update('birthday', '1999-09-09');
    });
    console.log('Update Dicks birthday');
    // Delete
    results = realm.objects('Person').filtered('name == $0', 'Harry');
    realm.write(() => {
        realm.delete(results);
    });
    console.log('Deleted Harry');
    if (loggedInUser) {
        Realm.Sync.User.current.logout();
        console.log('Logout complete');
    }
}
main();
//# sourceMappingURL=crud.js.map