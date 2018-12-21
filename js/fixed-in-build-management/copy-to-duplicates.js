var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Copy Fixed in build to duplicate issues',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.FixedInBuild) && fs.FixedInBuild;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    issue.links['is duplicated by'].forEach(function(duplicate) {
      if (issue.project.key === duplicate.project.key) {
        duplicate.fields[ctx.FixedInBuild.name] = issue.fields.FixedInBuild;
      }
    });
  },
  requirements: {
    FixedInBuild: {
      type: entities.Build.fieldType,
      name: 'Fixed in build'
    }
  }
});