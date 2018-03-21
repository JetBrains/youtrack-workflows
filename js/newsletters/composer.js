exports.composeMessage = function(issue, emails) {
  var subject = issue.summary;
  var body = issue.wikify(issue.description);
  var link = '<a href="' + issue.url + '">' + issue.id + '</a>';
  var footer =
    '<div style="color: #777777;">' +
    'This newsletter is delivered by YouTrack. You may find the content ' +
    'of this newsletter anytime at ' + link + '.' + '</div>';
  
  return  {
    fromName: issue.reporter.fullName,
    toEmails: emails,
    subject: subject,
    body: body + footer
  };
};