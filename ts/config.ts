module.exports = {
  address: "this-is-the-future.de1a.cloud.realm.io",
  gql_endpoint: `graphql/${this.path}`,
  gql_explore: `graphql/explore/${this.path}`,
  gql_scheme: `graphql/scheme/${this.path}`,
  gql_subscribe: `ws://${this.path}`,
  jwt: "",
  password: "test-password",
  path: "~/test-realm",
  username: "test-user",
};
