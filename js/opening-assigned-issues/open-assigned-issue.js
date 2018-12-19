var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Open assigned issue',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.Assignee && !fs.oldValue(ctx.Assignee) &&
      !fs.isChanged(ctx.State) && fs.State.name === ctx.State.Submitted.name;
  },
  action: function(ctx) {
    var fs = ctx.issue.fields;
    fs.State = ctx.State.Open;
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    },
    State: {
      type: entities.State.fieldType,
      Open: {},
      Submitted: {}
    }
  }
});