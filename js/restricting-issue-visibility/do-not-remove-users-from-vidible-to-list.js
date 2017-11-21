var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Do not remove users from "visible to" list',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.permittedUsers.removed.isNotEmpty();
  },
  action: function(ctx) {
    workflow.check(false,
      'You cannot remove other users from the "visible to" list.');
  },
  requirements: {}
});