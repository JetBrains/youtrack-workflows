var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Only Executors can change Authorizer in authorized requests',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.AuthBy) &&
      fs.AuthStatus.name === ctx.AuthStatus.Authorized.name;
  },
  action: function(ctx) {
    workflow.check(ctx.currentUser.isInGroup(ctx.executors.name),
      'Only Executors can change the Authorizer ' +
      'after the request has been authorized!');
    ctx.issue.fields.AuthStatus = ctx.AuthStatus.Required;
  },
  requirements: {
    AuthBy: {
      type: entities.User.fieldType,
      name: 'Authorizer'
    },
    AuthStatus: {
      type: entities.EnumField.fieldType,
      name: 'Authorization status',
      Authorized: {},
      Required: {}
    },
    executors: {
      type: entities.UserGroup
    }
  }
});