var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.action({
  title: 'Create a swag subtask',
  command: 'swag-subtask',
  guard: function(ctx) {
    return ctx.issue.isReported;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var newIssue = new entities.Issue(ctx.currentUser, issue.project,
      'Swag at ' + issue.fields.Destination);
    newIssue.fields.Type = ctx.Type.Swag;
    newIssue.links['subtask of'].add(issue);
  },
  requirements: {
    Destination: {
      type: entities.Field.stringType
    },
    Type: {
      type: entities.EnumField.fieldType,
      Swag: {}
    }
  }
});