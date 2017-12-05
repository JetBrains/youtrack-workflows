var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Release management',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.becomesReported &&
      issue.fields.Type.name === ctx.Type.Release.name;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    
    var createIssue = function(name, subsystem) {
      var newIssue = new entities.Issue(ctx.currentUser, issue.project,
        name + ' for ' + issue.summary);
      newIssue.fields.Subsystem = subsystem;
      newIssue.fields.Type = ctx.Type.Task;
      newIssue.links['subtask of'].add(issue);
    };
    
    createIssue('Update distribution', ctx.Subsystem.Distribution);
    createIssue('Update documentation', ctx.Subsystem.Documentation);
    createIssue('Update "What\'s new"', ctx.Subsystem.Site);
    createIssue('Blog post', ctx.Subsystem.Blog);
    createIssue('Newsletter for customers', ctx.Subsystem.Newsletters);
    createIssue('Newsletter for resellers', ctx.Subsystem.Newsletters);
  },
  requirements: {
    Type: {
      type: entities.EnumField.fieldType,
      Release: {},
      Task: {}
    },
    Subsystem: {
      type: entities.OwnedField.fieldType,
      Distribution: {},
      Documentation: {},
      Site: {},
      Blog: {},
      Newsletters: {}
    }
  }
});