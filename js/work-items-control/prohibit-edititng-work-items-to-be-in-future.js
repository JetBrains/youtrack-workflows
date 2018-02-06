var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Prohibit editing work items to be in future',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.ST) || ctx.issue.editedWorkItems.isNotEmpty();
  },
  action: function(ctx) {
    var issue = ctx.issue;
    console.log(issue.editedWorkItems.isNotEmpty());
    if (issue.editedWorkItems.isNotEmpty()) {
      issue.editedWorkItems.forEach(function(item) {
        var itemDate = new Date(item.date).setUTCHours(0, 0, 0, 0);
        var today = new Date().setUTCHours(0, 0, 0, 0);
        workflow.check(itemDate <= today,
          'Editing work items to be in future is not allowed!');
      });
    }
  },
  requirements: {
    ST: {
      type: entities.Field.periodType,
      name: 'Spent time'
    }
  }
});