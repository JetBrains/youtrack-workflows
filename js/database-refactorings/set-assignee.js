var entities = require('@jetbrains/youtrack-scripting-api/entities');
var search = require('@jetbrains/youtrack-scripting-api/search');

var TITLE = 'Set Assignees by Subsystems';
var SEARCH = '#Unresolved has: Subsystem has:-Assignee sort by: created asc';
var LIMIT = 100;
var CRON = '0 * * * * ?';
var ANCHOR = '#GD-1';

var process = function(ctx, issue) {
  issue.fields[ctx.Assignee.name] = issue.fields[ctx.Subsystem.name].owner;
};

var REQUIREMENTS = {
  Subsystem: {
    type: entities.OwnedField.fieldType
  },
  Assignee: {
    type: entities.User.fieldType
  }
};

exports.rule = entities.Issue.onSchedule({
  title: TITLE,
  cron: CRON,
  search: ANCHOR,
  muteUpdateNotifications: true,
  action: function(ctx) {
    var issues = search.search(ctx.issue.project, SEARCH);
    var entries = issues.entries();
    var i = entries.next();
    var n = 0;
    var firstIssueId = i.done ? '' : i.value.id;
    
    while (n < LIMIT && !i.done) {
      var issue = i.value;
      process(ctx, issue);
      n += 1;
      i = entries.next();
    }
    
    var name = ctx.issue.project.name + ' : ' + TITLE + ' : ';
    if (n) {
      console.log(name + n + ' issues are processed, starting with ' + firstIssueId);
    } else {
      console.log(name + 'no issues are processed, as nothing is left to process');
    }
  },
  requirements: REQUIREMENTS
});
