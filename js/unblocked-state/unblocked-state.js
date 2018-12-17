var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: "'Unblocked' state",
  guard: function(ctx) {
    return ctx.issue.becomesResolved;
  },
  action: function(ctx) {
    ctx.issue.links['blocks'].forEach(function(dependent) {
      if (dependent.links['is blocked by'].size === 1) {
        dependent.fields.State = ctx.State.Unblocked;
      }
    });
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      'Unblocked': {}
    },
    Blocker: {
      type: entities.IssueLinkPrototype,
      inward: 'is blocked by',
      outward: 'blocks'
    }
  }
});