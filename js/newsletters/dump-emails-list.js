var entities = require('@jetbrains/youtrack-scripting-api/entities');
var filter = require('./filter');

exports.rule = entities.Issue.action({
  title: 'Dump all emails to a private comment',
  command: 'newsletter-dump-emails',
  guard: function(ctx) {
    return ctx.issue.isReported &&
      ctx.issue.reporter.login === ctx.currentUser.login;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var emails = filter.getUniqueEmails(issue.fields.Recipients, issue.reporter.email);
    var text = 'Newsletter will be sent to ' + emails.length + ' recipient(s):\n\n' +
      '```\n';
    emails.forEach(function(email) {
      text += email + '\n';
    });
    text += '```\n';
    var newComment = issue.addComment(text);
    newComment.permittedUsers.add(issue.reporter);
  },
  requirements: {
    Recipients: {
      type: entities.UserGroup.fieldType,
      multi: true
    }
  }
});