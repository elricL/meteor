if (!Meteor.accounts) {
  Meteor.accounts = {};
}

if (!Meteor.accounts._options) {
  Meteor.accounts._options = {};
}

// xcxc describe options
// - unsafePasswordChanges
// - requireEmail
// - requireUsername
// - ADD: optionalEmail
// - ADD: loginWithEmail
// - ADD: sendValidationEmails
Meteor.accounts.config = function(options) {
  Meteor.accounts._options = options;
};

Meteor.accounts.askPasswordAgain = function () {
  // xcxc this could theoretically be better if once you set an email
  // it hides the "password again"...?
  return !Meteor.accounts._options.requireEmail;
};


// internal login tokens collection. Never published.
Meteor.accounts._loginTokens = new Meteor.Collection(
  "accounts._loginTokens",
  null /*manager*/,
  null /*driver*/,
  true /*preventAutopublish*/);

// Users table. Don't use the normal autopublish, since we want to hide
// some fields. Code to autopublish this is in accounts_server.js.
Meteor.users = new Meteor.Collection(
  "users",
  null /*manager*/,
  null /*driver*/,
  true /*preventAutopublish*/);

// Thrown when trying to use a login service which is not configured
Meteor.accounts.ConfigError = function(description) {
  this.message = description;
};
