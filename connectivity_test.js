/* eslint-disable no-console */
var Realm = require("realm");
var Config = require("./config");

Realm.Sync.setLogLevel("debug");

function openRealmAsUser(user) {
    let config = user.createConfiguration({
        sync: {
            url: `realms://${Config.address}${Config.path}`,
            fullSynchronization: true,
        },
        schema: []
    });
    return Realm.open(config);
}

function authUserPass(username, password, create = false) {
    let credentials = Realm.Sync.Credentials.usernamePassword(
        username,
        password,
        create
    );
    return Realm.Sync.User.login(`https://${Config.address}`, credentials).then(user => {
        console.log("Login complete: " + Config.username + "\nuser Identity: " + user.identity)
    }).catch(error => {
        if (error == "AuthError: The provided credentials are invalid or the user does not exist.") {
            // If the users doesn't exist, catch this and try to create the user
            return authUserPass(username, password, true)
        } else {
            // Log whatever the problem was
            console.log("Login failed >> " + error)
        }
    });
}

function authJwt(jwt) {
    let credentials = Realm.Sync.Credentials.jwt(jwt)
    return Realm.Sync.User.login(`https://${Config.address}`, credentials).then(user => {
        console.log("Login complete for " + Config.jwt + "\nuser Identity: " + user.identity)
    });
}

async function main() {

    if (Config.username != "" && Config.password != "") {
        await authUserPass(Config.username, Config.password)
    }

    if (Config.jwt != "") {
        await authJwt(Config.jwt);
    }

    if (Realm.Sync.User.current) {
        Realm.Sync.User.current.logout();
        console.log("Logout complete")
    }

}

main()