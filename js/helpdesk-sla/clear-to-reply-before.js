var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Clear "To reply before" field and remove a tag when issue is not New or Open',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.State) && fs.State &&
      fs.State.name !== ctx.State.New.name &&
      fs.State.name !== ctx.State.Open.name;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    issue.fields.ToReply = null;
    if (issue.hasTag(ctx.overdue.name)) {
      issue.removeTag(ctx.overdue.name);
    }
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Open: {},
      New: {}
    },
    ToReply: {
      type: entities.Field.dateTimeType,
      name: 'To reply before'
    },
    overdue: {
      type: entities.IssueTag
    }
  }
});