var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

var WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

exports.rule = entities.Issue.onChange({
  title: 'Prohibit adding work items far in past',
  guard: function(ctx) {
    return ctx.issue.workItems.added.isNotEmpty();
  },
  action: function(ctx) {
    ctx.issue.workItems.added.forEach(function(item) {
      var itemDate = new Date(item.date).setUTCHours(0, 0, 0, 0);
      var today = new Date().setUTCHours(0, 0, 0, 0);
      workflow.check(itemDate >= today - WEEK_IN_MS,
        'Adding work items for earlier than a week ago is not allowed!');
    });
  },
  requirements: {}
});