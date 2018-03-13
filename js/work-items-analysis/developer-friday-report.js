var entities = require('@jetbrains/youtrack-scripting-api/entities');

var wi = require('./work-items');

var DAY_IN_MS = 24 * 60 * 60 * 1000;
var HOURS_TO_WORK_A_WEEK = 40;

exports.rule = entities.Issue.onSchedule({
  title: 'Remind developers on Friday if they have not logged enough work',
  cron: '0 0 16 ? * FRI',
  search: '#WI-1', // // TODO: replace with ID of an anchor issue
  action: function(ctx) {
    var project = ctx.issue.project;
    
    // Calculate start and end of this week:
    var to = new Date(); // current moment
    var from = new Date(to - 4 * DAY_IN_MS); // Monday 16:00
    from.setHours(0, 0, 0, 0);
    from = from.getTime(); // the start of last Monday
    
    // Get a list of assignees from the Assignee field in the project,
    // get a list of work items for each of them, and calculate sum of durations
    // for the work items reported by each assignee:
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
    
    // Send emails in case of work is not yet done:
    assignees.forEach(function(assignee) {
      var duration = durations[assignee.login];
      if (duration < HOURS_TO_WORK_A_WEEK) {
        var subject = '[YouTrack, Reminder] Work done this week';
        var body = 'Hey ' + assignee.fullName + ',\n\n';
        body +=
          'Looks like you have forgot to log some work: you have worked on ' +
          project.name + ' for ' + duration + ' hour(s) instead of ' +
          HOURS_TO_WORK_A_WEEK + ' required for you.\n';
        body += '\nSincerely yours, YouTrack\n';
        assignee.notify(subject, body);
      }
    });
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    }
  }
});