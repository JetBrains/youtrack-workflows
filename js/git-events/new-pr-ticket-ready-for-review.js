var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Set_to_Ready_for_Review_when_pull_request_is_opened',
  guard: function(ctx) {
    return ctx.issue.pullRequests.isNotEmpty() &&
      !ctx.issue.fields.isChanged(ctx.State) &&
      !ctx.issue.pullRequests.last().previousState && 
      ctx.issue.pullRequests.last().state.name === "OPEN";
  },
  action: function(ctx) {
    ctx.issue.fields.State = ctx.State.Review;
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
      Review: {
        name: "MR for Review"
      }
    },
  }
});
