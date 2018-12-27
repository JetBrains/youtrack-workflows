var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Reopen issue when external user adds comment',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.fields.State.name === ctx.State.Wait.name &&
      issue.comments.added.isNotEmpty() &&
      !issue.comments.added.last().author.isInGroup(ctx.developers.name);
  },
  action: function(ctx) {
    ctx.issue.fields.State = ctx.State.Open;
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Wait: {
        name: 'Wait for Reply'
      },
      Open: {}
    },
    developers: {
      type: entities.UserGroup
    }
    
  }
});