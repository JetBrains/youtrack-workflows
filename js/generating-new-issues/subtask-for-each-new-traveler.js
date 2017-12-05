var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Create a subtask for each new traveler',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return ctx.issue.isReported &&
      fs.Type && fs.Type.name === ctx.Type.GroupTrip.name &&
      fs.Travelers.added.isNotEmpty();
  },
  action: function(ctx) {
    var issue = ctx.issue;
    
    var createIssue = function(traveler) {
      var newIssue = new entities.Issue(ctx.currentUser, issue.project,
        traveler.fullName + ' at ' + issue.fields.Destination);
      newIssue.fields.Type = ctx.Type.IndTrip;
      newIssue.links['subtask of'].add(issue);
    };
    
    issue.fields.Travelers.added.forEach(createIssue);
  },
  requirements: {
    Destination: {
      type: entities.Field.stringType
    },
    Type: {
      type: entities.EnumField.fieldType,
      GroupTrip: {
        name: 'Group trip'
      },
      IndTrip: {
        name: 'Individual trip'
      }
    },
    Travelers: {
      type: entities.User.fieldType,
      multi: true
    }
  }
});