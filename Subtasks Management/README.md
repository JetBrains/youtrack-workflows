Subtasks Management 
====================

Parent task reopening.

>Requirements: state "Open"

Open parent task on any subtask open
```java
rule Open parent task on any subtask open

when !State.isResolved && (State.oldValue != null && State.oldValue.isResolved) && subtask of.isNotEmpty {
  for each parent in subtask of {
    if (parent.isResolved()) {
      parent.State = {Open};
      message("Automatically reopen " + parent.Type + " " + parent.getId());
    }
  }
}
```
Resolve parent task on all subtasks resolved
```java
rule Resolve parent task on all subtasks resolved

when State.isResolved && (State.oldValue == null || !State.oldValue.isResolved) && subtask of.isNotEmpty {
  for each parent in subtask of {
    if (!parent.isResolved()) {
      var allSubtasksResolved = true;
      for each subtask in parent.parent for {
        if (!(subtask.isResolved())) {
          allSubtasksResolved = false;
          break;
        }
      }
      if (allSubtasksResolved) {
        parent.State = {Fixed};
        message("Automatically fix " + parent.Type + " " + parent.getId());
      }
    }
  }
}
```
