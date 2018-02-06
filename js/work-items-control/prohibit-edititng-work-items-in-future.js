var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Prohibit editing work items in future',
  guard: function(ctx) {
    return ctx.issue.editedWorkItems.isNotEmpty();
  },
  action: function(ctx) {
    ctx.issue.editedWorkItems.forEach(function(item) {
      var itemDate = new Date(item.date).setUTCHours(0, 0, 0, 0);
      var today = new Date().setUTCHours(0, 0, 0, 0);
      workflow.check(itemDate <= today,
        'Editing work items to be in future is not allowed!');
    });
  },
  requirements: {}
});