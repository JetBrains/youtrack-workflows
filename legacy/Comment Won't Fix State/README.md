Comment Won't Fix State 
====================

Require adding a comment when changing state to Won't fix.
Require adding comment when moving to Won't Fix state
```java
rule Comment when won't fix

when issue.State.becomes({Won't fix}) {
  assert comments.added.isNotEmpty: "Please comment!";
}
```
