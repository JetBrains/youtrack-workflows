var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: "Clear Fix versions",
  guard: function(ctx) {
    return ctx.issue.becomesUnresolved;
  },
  action: function(ctx) {
    ctx.issue.fields.FV.clear();
  },
  requirements: {
    FV: {
      type: entities.ProjectVersion.fieldType,
      multi: true,
      name: 'Fix versions'
    }
  }
});