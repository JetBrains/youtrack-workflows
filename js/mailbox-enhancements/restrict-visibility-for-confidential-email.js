var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Restrict visibility for confidential email',
  guard: function(ctx) {
    return ctx.issue.becomesReported;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    if (issue.summary.toLowerCase().includes('confidential') ||
      issue.description.toLowerCase().includes('confidential')) {
      issue.tags.forEach(function(tag) {
        if (tag.name === 'mailbox') {
          ctx.issue.applyCommand('visible to mailbox-team');
        }
      });
    }
    issue.tags.forEach(function(tag) {
      if (tag.name === 'mailbox') {
        issue.applyCommand('remove tag mailbox', ctx.currentUser);
      }
    });
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Open: {
        name: 'Open'
      }
    },
    'mailbox-team': {
      type: entities.UserGroup
    }
  }
});