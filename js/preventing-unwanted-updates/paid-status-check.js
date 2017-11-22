var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Request must be authorized to be marked as paid',
  guard: function(ctx) {
    return ctx.issue.fields.becomes(ctx.State, ctx.State.Paid);
  },
  action: function(ctx) {
    var fs = ctx.issue.fields;
    workflow.check(fs.AuthStatus &&
      fs.AuthStatus.name === ctx.AuthStatus.Authorized.name,
      'Only authorized requests can be marked as paid!');
  },
  requirements: {
    AuthStatus: {
      type: entities.EnumField.fieldType,
      name: 'Authorization status',
      Authorized: {},
    },
    State: {
      type: entities.State.fieldType,
      Paid: {}
    }
  }
});