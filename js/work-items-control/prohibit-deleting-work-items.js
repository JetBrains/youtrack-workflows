var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Prohibit deleting work items',
  guard: function(ctx) {
    return ctx.issue.workItems.removed.isNotEmpty();
  },
  action: function(/* ctx */) {
    workflow.check(false, 'Work items are not allowed to be removed!');
  },
  requirements: {}
});