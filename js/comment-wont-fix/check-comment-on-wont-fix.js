var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: "Check comment on Won't fix",
  guard: function(ctx) {
    return ctx.issue.fields.becomes(ctx.State, ctx.State.WontFix);
  },
  action: function(ctx) {
    workflow.check(ctx.issue.comments.added.isNotEmpty(), 'Please comment!')
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      WontFix: {
        name: "Won't fix"
      }
    }
  }
});