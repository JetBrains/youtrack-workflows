var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

var loginRegex = /@(([A-Z0-9._@$+\-=|])*)/gi;

exports.rule = entities.Issue.onChange({
  title: 'Automatically add users to the "visible to" list',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.comments.added.isNotEmpty() &&
      (issue.permittedGroups.isNotEmpty() || issue.permittedUsers.isNotEmpty());
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var text = '';
    issue.comments.added.forEach(function (comment) {
      text += comment.text + '\n';
    });
    var message = '';
    var matches = text.match(loginRegex);
    if (matches) {
      matches.forEach(function(m) {
        var login = m.slice(1);
        if (login) {
          var user = entities.User.findByLogin(login);
          if (user) {
            issue.permittedUsers.add(user);
            message += 'User "' + user.fullName +
              '" is added to issue readers. ';
          } else {
            message += 'User with login "' + login + '" not found. ';
          }
        }
      });
    }
    if (message) {
      workflow.message(message);
    }
  },
  requirements: {}
});