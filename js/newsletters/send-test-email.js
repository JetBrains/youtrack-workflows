var entities = require('@jetbrains/youtrack-scripting-api/entities');
var notifications = require('@jetbrains/youtrack-scripting-api/notifications');
var composer = require('./composer');

exports.rule = entities.Issue.action({
  title: 'Send test email (to the reporter only)',
  command: 'newsletter-test-email',
  guard: function(ctx) {
    return ctx.issue.isReported &&
      ctx.issue.reporter.login === ctx.currentUser.login;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var emails = [issue.reporter.email];
    var message = composer.composeMessage(issue, emails);
    notifications.sendEmail(message, issue);
  }
});