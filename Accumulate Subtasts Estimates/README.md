Accumulate Subtasks Estimations
===============================
This workflow sums subtasks estimations and save it to parent issue. Supports multilevel parent-subtasks trees.

>Requirements:
>    field 'IntEstimation' of type 'integer'

```java
rule Accumulate subtasks estimates 
 
when IntEstimation.changed { 
  var parent = subtask of.first; 
  if (parent != null) { 
    var estimation = 0; 
    for each subtask in parent.parent for { 
      estimation = estimation + subtask.IntEstimation; 
    } 
    parent.IntEstimation = estimation; 
  } 
}
```