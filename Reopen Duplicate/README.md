Reopen Duplicate 
====================
Reopen an issue if all duplicate links are removed.
```java
rule Reopen issue on removing last duplicates link

when duplicates.changed && duplicates.isEmpty {
  State = {Open};
}
```
