var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'in-progress on Git push',
  guard: function(ctx) {
    return ctx.issue.vcsChanges.added.isNotEmpty() && ctx.issue.fields.is(ctx.State, ctx.State.Open) && !ctx.issue.pullRequests.isNotEmpty();
  },
  action: function(ctx) {
    ctx.issue.fields.State = ctx.State.InProgress;
  },

  requirements: {
    State: {
      type: entities.State.fieldType,
      Open: {},
      InProgress: {
        name: 'In Progress'
      }
    }
  }
});
