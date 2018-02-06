var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Prohibit deleting work items',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.ST);
  },
  action: function(ctx) {
    var issue = ctx.issue;
    if (issue.workItems.added.isEmpty()) {
      workflow.check(issue.workItems.removed.isEmpty(),
        'Work items are not allowed to be removed!');
    }
  },
  requirements: {
    ST: {
      type: entities.Field.periodType,
      name: 'Spent time'
    }
  }
});