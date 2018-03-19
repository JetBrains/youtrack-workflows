var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onSchedule({
  title: 'Set "overdue" tag',
  cron: '0 * * * * ?',
  search: 'State: Open, New has: {To reply before} tag: -overdue',
  action: function(ctx) {
    var toReply = ctx.issue.fields.ToReply;
    if (toReply < Date.now()) {
      ctx.issue.addTag(ctx.overdue.name);
    }
  },
  requirements: {
    ToReply: {
      type: entities.Field.dateTimeType,
      name: 'To reply before'
    },
    overdue: {
      type: entities.IssueTag
    }
  }
});