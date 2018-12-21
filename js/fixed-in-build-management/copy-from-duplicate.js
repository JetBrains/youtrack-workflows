var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Copy Fixed in build from duplicated issue',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.fields.becomes(ctx.State, ctx.State.Duplicate) &&
      issue.links['duplicates'].isNotEmpty();
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var duplicated = issue.links['duplicates'].last();
    if (duplicated.project.key === issue.project.key) {
      var build = duplicated.fields[ctx.FixedInBuild.name];
      if (build) {
        issue.fields.FixedInBuild = build;
      }
    }
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Duplicate: {}
    },
    FixedInBuild: {
      type: entities.Build.fieldType,
      name: 'Fixed in build'
    }
  }
});