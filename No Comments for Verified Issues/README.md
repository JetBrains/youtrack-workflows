No Comments for Verified Issues 
====================

Disable adding comments to a verified issue.

No Comments for Verified Issues
```java
rule No Comments for Verified Issues

when State == {Verified} && !State.becomes({Verified}) {
  assert comments.added.isEmpty: "Commenting fixed and verified issues is disabled.";
}
```
