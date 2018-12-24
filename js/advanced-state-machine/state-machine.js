var entities = require('@jetbrains/youtrack-scripting-api/entities');

var HOUR_IN_MS = 60 * 60 * 1000;
var DAY_IN_MS = 24 * HOUR_IN_MS;

exports.rule = entities.Issue.stateMachine({
  title: 'Advanced state machine',
  fieldName: 'State',
  states: {
    'Submitted': {
      initial: true,
      transitions: {
        time_event: {
          after: 3 * DAY_IN_MS,
          action: function(ctx) {
            var issue = ctx.issue;
            var user = issue.fields.Assignee;
            if (!user) {
              user = issue.project.leader;
            }
            var subject = "[Youtrack, State reminder] Issue " + issue.id +
              " is still Submitted: " + issue.summary;
            var body = "Hi, " + user.fullName +
              "! <br><br> Issue <a href=''" + issue.url + "'>" + issue.id +
              "</a>" + " is still in Submitted state: " +
              "<a href='" + issue.url + "'>" + issue.summary + "</a>" +
              "<br> Please start working on it or specify a more accurate state.<br><br>" +
              "<p style='color: gray;font-size: 12px;margin-top: 1em;border-top: 1px solid #D4D5D6'>" +
              "Sincerely yours, YouTrack" + "</p>";
            user.notify(subject, body);
          },
          targetState: 'Submitted'
        },
        fix: {targetState: 'Fixed'},
        open: {targetState: 'Open'},
        'in progress': {targetState: 'In Progress'},
        discuss: {targetState: 'To be discussed'},
        'can\'t reproduce': {targetState: 'Can\'t Reproduce'},
        obsolete: {targetState: 'Obsolete'},
        duplicate: {targetState: 'Duplicate'},
        'as designed': {targetState: 'As designed'},
        invalidate: {targetState: 'Invalid'}
      }
    },
    
    'Open': {
      transitions: {
        fix: {targetState: 'Fixed'},
        'in progress': {targetState: 'In Progress'},
        discuss: {targetState: 'To be discussed'},
        'can\'t reproduce': {targetState: 'Can\'t Reproduce'},
        obsolete: {targetState: 'Obsolete'},
        duplicate: {targetState: 'Duplicate'},
        'as designed': {targetState: 'As designed'},
        invalidate: {targetState: 'Invalid'},
        wait: {targetState: 'Wait for Reply'}
      }
    },
    
    'Obsolete': {
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },
    
    'Duplicate': {
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },
    
    'In Progress': {
      transitions: {
        fix: {targetState: 'Fixed'},
        reopen: {targetState: 'Open'},
        'can\'t reproduce': {targetState: 'Can\'t Reproduce'},
        obsolete: {targetState: 'Obsolete'},
        'as designed': {targetState: 'As designed'}
      }
    },
    
    'To be discussed': {
      transitions: {
        'in progress': {targetState: 'In Progress'},
        obsolete: {targetState: 'Obsolete'},
        duplicate: {targetState: 'Duplicate'}
      }
    },
    
    'Can\'t reproduce': {
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },
  
    'As designed': {
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },

    'Won\'t fix' : {
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },
    
    'Invalid': {
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },
    
    'Incomplete': {
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },
    
    'Fixed': {
      transitions: {
        reopen: {targetState: 'Open'},
        verify: {targetState: 'Verified'},
        'can\'t verify': {targetState: 'Without verification'}
      }
    },

    'Without verification': {
      onEnter: function(ctx) {
        ctx.issue.fields.VerifiedBy = ctx.currentUser;
      },
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },
    
    'Verified': {
      onEnter: function(ctx) {
        ctx.issue.fields.required(ctx.VerifiedInBuild,
          "Specify verified in build");
        ctx.issue.fields.VerifiedBy = ctx.currentUser;
      },
      onExit: function(ctx) {
        ctx.issue.fields.VerifiedInBuild = null;
      },
      transitions: {
        reopen: {targetState: 'Open'}
      }
    },

    'Wait for Reply': {
      transitions: {
        fix: {targetState: 'Fixed'},
        open: {targetState: 'Open'},
        'in progress': {targetState: 'In Progress'},
        discuss: {targetState: 'To be discussed'},
        'can\'t reproduce': {targetState: 'Can\'t Reproduce'},
        obsolete: {targetState: 'Obsolete'},
        duplicate: {targetState: 'Duplicate'},
        'as designed': {targetState: 'As designed'},
        invalidate: {targetState: 'Invalid'}
      }
    }
  },
  requirements: {
    State: {
      type: entities.State.fieldType
    },
    Assignee: {
      type: entities.User.fieldType
    },
    VerifiedBy: {
      type: entities.User.fieldType,
      name: 'Verified by'
    },
    VerifiedInBuild: {
      type: entities.Build.fieldType,
      name: 'Verified in build'
    }
  }
});