exports.getUniqueEmails = function(groups, firstEmail) {
  var userEmails = [firstEmail];
  groups.forEach(function(group) {
    group.users.forEach(function(user) {
      var email = user.email;
      if (email && userEmails.indexOf(email) < 0) {
        userEmails.push(email);
      }
    })
  });
  return userEmails;
};