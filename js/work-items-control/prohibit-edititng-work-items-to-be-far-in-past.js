var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

var WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

exports.rule = entities.Issue.onChange({
  title: 'Prohibit editing work items to be far in past',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.ST) || ctx.issue.editedWorkItems.isNotEmpty();
  },
  action: function(ctx) {
    var issue = ctx.issue;
    if (issue.editedWorkItems.isNotEmpty()) {
      issue.editedWorkItems.forEach(function(item) {
        var itemDate = new Date(item.date).setUTCHours(0, 0, 0, 0);
        var today = new Date().setUTCHours(0, 0, 0, 0);
        workflow.check(itemDate >= today - WEEK_IN_MS,
          'Editing work items to be earlier than a week ago is not allowed!');
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