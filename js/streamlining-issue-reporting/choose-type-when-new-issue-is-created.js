var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Choose Type when new issue is created',
  guard: function(ctx) {
    var issue = ctx.issue;
    return !issue.isReported && !issue.becomesReported &&
      !issue.fields.Type && !issue.isChanged('project');
  },
  action: function(ctx) {
    ctx.issue.fields.required(ctx.Type, 'Please choose issue Type before editing!');
  },
  requirements: {
    Type: {
      type: entities.EnumField.fieldType
    }
  }
});
