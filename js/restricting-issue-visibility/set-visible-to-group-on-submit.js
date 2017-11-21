var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Set "Visible to" group on submit',
  guard: function(ctx) {
    return ctx.issue.becomesReported;
  },
  action: function(ctx) {
    ctx.issue.permittedGroups.add(ctx.viewers);
    workflow.message('Users from group "' + ctx.viewers.name +
      '" can see this request.');
  },
  requirements: {
    viewers: {
      type: entities.UserGroup
    }
  }
});