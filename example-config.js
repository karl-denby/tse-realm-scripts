module.exports = {
  username: 'test-user',
  password: 'test-password',
  jwt: '',
  address: 'my-realm-name.region.cloud.realm.io',
  path: '~/test-realm',
  gql_endpoint: `graphql/${this.path}`,
  gql_subscribe: `ws://${this.path}`,
  gql_scheme: `graphql/scheme/${this.path}`,
  gql_explore: `graphql/explore/${this.path}`
}
