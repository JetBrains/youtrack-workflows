var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Mark issue answered',
  guard: function(ctx) {
    var cs = ctx.issue.comments;
    return cs.added.isNotEmpty() &&
      cs.added.last().author.isInGroup(ctx.devs.name);
  },
  action: function(ctx) {
    ctx.issue.fields.State = ctx.State.Answered;
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Answered: {}
    },
    devs: {
      type: entities.UserGroup,
      name: 'developers'
    }
  }
});