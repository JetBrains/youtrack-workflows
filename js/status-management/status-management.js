/**
 * This is a template for a rule that defines a state-machine per issue type.
 * This rule defines the set of transitions that are allowed for a custom field.
 * You can define alternative transition paths based on the current value in
 * a second field, commonly the field that stores the issue type.
 *
 * For details, read the Quick Start Guide:
 * https://www.jetbrains.com/help/youtrack/incloud/2020.3/Quick-Start-Guide-Workflows-JS.html
 */


var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');


exports.rule = entities.Issue.stateMachine({
  title: 'status-management',
  stateFieldName: 'Status',
  typeFieldName: 'Type',
  defaultMachine: {
    'No Run': {
      initial: true,
      transitions: {
        'Failed': {
          targetState: 'Failed',
          action: function(ctx) {
            var issue = ctx.issue;
            if (!issue.links['subtask of'].isEmpty) {
              var parent = issue.links['subtask of'].first();
              var TestRunList = parent.links[ctx.Subtask.outward];
              var resultSet = null;
              var isPassing = true;
              TestRunList.forEach(function(v) {
                if (v.Status.name == ctx.Status.Failed.name) {
                  isPassing = false;
                } else if ((v.Status.name == ctx.Status.InProgress.name) && (v.id !== issue.id)) {
                  resultSet = v;
                }
              });
              if (resultSet) {
                var otherIssueLink = '<a href="' + resultSet.url + '"> ' + resultSet.id + '</a>';
                var message = 'Switch to next open test in current Test Run' + otherIssueLink + '.';
                workflow.message(message);

                // Updating Test Run Status 
                parent.fields["Status"] = ctx.Status.Failing;
              } else {
                parent.fields["Status"] = ctx.Status.Failed;
              }
            }
          }
        },
        'Passed': {
          guard: function(ctx) {
            var issue = ctx.issue;
            //   reconsider condition 
            return !issue.isChanged('project') && !issue.becomesReported && issue.isReported && (issue.Type.name == ctx.Type.TestExecution.name);
          },
          targetState: 'Passed',
          action: function(ctx) {
            var issue = ctx.issue;
            if (!issue.links['subtask of'].isEmpty) {
              var parent = issue.links['subtask of'].first();
              var TestRunList = parent.links[ctx.Subtask.outward];
              var resultSet = null;
              var isPassing = true;
              TestRunList.forEach(function(v) {
                if (v.Status.name == ctx.Status.Failed.name) {
                  isPassing = false;
                } else if ((v.Status.name == ctx.Status.InProgress.name) && (v.id !== issue.id)) {
                  resultSet = v;
                }
              });
              if (resultSet) {
                var otherIssueLink = '<a href="' + resultSet.url + '"> ' + resultSet.id + '</a>';
                var message = 'Switch to next open test in current Test Run' + otherIssueLink + '.';
                workflow.message(message);

                // Updating Test Run Status 
                parent.fields["Status"] = (isPassing) ? ctx.Status.Passing : ctx.Status.Failing;
              } else {
                parent.fields["Status"] = (isPassing) ? ctx.Status.Passed : ctx.Status.Failed;
              }
            }
          }
        }
      }
    },
    Passed: {
      transitions: {
        'Failed': {
          guard: function(ctx) {
            var issue = ctx.issue;
            //reconsider condition 
            return !issue.isChanged('project') && !issue.becomesReported && issue.isReported && (issue.Type.name == ctx.Type.TestExecution.name);
          },
          targetState: 'Failed',
          action: function(ctx) {
            var issue = ctx.issue;
            if (!issue.links['subtask of'].isEmpty) {
             var parent = issue.links['subtask of'].first();
              var TestRunList = parent.links[ctx.Subtask.outward];
              var resultSet = null;
              TestRunList.forEach(function(v) {
                if (v.Status.name == ctx.Status.Failed.name) {
                } else if ((v.Status.name == ctx.Status.InProgress.name) && (v.id !== issue.id)) {
                  resultSet = v;
                }
              });
              if (resultSet) {
                var otherIssueLink = '<a href="' + resultSet.url + '"> ' + resultSet.id + '</a>';
                var message = 'Switch to next open test in current Test Run' + otherIssueLink + '.';
                workflow.message(message);
                // Updating Test Run Status 
                parent.fields["Status"] = ctx.Status.Failing;
              } else {
                parent.Status = ctx.Status.Failed;
              }
            }
          }
        },
        'No Run': {
          guard: function(ctx) {
            var issue = ctx.issue;
            //reconsider condition 
            return !issue.isChanged('project') && !issue.becomesReported && issue.isReported && (issue.Type.name == ctx.Type.TestExecution.name);
          },
          targetState: 'No Run',
          action: function(ctx) {
            var issue = ctx.issue;
            if (!issue.links['subtask of'].isEmpty) {
              var parent = issue.links['subtask of'].first();
              var TestRunList = parent.links[ctx.Subtask.outward];
              var ActiveTestRun = false;
              var isPassing = true;
              TestRunList.forEach(function(v) {
                if (v.Status.name == ctx.Status.Failed.name) {
                  isPassing = false;
                  ActiveTestRun = true;
                } else if ((v.Status.name == ctx.Status.Passed.name) && (v.id !== issue.id)) {
                  ActiveTestRun = true;
                }
              });
              // Updating Test Run Status 
              if (ActiveTestRun) {
                parent.fields["Status"] = (isPassing) ? ctx.Status.Passing : ctx.Status.Failing;
              } else parent.fields["Status"] = ctx.Status.InProgress;
            }
          }
        }
      }
    },
    Failed: {
      transitions: {
        'Passed': {
          guard: function(ctx) {
            var issue = ctx.issue;
            //reconsider conditions 
            return !issue.isChanged('project') && !issue.becomesReported && issue.isReported && (issue.Type.name == ctx.Type.TestExecution.name);
          },
          targetState: 'Passed',
          action: function(ctx) {
            var issue = ctx.issue;
            if (!issue.links['subtask of'].isEmpty) {
              var parent = issue.links['subtask of'].first();
              var TestRunList = parent.links[ctx.Subtask.outward];
              var resultSet = null;
              var isPassing = true;
              TestRunList.forEach(function(v) {
                if ((v.Status.name == ctx.Status.Failed.name) && (v.id !== issue.id)) {
                  isPassing = false;
                } else if ((v.Status.name == ctx.Status.InProgress.name) && (v.id !== issue.id)) {
                  resultSet = v;
                }
              });
              if (resultSet) {
                var otherIssueLink = '<a href="' + resultSet.url + '"> ' + resultSet.id + '</a>';
                var message = 'Switch to next open test in current Test Run' + otherIssueLink + '.';
                workflow.message(message);

                // Updating Test Run Status 
                parent.fields["Status"] = (isPassing) ? ctx.Status.Passing : ctx.Status.Failing;
              } else {
                parent.fields["Status"] = (isPassing) ? ctx.Status.Passed : ctx.Status.Failed;
              }
            }
          }
        },
        'No Run': {
          guard: function(ctx) {
            var issue = ctx.issue;
            //reconsider condition 
            return !issue.isChanged('project') && !issue.becomesReported && issue.isReported && (issue.Type.name == ctx.Type.TestExecution.name);
          },
          targetState: 'No Run',
          action: function(ctx) {
            var issue = ctx.issue;
            if (!issue.links['subtask of'].isEmpty) {
              var parent = issue.links['subtask of'].first();
              var TestRunList = parent.links[ctx.Subtask.outward];
              var ActiveTestRun = false;
              var isPassing = true;
              TestRunList.forEach(function(v) {
                if ((v.Status.name == ctx.Status.Failed.name) && (v.id !== issue.id)) {
                  isPassing = false;
                  ActiveTestRun = true;
                } else if ((v.Status.name == ctx.Status.Passed.name) && (v.id !== issue.id)) {
                  ActiveTestRun = true;
                }
              });
              // Updating Test Run Status 
              if (ActiveTestRun) {
                parent.fields["Status"] = (isPassing) ? ctx.Status.Passing : ctx.Status.Failing;
              } else parent.fields["Status"] = ctx.Status.InProgress;
            }
          }
        }
      }
    }
  },
  alternativeMachines: {
    'Test Run': {
      'No Run': {
        initial: true,
        transitions: {
          'Failing': {
            targetState: 'Failing',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Failed': {
            targetState: 'Failed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Passing': {
            targetState: 'Passing',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Passed': {
            targetState: 'Passed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          }
        }
      },
      // Failing state   
      Failing: {
        transitions: {
          'Passing': {
            targetState: 'Passing',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Passed': {
            targetState: 'Passed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Failed': {
            targetState: 'Failed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          }
        }
      },
      //PAssing state

      Passing: {
        transitions: {
          'Failing': {
            targetState: 'Passing',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has-read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Passed': {
            targetState: 'Passed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Failed': {
            targetState: 'Failed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          }
        }
      },
      //Failed state  
      Failed: {
        transitions: {
          'Passing': {
            targetState: 'Passing',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Passed': {
            targetState: 'Passed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Failing': {
            targetState: 'Failed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          }
        }
      },
      // Passed state
      Passed: {
        transitions: {
          'Passing': {
            targetState: 'Passing',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          },
          'Failed': {
            targetState: 'Passed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            },
          },
          'Failing': {
            targetState: 'Failed',
            action: function(ctx) {
              workflow.check(false, workflow.i18n('Test Run has read-only status which is defined based on assigned tests statuses'));
            }
          }
        }
      }
    }
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    },
    Status: {
      type: entities.EnumField.fieldType,
      InProgress: {
        name: 'No Run'
      },
      Failing: {
        name: 'Failing'
      },
      Passing: {
        name: 'Passing'
      },
      Passed: {
        name: 'Passed'
      },
      Failed: {
        name: 'Failed'
      },
    },
    Type: {
      type: entities.EnumField.fieldType,
      TestRun: {
        name: "Test Run"
      },
      TestExecution: {
        name: "Test Case Execution"
      }
    },
    Subtask: {
      type: entities.IssueLinkPrototype,
      name: 'Subtask',
      inward: 'subtask of',
      outward: 'parent for'
    },
  }
});