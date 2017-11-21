Assignee and Multiple Subsystems  
====================
When a Subsystem is changed, set issue assignee to the subsystem owner.

>Requirements: field 'Subsystems' of type 'ownedField[*]'

```java
rule Set assignee from Subsystems

when Subsystems.changed {
  var owner = null;
  for each subsystem in Subsystems {
    if (owner == null) {
      owner = subsystem.owner;
    } else if (subsystem.owner != owner) {
      owner = null;
      break;
    }
  }
  if (owner != null && Assignee == null) {
    Assignee = owner;
  }
}
```
