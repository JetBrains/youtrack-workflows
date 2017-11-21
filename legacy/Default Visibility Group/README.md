Default Visibility Group 
====================
Set the default visibility group for all new issues in a project.

>Requirements:
>    group 'Reporters'
>    group 'developers'

```java
rule set permitted group for new issues

when !isReported() && reporter.isInGroup("Reporters") {
  permittedGroup = {developers};
}
```
