'Waiting for Reply' Tag Management 
====================
Replace 'waiting for reply' tag with 'answered' when a developer adds a comment.

>Requirements: group 'developers'

```java
rule Set tag waiting for reply (answered)

when comments.added.isNotEmpty {
  if (!comments.added.last.author.isInGroup("developers")) {
    removeTag("waiting for reply");
    addTag("waiting for reply (answered?)");
  }
}
```
