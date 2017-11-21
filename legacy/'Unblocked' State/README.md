'Unblocked' State 
====================
Provide an ability to have the issue unblocked (denoted with a "is blocked by" - "blocks" relationship) when the last remaining blocker is resolved and the issue has no remaining blockers.

>Requirements: link types 'blocks' - 'is blocked by'

```java
rule unblock on blockers resolving

when issue.State.isResolved && !issue.State.oldValue.isResolved {
  for each dependant in issue.blocks {
    if (dependant.is blocked by.first == dependant.is blocked by.last) { //e.g. it's source issue
      dependant.State = {Unblocked};
    }
  }
}
```
