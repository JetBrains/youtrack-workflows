var entities = require('@jetbrains/youtrack-scripting-api/entities');
var search = require('@jetbrains/youtrack-scripting-api/search');

exports.rule = entities.Issue.onChange({
  title: 'Set Assignee automatically via Round Robin scheme',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.becomesReported && !issue.fields.Assignee;
  },
  action: function(ctx) {
    var assignees = ctx.Assignee.values;
    var numbers = {};
    assignees.forEach(function(assignee) {
      numbers[assignee.login] = 0;
    });
    
    var issues = search.search(ctx.issue.project, '#unresolved has: Assignee');
    issues.forEach(function(issue) {
      numbers[issue.fields.Assignee.login] += 1;
    });
  
    var min = Number.MAX_VALUE;
    var user = null;
    assignees.forEach(function(assignee) {
      console.log(assignee.login, numbers[assignee.login], min, (user || {}).login);
      if (numbers[assignee.login] < min) {
        min = numbers[assignee.login];
        user = assignee;
      }
    });
    
    ctx.issue.fields.Assignee = user;
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    }
  }
});