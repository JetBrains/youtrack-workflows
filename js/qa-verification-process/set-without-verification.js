var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = new entities.Issue.onChange({
  title: 'Require comment on "Without verification"',
  guard: function(ctx) {
    return ctx.issue.fields.becomes(ctx.State, ctx.State.WOVerification);
  },
  action: function(ctx) {
    workflow.check(ctx.issue.comments.added.isNotEmpty(),
      'Add a comment about the missing details');
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      WOVerification: {
        name: 'Without verification'
      }
    }
  }
});