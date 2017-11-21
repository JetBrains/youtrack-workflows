Deny Certain Combination of Field Values 
====================

Disable a certain combination of field values.

Denied Combinations
```java
rule deniedCombinations

when <issue created or updated> {
  assert !(Priority == {Show-stopper} && State == {Submitted}):
 "Denied fields combination detected (Submitted Show-stopper)";

  assert !(State == {Open} && Assignee == null):
 "Denied fields combination detected (Open Unassigned)";
}
```
