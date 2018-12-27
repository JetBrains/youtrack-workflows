var entities = require('@jetbrains/youtrack-scripting-api/entities');

var DAY_IN_MS = 24 * 60 * 60 * 1000;

exports.rule = new entities.Issue.onSchedule({
  title: 'Reopen issue when external user adds comment',
  cron: '0 5 12 * * ?',
  search: 'State: {Wait for Reply} has: Assignee has: comments',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.comments.last().author.isInGroup(ctx.developers.name) &&
      issue.comments.last().created + 5 * DAY_IN_MS < Date.now();
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var subject = "[Youtrack, 'Wait for Reply' reminder] Unanswered comment within 5 days";
    var body =
      "Hi, " + issue.fields.Assignee.fullName + "! <br><br> " +
      "Issue <a href='" + issue.url + "'>" + issue.id + " " + issue.summary + "</a> " +
      "is in state 'Wait for Reply' more than 5 days. " +
      "It has unanswered comment:<br><b>" + issue.comments.last().text +
      "</b><br><br> Please answer or resolved issue.<br><br>" +
      "<p style='color: gray;font-size: 12px;margin-top: 1em;border-top: 1px solid #D4D5D6'>" +
      "Sincerely yours, YouTrack" + "</p>";
    issue.fields.Assignee.notify(subject, body);
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Wait: {
        name: 'Wait for Reply'
      }    },
    Assignee: {
      type: entities.User.fieldType
    },
    developers: {
      type: entities.UserGroup
    }
  }
});