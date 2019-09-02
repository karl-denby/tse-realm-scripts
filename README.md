# TSE Realm Scripts

This is a collection of scripts that will be useful for gathering information and checking the health of a Realm instance.

## Instructions

- `$ npm install`
- `$ cp example-config.js config.js`
- Modify `config.js` to include your instance address, username/jwt token etc.
- `$ npm <script_name>`

## Available Scripts

### `node connectivity_test`

This script will use the supplied configuration values to attempt a login. If you leave a setting as an empty string, it will be ignored. If the user does not exist the script will attempt to create them. Currently supports these login providers [Username/Password, JWT].  It will log out after connecting without reading/writing any data.

Sample output:

```bash
Login complete: test-user
User Identity: d92f50b744247908056ca42e9dd409f1
```

### `node crud.js`

This script will create three people [Tom, Dick and Harry] in the configured test realm, read the created people data, perform an update to Dick's birthday and perform a delete of Harry.

Use Realm Studio to view/verify the data.
