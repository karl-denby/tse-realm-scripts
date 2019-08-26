# TSE Realm Scripts

This is a collection of scripts that will be useful for gathering information and checking the health of a Realm instance.

## Instructions

- modify `config.js` to include your instance address, username/jwt token etc.
- `$ npm install`
- `$ npm <script_name>`

## Available Scripts

### `$node connectivity_test`

This script will use the supplied configuration values to attempt a login. If you leave a setting as an empty string, it will be ignored. If the user does not exist the script will attempt to create them. Currently supports these login providers [Username/Password, JWT]
