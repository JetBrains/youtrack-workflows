var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Block changes to Amount for paid requests',
  guard: function(ctx) {
    return ctx.issue.fields.isChanged(ctx.Amount);
  },
  action: function(ctx) {
    var fs = ctx.issue.fields;
    workflow.check(fs.State && fs.State.name !== ctx.State.Paid.name,
      'You cannot change the Amount for paid requests!');
  },
  requirements: {
    Amount: {
      type: entities.Field.floatType
    },
    State: {
      type: entities.State.fieldType,
      Paid: {}
    }
  }
});