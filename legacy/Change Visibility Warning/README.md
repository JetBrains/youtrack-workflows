Change Visibility Warning
====================
Warn on change of issue visibility.

>Requirements: group 'developers'

```java
rule issueVisibility

when permittedGroup.changed {
  var msg = "To post non-public data, please make the issue public instead and add protected attachments and/or comments.";
  assert loggedInUser.isInGroup("developers"): msg;
}
```
