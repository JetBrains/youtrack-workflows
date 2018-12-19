var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Update Last duplicate date',
  guard: function(ctx) {
    return ctx.issue.links['is duplicated by'].added.isNotEmpty();
  },
  action: function(ctx) {
    var issue = ctx.issue;
    issue.links['is duplicated by'].added.forEach(function(duplicate) {
      if (duplicate.created > issue.fields.LastDuplicate) {
        issue.fields.LastDuplicate = duplicate.created;
      }
    })
  },
  requirements: {
    LastDuplicate: {
      type: entities.Field.dateType,
      name: 'Last duplicate'
    }
  }
});