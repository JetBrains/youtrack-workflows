var entities = require('@jetbrains/youtrack-scripting-api/entities');
var notifications = require('@jetbrains/youtrack-scripting-api/notifications');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');
var composer = require('./composer');
var filter = require('./filter');

exports.rule = entities.Issue.onChange({
  title: 'Send email to recipients',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.isReported && issue.fields.becomes(ctx.State, ctx.State.Sent);
  },
  action: function(ctx) {
    var issue = ctx.issue;
    
    workflow.check(issue.reporter.login === ctx.currentUser.login,
      'Only ' + issue.reporter.fullName + ' can send this newsletter!');
    
    var emails = filter.getUniqueEmails(issue.fields.Recipients, issue.reporter.email);
    var message = composer.composeMessage(issue, emails);
    notifications.sendEmail(message, issue);
    
    issue.fields.Recipients.forEach(function(group) {
      issue.permittedGroups.add(group);
    });

    var newComment = issue.addComment('Newsletter was sent to ' +
      emails.length + ' recipient(s).');
    newComment.permittedUsers.add(issue.reporter);
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Sent: {}
    },
    Recipients: {
      type: entities.UserGroup.fieldType,
      multi: true
    }
  }
});