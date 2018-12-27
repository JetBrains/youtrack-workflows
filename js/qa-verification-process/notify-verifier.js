var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Notify "Verified by" person',
  guard: function(ctx) {
    var issue = ctx.issue;
    var fs = issue.fields;
    return issue.isReported && fs.isChanged(ctx.VerifiedBy) &&
      fs.VerifiedBy && fs.VerifiedBy.login !== ctx.currentUser.login;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var subject =
      "[Youtrack, Verify by] You became the 'Verified by' user for issue "
      + issue.id + " " + issue.summary;
    var body =
      "Hi, " + issue.fields.VerifiedBy.fullName + "! <br><br> " +
      "You became the 'Verified by' user for issue <a href='" +
      issue.url + "'>" + issue.id + "</a> <a href=''" + issue.url + "'>" +
      issue.summary + "</a>" + "<br> Please verify it or close as " +
      "'Without verification'.<br><br>" +
      "<p style='color: gray;font-size: 12px;margin-top: 1em;border-top: 1px solid #D4D5D6'>" +
      "Best regards, YouTrack" + "</p>";
    issue.fields.VerifiedBy.notify(subject, body);
  },
  requirements: {
    VerifiedBy: {
      type: entities.User.fieldType,
      name: 'Verified by'
    }
  }
});