/**
 * This is a template for an on-change rule. This rule defines what
 * happens when a change is applied to an issue.
 *
 * For details, read the Quick Start Guide:
 * https://www.jetbrains.com/help/youtrack/incloud/2020.3/Quick-Start-Guide-Workflows-JS.html
 */

var entities = require('@jetbrains/youtrack-scripting-api/entities');
var utils = require('./utils'); 

exports.rule = entities.Issue.onChange({ 
  title: 'Update stats when links are adjusted',  
  guard: function(ctx) {
    var issue = ctx.issue;
    return ((ctx.issue.links['parent for'].removed.isNotEmpty()  || issue.links['parent for'].added.isNotEmpty()) && issue.isReported && (issue.Type.name == ctx.Type.TestRun.name));
  },
  action: function(ctx) {
    var issue = ctx.issue;  
    utils.calculateStatuses(issue);   
  },   
  requirements: {
    Type: {
      type: entities.EnumField.fieldType,
      TestRun: {
        name: "Test Run" 
      } 
    }
  }
});