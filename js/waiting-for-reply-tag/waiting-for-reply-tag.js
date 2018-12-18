var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: "'Waiting for reply' tag",
  guard: function(ctx) {
    var c = ctx.issue.comments.added.last();
    return c && c.author.isInGroup(ctx.developers.name);
  },
  action: function(ctx) {
    ctx.issue.removeTag(ctx.wfr.name);
    ctx.issue.addTag(ctx.wfra.name);
  },
  requirements: {
    developers: {
      type: entities.UserGroup
    },
    wfr: {
      type: entities.IssueTag,
      name: 'waiting for reply'
    },
    wfra: {
      type: entities.IssueTag,
      name: 'waiting for reply (answered?)'
    }
  }
});