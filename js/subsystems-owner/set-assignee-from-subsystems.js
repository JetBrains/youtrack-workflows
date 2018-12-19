var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Set Assignee from Subsystems',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.Subsystems) && !fs.Assignee;
  },
  action: function(ctx) {
    var fs = ctx.issue.fields;
    fs.Subsystems.find(function(subsystem) {
      if (!fs.Assignee) {
        fs.Assignee = subsystem.owner;
        return true;
      }
      return false;
    });
  },
  requirements: {
    Subsystems: {
      type: entities.OwnedField.fieldType,
      multi: true
    },
    Assignee: {
      type: entities.User.fieldType
    }
  }
});