var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Only Authorizers can update value for Authorization status field',
  guard: function(ctx) {
    return ctx.issue.fields.becomes(ctx.AuthStatus,
      ctx.AuthStatus.Authorized);
  },
  action: function(ctx) {
    var authBy = ctx.issue.fields.AuthBy;
    workflow.check(authBy && authBy.login === ctx.currentUser.login,
      'Only Authorizers can update this field!');
  },
  requirements: {
    AuthBy: {
      type: entities.User.fieldType,
      name: 'Authorizer'
    },
    AuthStatus: {
      type: entities.EnumField.fieldType,
      name: 'Authorization status',
      Authorized: {}
    }
  }
});