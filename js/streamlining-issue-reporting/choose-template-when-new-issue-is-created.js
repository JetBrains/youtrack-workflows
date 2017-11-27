var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Choose a template when new issue is created',
  guard: function(ctx) {
    var issue = ctx.issue;
    return !issue.isReported && !issue.becomesReported && !issue.description;
  },
  action: function(ctx) {
    workflow.check(false, 'Please, choose one of templates in action menu!');
  },
  requirements: {
    Type: {
      type: entities.EnumField.fieldType
    }
  }
});
