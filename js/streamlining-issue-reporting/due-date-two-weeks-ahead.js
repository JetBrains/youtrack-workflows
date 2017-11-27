var entities = require('@jetbrains/youtrack-scripting-api/entities');

var WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

exports.rule = entities.Issue.onChange({
  title: 'Set Due Date on issue submitting',
  guard: function(ctx) {
    return ctx.issue.becomesReported && !ctx.issue.fields.DueDate;
  },
  action: function(ctx) {
    ctx.issue.fields.DueDate = Date.now() + 2 * WEEK_IN_MS;
  },
  requirements: {
    DueDate: {
      type: entities.Field.dateType,
      name: 'Due Date'
    }
  }
});
