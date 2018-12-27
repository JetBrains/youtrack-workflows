var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = new entities.Issue.onChange({
  title: 'Update when "Verified in build" is set',
  guard: function(ctx) {
    var fs = ctx.issue.fields;
    return fs.isChanged(ctx.VerifiedInBuild) && fs.VerifiedInBuild;
  },
  action: function(ctx) {
    var fs = ctx.issue.fields;
    fs.State = ctx.State.Verified;
    fs.VerifiedBy = ctx.currentUser;
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Verified: {}
    },
    VerifiedInBuild: {
      type: entities.Build.fieldType,
      name: 'Verified in build'
    },
    VerifiedBy: {
      type: entities.User.fieldType,
      name: 'Verified by'
    }
  }
});