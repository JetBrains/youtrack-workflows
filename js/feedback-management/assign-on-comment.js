var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Assign issues on comment',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    var cs = ctx.issue.comments;
    return cs.added.isNotEmpty() &&
      cs.added.last().author.isInGroup(ctx.devs.name) &&
      (!fs.Assignee || fs.Assignee.login !== cs.added.last().author.login);
  },
  action: function(ctx) {
    ctx.issue.fields.Assignee = ctx.issue.comments.added.last().author;
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    },
    devs: {
      type: entities.UserGroup,
      name: 'developers'
    }
  }
});