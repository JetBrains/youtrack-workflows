var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Set "Visible to" user on submit',
  guard: function(ctx) {
    return ctx.issue.becomesReported;
  },
  action: function(ctx) {
    ctx.issue.permittedUsers.add(ctx.issue.reporter);
  }
});