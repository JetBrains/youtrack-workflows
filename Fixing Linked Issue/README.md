Fixing Linked Issues
====================

Prohibit moving an issue to Fixed state if it 'depends on' unresolved issue(s).

Disable fixing issues with unresolved dependencies
```java
rule Do not allow fix issue with unresolved dependencies

when State.becomes({Fixed}) && depends on.isNotEmpty {
  for each dep in depends on {
assert dep.State.isResolved: "The issue has unresolved dependencies and cannot be Fixed!";
  }
}
```
