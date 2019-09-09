// tslint:disable: no-console
import "./util";

function authUserPass(username, password, create = false) {
  const credentials = Realm.Sync.Credentials.usernamePassword(
    username,
    password,
    create,
  );
  return Realm.Sync.User.login(`https://${this.address}`, credentials).then((user) => {
    console.log(`Login complete: ${username}\nUser Identity: ${user.identity}`);
  }).catch((error) => {
    if (error === "AuthError: The provided credentials are invalid or the user does not exist.") {
      return authUserPass(username, password, true);
    } else {
      console.log("Login failed >> " + error);
    }
  });
}

function authJwt(jwt) {
  const credentials = Realm.Sync.Credentials.jwt(jwt);
  return Realm.Sync.User.login(`https://${this.address}`, credentials).then((user) => {
    console.log(`Login complete for ${this.jwt}\nUser Identity: ${user.identity}`);
  });
}

async function main() {
  let loggedInUser: any;
  if (this.username !== "" && this.password !== "") {
    loggedInUser = await authUserPass(this.username, this.password);
  }

  if (this.jwt !== "") {
    loggedInUser = await authJwt(this.jwt);
  }

  const user = await Realm.Sync.User.current;
  const config = await user.createConfiguration({
    sync: {
      error: (err) => console.log(err),
      fullSynchronization: true,
      url: `realms://${this.address}${this.path}`,
    },
  });
  // Async Open
  await Realm.open(config).then((realmIsOpen) => {
    realmIsOpen ? console.log(`Async first open`) : console.log(`Error`);
  }).catch((error) => {
    console.log(error);
  });
  // Sync Open
  const realm = new Realm(config);
  // Create
  realm.write(() => {
    realm.create("Person", {
      birthday: "2000-01-01",
      car: {
        make: "Toyota",
        miles: 12345,
        model: "Tank",
      },
      name: "Tom",
    });
    realm.create("Person", {
      birthday: "2000-01-01",
      car: {
        make: "Datsun",
        miles: 54321,
        model: "on-Do",
      },
      name: "Dick",
    });
    realm.create("Person", {
      birthday: "2000-01-01",
      car: {
        make: "Honda",
        miles: 987213,
        model: "H100S",
      },
      name: "Harry",
    });
  });

  // Read
  let results = realm.objects("Person").filtered("birthday == $0", "2000-01-01");
  console.log(`Found ${results.length} people named with a birthday of 2000-01-01`);

  // Update
  results = realm.objects("Person").filtered("name == $0", "Dick");
  realm.write(() => {
    results.update("birthday", "1999-09-09");
  });
  console.log("Update Dicks birthday");

  // Delete
  results = realm.objects("Person").filtered("name == $0", "Harry");
  realm.write(() => {
    realm.delete(results);
  });
  console.log("Deleted Harry");

  if (loggedInUser) {
    Realm.Sync.User.current.logout();
    console.log("Logout complete");
  }
}

main();
