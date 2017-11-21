// This rule assumes that issue visibility is set to a specific group
// at the moment when an issue becomes reported.
// Each project has its own visibility group.

var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Block changes to visibility group for reported issues',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.isReported && !issue.becomesReported &&
      issue.isChanged('permittedGroups');
  },
  action: function(ctx) {
    workflow.check(false,
      'You cannot change group visibility restrictions for reported issues. ' +
      'Instead, you can add single users to the "visible to" list.');
  },
  requirements: {}
});