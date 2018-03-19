var entities = require('@jetbrains/youtrack-scripting-api/entities');
var timeOp = require('./time-operations');

// Number of business hours to reply to the new issue.
var NEW_ISSUE_SLA = 3;

exports.rule = entities.Issue.onChange({
  title: 'New Issue SLA',
  guard: function(ctx) {
    return ctx.issue.becomesReported;
  },
  action: function(ctx) {
    ctx.issue.fields.ToReply = timeOp.addBusinessHours(Date.now(), NEW_ISSUE_SLA);
  },
  requirements: {
    ToReply: {
      type: entities.Field.dateTimeType,
      name: 'To reply before'
    }
  }
});