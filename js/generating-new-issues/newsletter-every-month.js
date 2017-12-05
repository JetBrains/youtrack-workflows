var entities = require('@jetbrains/youtrack-scripting-api/entities');

var MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

var DAY_IN_MS = 24 * 60 * 60 * 1000;

exports.rule = entities.Issue.onSchedule({
  title: 'Internal newsletter',
  search: '#DA-1', // anchor issue; it is required to ensure that
  // this rule is executed exactly once according to schedule
  cron: '0 0 19 15 1/1 ? *', // on the 15th day of every month at 19:00
  action: function(ctx) {
    var date = new Date(Date.now() + 31 * DAY_IN_MS);
    date.setDate(1);
    var month = MONTHS[date.getMonth()];
    var year = date.getFullYear();
    
    var newIssue = new entities.Issue(ctx.currentUser, ctx.issue.project,
      month + ' ' + year + ' Internal Newsletter');
    newIssue.fields.Assignee = ctx.author;
    newIssue.fields.Subsystem = ctx.Subsystem.Newsletters;
    newIssue.fields.DD = date.getTime();
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    },
    Subsystem: {
      type: entities.OwnedField.fieldType,
      Newsletters: {}
    },
    DD: {
      type: entities.Field.dateType,
      name: 'Due Date'
    },
    author: {
      type: entities.User,
      login: 'root'
    },
    da: {
      type: entities.Issue,
      id: 'DA-1'
    }
  }
});