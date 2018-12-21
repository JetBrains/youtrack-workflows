var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Reopen duplicate',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.isChanged('duplicates') && issue.links['duplicates'].isEmpty();
  },
  action: function(ctx) {
    ctx.issue.State = ctx.State.Open;
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Open: {}
    }
  }
});