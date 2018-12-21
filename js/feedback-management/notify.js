var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onSchedule({
  title: 'Close spam issue',
  cron: '0 0 11 * * ?',
  search: 'State: Unanswered Type: -Spam',
  action: function(ctx) {
    var issue = ctx.issue;
    var user = issue.fields.Assignee;
    if (!user) {
      user = issue.project.leader;
    }
    var subject = 'There\'s unanswered feedback [' + issue.id + ']';
    var body = 'There\'s unanswered feedback <a href="' + issue.url + '">' +
      issue.id + '</a>';
    user.notify(subject, body);
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    },
    State: {
      type: entities.State.fieldType,
      Unanswered: {}
    },
    Type: {
      type: entities.EnumField.fieldType,
      Spam: {}
    }
  }
});