var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Close spam issue',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.becomes(ctx.Type, ctx.Type.Spam);
  },
  action: function(ctx) {
    ctx.issue.fields.State = ctx.State.Answered;
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Answered: {}
    },
    Type: {
      type: entities.EnumField.fieldType,
      Spam: {}
    }
  }
});