var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Reopen show-stopper on new comment',
  guard: function(ctx) {
    return ctx.issue.comments.added.isNotEmpty();
  },
  action: function(ctx) {
    var issue = ctx.issue;
    if (issue.isResolved && issue.Priority.name === ctx.Priority.ShowStopper.name &&
      issue.Type.name === ctx.Type.Bug.name) {
      issue.tags.forEach(function(tag) {
        if (tag.name === 'mailbox') {
          issue.State = ctx.State.Open;
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
    Type: {
      type: entities.EnumField.fieldType,
      Bug: {
        name: 'Bug'
      }
    },
    Priority: {
      type: entities.EnumField.fieldType,
      ShowStopper: {
        name: 'Show-stopper'
      }
    }
  }
});

