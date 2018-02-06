var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Prohibit deleting work items',
  guard: function(ctx) {
    var items = ctx.issue.workItems;
    return items.added.isEmpty() && items.removed.isNotEmpty();
  },
  action: function(/* ctx */) {
    workflow.check(false, 'Work items are not allowed to be removed!');
  },
  requirements: {}
});