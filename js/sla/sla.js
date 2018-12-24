var entities = require('@jetbrains/youtrack-scripting-api/entities');

var HOUR_IN_MS = 60 * 60 * 1000;
var DAY_IN_MS = 24 * HOUR_IN_MS;

exports.rule = entities.Issue.stateMachine({
  title: 'Support management',
  fieldName: 'Support state',
  states: {
    'Open': {
      initial: true,
      transitions: {
        'time_event': {
          targetState: 'Open',
          action: function(ctx) {
            ctx.issue.project.leader.notify('[YouTrack, Approvement]',
              'Issue ' + ctx.issue.id + ' hasn\'t been approved within 1 hour.');
          },
          after: HOUR_IN_MS
        },
        'approve': {
          targetState: 'Approved'
        }
      }
    },
    'Approved': {
      transitions: {
        'time_event': {
          targetState: 'Approved',
          action: function(ctx) {
            ctx.issue.project.leader.notify('[YouTrack, Reproduction]',
              'Issue ' + ctx.issue.id + ' hasn\'t been reproduced within a day.');
            ctx.issue.project.leader.watchIssue(ctx.issue);
            ctx.sales.notifyAllUsers('[YouTrack, Reproduced]',
              'Issue ' + ctx.issue.id + ' hasn\'t been reproduced within a day.');
          },
          after: DAY_IN_MS
        },
        'reproduce': {
          targetState: 'Reproduced'
        }
      }
    },
    'Reproduced': {
      transitions: {
        'time_event': {
          targetState: 'Reproduced',
          action: function(ctx) {
            ctx.sales.notifyAllUsers('[YouTrack, Visit on-site]',
              'Issue ' + ctx.issue.id + ' needs your attention.');
          },
          after: 3 * DAY_IN_MS
        },
        'visit': {
          targetState: 'Visit on-site'
        },
        'close': {
          targetState: 'Closed'
        }
      }
    },
    'Visit on-site': {
      transitions: {
        'close': {
          targetState: 'Closed'
        }
      }
    },
    'Closed': {
      transitions: {
        'reopen': {
          targetState: 'Open'
        }
      }
    }
  },
  requirements: {
    'sales': {
      type: entities.UserGroup
    },
    'Support state': {
      type: entities.State.fieldType
    }
  }
});