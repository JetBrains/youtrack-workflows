var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: "Accumulate estimates",
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.fields.isChanged(ctx.IntEstimation) &&
      issue.links['subtask of'].isNotEmpty();
  },
  action: function(ctx) {
    var parent = ctx.issue.links['subtask of'].first();
    var estimation = 0;
    parent.links['parent for'].forEach(function(child) {
      estimation += child.fields[ctx.IntEstimation.name];
    })
    parent.fields[ctx.IntEstimation.name] = estimation;
  },
  requirements: {
    IntEstimation: {
      type: entities.Field.integerType
    }
  }
});
