Due Date Management 
====================

Disable submitting an issue without a Due Date set. Notify the issue assignee about overdue issues.

>Requirements: field 'Due date' is attached to project

Disable submitting an issue without a due date
```java
rule Don't allow to submit issue without Due Date set

when !issue.isReported() {
  Due date.required("Please set the Due Date!");
}
```
Notify an issue assignee about overdue issues
```java
schedule rule Notify assignee about overdue issues

daily at 10 : 00 : 00 [now > issue.Due Date] {
  var user;
  if (issue.Assignee == null) {
    user = issue.project.leader;
  } else {
    user = issue.Assignee;
  }
  user.notify("Issue is overdue", "Please see the issue: " + issue.getId());
}
```
