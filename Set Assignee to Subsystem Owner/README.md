Set Assignee to Subsystem Owner 
====================

Set subsystem owner as assignee for new issues when subsystem is specified.

Set subsystem owner as assignee for new issues
```java
rule Set subsystem owner as assignee for unassigned issues

when Assignee == null && (((Subsystem.changed || project.changed) && isReported()) || becomesReported()) {
  if (issue.Subsystem != null) {
    issue.Assignee = issue.Subsystem.owner;
  }
}             `
```
