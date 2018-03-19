var entities = require('@jetbrains/youtrack-scripting-api/entities');
var timeOp = require('./time-operations');

// Number of business hours to reply to the replied issue.
var REPLIED_ISSUE_SLA = 4;

exports.rule = entities.Issue.onChange({
  title: 'Replied Issue SLA',
  guard: function(ctx) {
    var comments = ctx.issue.comments;
    return comments.added.isNotEmpty() &&
      comments.added.last().author.login === ctx.helpdeskBot.login;
  },
  action: function(ctx) {
    ctx.issue.fields.ToReply = timeOp.addBusinessHours(Date.now(), REPLIED_ISSUE_SLA);
  },
  requirements: {
    ToReply: {
      type: entities.Field.dateTimeType,
      name: 'To reply before'
    },
    // This is the user which is set as reporter in mail rule settings:
    helpdeskBot: {
      type: entities.User,
      login: 'helpdesk-bot'
    }
  }
});