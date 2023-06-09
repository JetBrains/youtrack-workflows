// To send a webhook in Teams channel for issue tracking
const TEAMS_WEBHOOK_URL = '<REPLACE-WITH-YOUR-WEBHOOK-URL>';

var http = require('@jetbrains/youtrack-scripting-api/http');
var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
    title: 'Notify-teams',
  guard: (ctx) => {
    return ctx.issue.becomesReported || ctx.issue.becomesResolved || ctx.issue.becomesUnresolved;
  },
  action: (ctx) => {
    const issue = ctx.issue;

    const issueLink = '<' + issue.url + '|' + issue.id + '>';
    let message; let isNew;

    if (issue.becomesReported) {
      message = 'Created: ';
      isNew = true;
    } else if (issue.becomesResolved) {
      message = 'Resolved: ';
      isNew = false;
    } else if (issue.becomesUnresolved) {
      message = 'Reopened: ';
      isNew = false;
    }
    message += issue.summary;

    let changedByTitle = '';
    let changedByName = '';

    if (isNew) {
      changedByTitle = 'Created By';
      changedByName = issue.reporter.fullName;
    } else {
      changedByTitle = 'Updated By';
      changedByName = issue.updatedBy.fullName;
    }

    const payload = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      'themeColor': issue.fields.Priority.backgroundColor || '#edb431',
      'summary': message,
      'sections': [
        {
          'activityTitle': issueLink,
          'activitySubtitle': message,
          'facts': [
            {
              'name': 'State',
              'value': issue.fields.State.name
            },
            {
              'name': 'Priority',
              'value': issue.fields.Priority.name
            },
            {
              'name': 'Assignee',
              'value': issue.fields.Assignee ? issue.fields.Assignee.fullName : ''
            },
            {
              'name': changedByTitle,
              'value': changedByName
            }
          ]
        }
      ]
    };
    

    const connection = new http.Connection(TEAMS_WEBHOOK_URL, null, 2000);
    const response = connection.postSync('', null, JSON.stringify(payload));
    if (!response.isSuccess) {
      console.warn('Failed to post notification to Teams. Details: ' + response.toString());
    }
  },
  requirements: {
    Priority: {
      type: entities.EnumField.fieldType
    },
    State: {
      type: entities.State.fieldType
    },
    Assignee: {
      type: entities.User.fieldType
    }
  }
});