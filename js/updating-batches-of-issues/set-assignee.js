var entities = require('@jetbrains/youtrack-scripting-api/entities');
var search = require('@jetbrains/youtrack-scripting-api/search');

exports.rule = entities.Issue.onSchedule({
  title: 'Set Assignees from Subsystems',
  cron: '0 * * * * ?',
  search: '#WS-1',
  muteUpdateNotifications: true,
  action: function(ctx) {
    var searchQuery = '#Unresolved has: Subsystem has:-Assignee sort by: {issue id} asc';
    var issues = search.search(ctx.issue.project, searchQuery);
    var entries = issues.entries();
    var i = entries.next();
    var n = 0;
    var firstIssueId = i.done ? '' : i.value.id;
    
    while (n < 2 && !i.done) {
      var issue = i.value;
      issue.fields[ctx.Assignee.name] = issue.fields[ctx.Subsystem.name].owner;
      n += 1;
      i = entries.next();
    }
    
    var name = ctx.issue.project.name + ' : Set Assignees from Subsystems : ';
    if (n) {
      console.log(name + n + ' issues are processed, starting with ' + firstIssueId);
    } else {
      console.log(name + 'no issues are processed, as nothing is left to process');
    }
  },
  requirements: {
    Subsystem: {
      type: entities.OwnedField.fieldType
    },
    Assignee: {
      type: entities.User.fieldType
    }
  }
});
