Set Assignee to Subsystem Owner 
====================

In the moment of issue reporting subsystem owner set as assignee.

Set subsystem owner as assignee for new issues when subsystem is specified
```java
rule Set subsystem owner as assignee for unassigned issues

when Assignee == null && (((Subsystem.changed || project.changed) && isReported()) || becomesReported()) {
  if (issue.Subsystem != null) {
    issue.Assignee = issue.Subsystem.owner;
  }
}             `
```
