var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.action({
  title: 'Feature template',
  command: 'feature-template',
  guard: function(ctx) {
    var issue = ctx.issue;
    return !issue.isReported && !issue.becomesReported && !issue.description;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    issue.description =
      'What should be implemented?\n\n' +
      'Why is this functionality required?\n';
    issue.fields.Type = ctx.Type.Feature;
    issue.fields.FixVersions.add(ctx.FixVersions.Backlog);
  },
  requirements: {
    Type: {
      type: entities.EnumField.fieldType,
      Feature: {}
    },
    FixVersions: {
      type: entities.ProjectVersion.fieldType,
      multi: true,
      name: 'Fix versions',
      Backlog: {}
    }
  }
});
