# TSE Realm Scripts

This is a collection of scripts that will be useful for gathering information and checking the health of a Realm instance.

## Instructions

- `$ npm install`
- `$ cp ts/example-config.ts ts/config.ts`
- Modify `config.ts` to include your instance address, username/jwt token etc.
- Use typescript to create the javascript files `tsc --build ts/tsconfig.json`
- `$ npm <script_name>`

## Available Scripts

### `node connectivity_test`

This script will use the supplied configuration values to attempt a login. If you leave a setting as an empty string, it will be ignored. If the user does not exist the script will attempt to create them. Currently supports these login providers [Username/Password, JWT].  It will log out after connecting without reading/writing any data. If an email address is included, it will send a confirmation email.

Sample output:

```bash
Login complete: test-user
User Identity: d92f50b744247908056ca42e9dd409f1
```

### `node crud`

This script will create three people [Tom, Dick and Harry] in the configured test realm, read the created people data, perform an update to Dick's birthday and perform a delete of Harry.

Use Realm Studio to view/verify the data.
