var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Clear on unresolve',
  guard: function(ctx) {
    return ctx.issue.becomesUnresolved;
  },
  action: function(ctx) {
    ctx.issue.fields.FixedInBuild = null;
  },
  requirements: {
    FixedInBuild: {
      type: entities.Build.fieldType,
      name: 'Fixed in build'
    }
  }
});