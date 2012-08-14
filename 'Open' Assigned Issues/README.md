'Open' Assigned Issues 
====================
Change an issue state to Open when an assignee is added.
```java
rule Open issue on set Assignee

when Assignee != null && Assignee.changed && Assignee.oldValue == null {
  State = {Open};
}
```
