var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Add Authorizer to the "visible to" list',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.AuthBy) && fs.AuthBy;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    issue.permittedUsers.add(issue.fields.AuthBy);
    workflow.message('The issue is now visible to ' +
      issue.fields.AuthBy.fullName);
  },
  requirements: {
    AuthBy: {
      type: entities.User.fieldType,
      name: 'Authorizer'
    }
  }
});