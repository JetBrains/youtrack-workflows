var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Set issue template based on Type',
  guard: function(ctx) {
    var issue = ctx.issue;
    return !issue.isReported && !issue.becomesReported && !issue.description &&
      issue.fields.isChanged(ctx.Type) && !issue.fields.oldValue(ctx.Type);
  },
  action: function(ctx) {
    var issue = ctx.issue;

    var typeIs = function(value) {
      return issue.fields.Type.name === value.name;
    };

    if (typeIs(ctx.Type.Bug)) {
      issue.description =
        'What steps will reproduce the problem?' +
        '\n1.\n2.\n3.\n\n' +
        'What is the expected result?\n\n' +
        'What happens instead?\n';
    } else if (typeIs(ctx.Type.Feature)) {
      issue.description =
        'What should be implemented?\n\n' +
        'Why is this functionality required?\n';
      issue.fields.FixVersions.add(ctx.FixVersions.Backlog);
    }
  },
  requirements: {
    Type: {
      type: entities.EnumField.fieldType,
      Bug: {},
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
