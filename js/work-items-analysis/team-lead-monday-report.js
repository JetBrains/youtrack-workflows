var entities = require('@jetbrains/youtrack-scripting-api/entities');

var wi = require('./work-items');

var DAY_IN_MS = 24 * 60 * 60 * 1000;
var HOURS_TO_WORK_A_WEEK = 40;

exports.rule = entities.Issue.onSchedule({
  title: 'Send report to the project lead on Monday',
  cron: '0 0 10 ? * MON',
  search: '#WI-1', // // TODO: replace with anchor issue id
  action: function(ctx) {
    var project = ctx.issue.project;
    
    // Calculate start and end of the last week:
    var from = new Date();
    from.setHours(0, 0, 0, 0); // the start of this day
    from = from.getTime() - 7 * DAY_IN_MS; // the start of last Monday
    var to = from + 7 * DAY_IN_MS - 1; // the end of last Sunday
    
    // Get a list of assignees from the bundle of assignees of the project,
    // get a list of work items for each of them, and calculate sum of durations
    // for each assignee work:
    var durations = {};
    var assignees = ctx.Assignee.values;
    assignees.forEach(function(assignee) {
      var items = wi.fetchWorkItems(assignee, project, from, to);
      var duration = 0; // duration in minutes
      items.forEach(function(item) {
        duration += item.duration;
      });
      durations[assignee.login] = duration / 60;
    });
    
    // Create email content:
    var subject = '[YouTrack, Report] Report of work done last week';
    var body = 'Here is the report for last week: \n\n';
    assignees.forEach(function(assignee) {
      var duration = durations[assignee.login];
      var text = assignee.fullName + ' worked for ' + duration + ' hour(s)';
      if (duration > HOURS_TO_WORK_A_WEEK) {
        text += ' (overtime for ' + (duration - HOURS_TO_WORK_A_WEEK) + ' hour(s)).\n';
      } else if (duration < HOURS_TO_WORK_A_WEEK) {
        text += ' (downtime for ' + ( HOURS_TO_WORK_A_WEEK - duration) + ' hour(s)).\n';
      } else {
        text += '.\n';
      }
      body += text;
    });
    body += '\nSincerely yours, YouTrack\n';
    
    // Send email to the project lead:
    project.leader.notify(subject, body);
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    }
  }
});