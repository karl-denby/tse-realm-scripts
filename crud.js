var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* eslint-disable no-console */
var Realm = require('realm');
var Config = require('./config');
Realm.Sync.setLogLevel('debug');
// Define your models and their properties
var CarSchema = {
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
var PersonSchema = {
    name: 'Person',
    primaryKey: 'name',
    properties: {
        name: 'string',
        birthday: { type: 'date', indexed: true },
        cars: 'Car[]',
        picture: 'data?'
    }
};
function authUserPass(username, password, create) {
    if (create === void 0) { create = false; }
    var credentials = Realm.Sync.Credentials.usernamePassword(username, password, create);
    return Realm.Sync.User.login("https://" + Config.address, credentials).then(function (user) {
        console.log("Login complete: " + Config.username + "\nUser Identity: " + user.identity);
    }).catch(function (error) {
        if (error === 'AuthError: The provided credentials are invalid or the user does not exist.') {
            return authUserPass(username, password, true);
        }
        else {
            console.log('Login failed >> ' + error);
        }
    });
}
function authJwt(jwt) {
    var credentials = Realm.Sync.Credentials.jwt(jwt);
    return Realm.Sync.User.login("https://" + Config.address, credentials).then(function (user) {
        console.log("Login complete for " + Config.jwt + "\nUser Identity: " + user.identity);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var loggedInUser, user, config, realm, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggedInUser = '';
                    if (!(Config.username !== '' && Config.password !== '')) return [3 /*break*/, 2];
                    return [4 /*yield*/, authUserPass(Config.username, Config.password)];
                case 1:
                    loggedInUser = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!(Config.jwt !== '')) return [3 /*break*/, 4];
                    return [4 /*yield*/, authJwt(Config.jwt)];
                case 3:
                    loggedInUser = _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, Realm.Sync.User.current];
                case 5:
                    user = _a.sent();
                    return [4 /*yield*/, user.createConfiguration({
                            sync: {
                                url: "realms://" + Config.address + Config.path,
                                fullSynchronization: true,
                                error: function (err) { return console.log(err); }
                            },
                            schema: [CarSchema, PersonSchema]
                        })
                        // Async Open
                    ];
                case 6:
                    config = _a.sent();
                    // Async Open
                    return [4 /*yield*/, Realm.open(config).then(function (realm) {
                            console.log('Async first open');
                        }).catch(function (error) {
                            console.log(error);
                        })
                        // Sync Open
                    ];
                case 7:
                    // Async Open
                    _a.sent();
                    realm = new Realm(config);
                    // Create
                    realm.write(function () {
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
                    results = realm.objects('Person').filtered('birthday == $0', '2000-01-01');
                    console.log("Found " + results.length + " people named with a birthday of 2000-01-01");
                    // Update
                    results = realm.objects('Person').filtered('name == $0', 'Dick');
                    realm.write(function () {
                        results.update('birthday', '1999-09-09');
                    });
                    console.log('Update Dicks birthday');
                    // Delete
                    results = realm.objects('Person').filtered('name == $0', 'Harry');
                    realm.write(function () {
                        realm.delete(results);
                    });
                    console.log('Deleted Harry');
                    if (loggedInUser) {
                        Realm.Sync.User.current.logout();
                        console.log('Logout complete');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=crud.js.map