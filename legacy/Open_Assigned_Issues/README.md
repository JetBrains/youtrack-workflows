'Open' Assigned Issues 
====================
Change an issue state to Open when an assignee is added.
```java
rule Open assigned issues 
 
when Assignee != null && Assignee.changed && Assignee.oldValue == null { 
  State = {Open}; 
}
```
