var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onSchedule({
  title: 'Send notification',
  cron: '0 0 12 * * ?',
  search: '#Unresolved has: comments',
  guard: function(ctx) {
    return !ctx.issue.comments.last().author.isInGroup(ctx.devs.name);
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var subject = '[YouTrack, Notifier] Issue ' + issue.id +
      'needs your attention';
    var body = 'Issue ' + issue.summary +
      ' has a recent comment added by a non-developer.';
    issue.project.leader.notify(subject, body);
  },
  requirements: {
    devs: {
      type: entities.UserGroup,
      name: 'developers-team'
    }
  }
});