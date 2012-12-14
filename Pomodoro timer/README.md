Pomodoro timer 
====================
It implements the popular time tracking technique 'Pomodoro' (http://www.pomodorotechnique.com) in YouTrack.

>Requirements:
>    'Pomodoro state' of type state[1],
>    'Pomodoro interruption' of type enum[1],
>    'Pomodoro coutdown' of type integer

The rule defines timer state transitions
```java
statemachine Pomodoro states for field Pomodoro state { 
 
  initial state Not set { 
    on start[always] do {<define statements>} transit to Timer’s running 
  } 
    
  state Timer’s running { 
    enter { 
      Pomodoro interruption = null; 
      message("25 minutes pomodoro is started."); 
      Pomodoro countdown = 25; 
    } 
      
    on interrupt[always] do { 
      Pomodoro interruption.required("Please specify the interruption cause."); 
      applyCommand("add work Today " + (25 - Pomodoro countdown) + "m " + " Pomodoro was interrupted. The cause: '" + Pomodoro interruption.name + "'."); 
      Pomodoro countdown = null; 
    } transit to Not set 
      
    in 25 minutes[always] do {<define statements>} transit to Timer finished 
  } 
    
  state Timer finished { 
    on take a break[always] do { 
      message("5 minutes break."); 
      applyCommand("add work Today 25m" + " +1 pomodoro."); 
      Pomodoro countdown = 5; 
    } transit to On a break 
      
    on discard[always] do { 
      Pomodoro interruption.required("Please specify the interruption cause."); 
      applyCommand("add work Today " + "25m" + " Pomodoro was discarded. The cause: '" + Pomodoro interruption.name + "'."); 
      Pomodoro countdown = null; 
    } transit to Not set 
  } 
    
  state On a break { 
    on start[always] do { 
      applyCommand("add work Today " + (5 - Pomodoro countdown) + "m " + " +1 short break."); 
    } transit to Timer’s running 
      
    in 5 minutes[always] do { 
      applyCommand("add work Today 5m" + " +1 break."); 
    } transit to Not set 
  } 
 
}
```
The countdown
```java
rule Don't change reason manually 
 
when Pomodoro interruption.changed { 
  var causes = Pomodoro interruption == {Boss interrupted} || Pomodoro interruption == {Facebook chat} || Pomodoro interruption == {Phone call} || Pomodoro interruption == {Urgent email}; 
   
  assert Pomodoro state.changed: "Cannot change the interruption cause without changing the timer state."; 
}
```
The guard rule
```java
rule Don't change reason manually 
 
when Pomodoro interruption.changed { 
  var causes = Pomodoro interruption == {Boss interrupted} || Pomodoro interruption == {Facebook chat} || Pomodoro interruption == {Phone call} || Pomodoro interruption == {Urgent email}; 
   
  assert Pomodoro state.changed: "Cannot change the interruption cause without changing the timer state."; 
}
```
