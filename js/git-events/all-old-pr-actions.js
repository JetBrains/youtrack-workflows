// https://habr.com/ru/company/JetBrains/blog/512880/
var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Existing PR changes ticket state',
  guard: function(ctx) {
    return ctx.issue.pullRequests.isNotEmpty() && // ensure there is PRs
      !ctx.issue.fields.isChanged(ctx.State) && // allow users to change State manually, otherwise this will be blocked
      ctx.issue.pullRequests.last().previousState && 
      ctx.issue.pullRequests.last().state.name !== ctx.issue.pullRequests.last().previousState.name;
  },
  action: function(ctx) {
    if ( ctx.issue.pullRequests.last().state.name === "OPEN" ) {
      ctx.issue.fields.State = ctx.State.Review;
    } else if ( ctx.issue.pullRequests.last().state.name === "DECLINED" ) {
      ctx.issue.fields.State = ctx.State.InProgress;
    } else if ( ctx.issue.pullRequests.last().state.name === "MERGED" ) {
      ctx.issue.fields.State = ctx.State.Resolved;
    }
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      InProgress: {
        name: "In Progress"
      },
      Review: {
        name: "MR for Review"
      },
      Resolved: {
        name: "Resolved"
      }
    },
  }
});
